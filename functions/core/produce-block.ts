import { Buffer } from 'node:buffer';
import * as crypto from 'node:crypto';

import { create, toBinary } from '@bufbuild/protobuf';
import type { AnyJson } from '@bufbuild/protobuf/wkt';
import {
	createBlock,
	createBlockBody,
	createBlockHeader,
	getBlockSignBytes,
	TxSchema,
	TxsSchema,
	type Block,
	type BlockHeader,
	type PublicKey,
	type Tx,
	type TxResponse,
	type Txs
} from '@supabase-l2-blockchain/types/core';
import { eq } from 'drizzle-orm';
import { MerkleTree } from 'merkletreejs';

import type { Chain } from '../chain.ts';
import {
	block_bodies,
	block_headers,
	blocks,
	convertBlock,
	convertBlockBody,
	convertBlockHeader
} from './schema/blocks.ts';
import type { CoreSchema } from './schema/mod.ts';
import { txs as tableTxs } from './schema/txs.ts';
import { stateTransition } from './state-transition.ts';

/**
 *
 * @param chain
 * @param sortedTxsWithHash
 * @param signHandler
 * @returns Block
 */
export async function produceBlock(
	chain: Chain<CoreSchema>,
	sortedTxsWithHash: { hash: string; tx: Tx }[],
	signHandler: (signer: PublicKey, signBytes: Uint8Array) => Promise<Uint8Array>
): Promise<Block> {
	// Get last block info
	const lastBlock = await chain.db.query.blocks.findFirst({
		where: (block, { eq }) => eq(block.chain_id, chain.id),
		orderBy: (block, { desc }) => [desc(block.height)]
	});
	if (!lastBlock) {
		throw Error("Last block doesn't exist");
	}

	// Get last block body
	const lastBlockBody = await chain.db.query.block_bodies.findFirst({
		where: (blockBody, { eq }) => eq(blockBody.block_hash, lastBlock.hash)
	});

	if (!lastBlockBody) {
		throw Error("Last block body doesn't exist");
	}

	// Prepare signers
	const signersAny = lastBlockBody.next_signers as AnyJson[];
	const signers = signersAny.map((signerAny) =>
		chain.moduleRegistry.extractAnyJson<PublicKey>(signerAny)
	);

	const txResponses: { [hash: string]: TxResponse } = {};

	let block: Block;

	await chain.db.transaction(async (dbTx) => {
		for (const txWithHash of sortedTxsWithHash) {
			await dbTx.transaction(async (dbTxForOneTx) => {
				// Must use dbTxForOneTx
				const txResponse = await stateTransition(chain, dbTxForOneTx, txWithHash.tx);

				txResponses[txWithHash.hash] = txResponse;

				// Rollback dbTxForOneTx if the tx is failed
				if (!txResponse.success) {
					dbTxForOneTx.rollback();
				}

				// Update tx row with height and response
				await dbTx
					.update(tableTxs)
					.set({
						height: lastBlock.height + 1,
						success: txResponse.success,
						inspection_error: txResponse.inspection_error || null,
						msg_responses: txResponse.msg_responses
					})
					.where(eq(tableTxs.hash, txWithHash.hash));
			});
		}

		// Create success txs list
		// TODO: optimize parallelization
		const txs: Txs = create(TxsSchema, {
			strategy: {
				case: 'series',
				value: {
					txs: sortedTxsWithHash
						.filter((txWithHash) => txResponses[txWithHash.hash].success)
						.map((txWithHash) =>
							create(TxsSchema, {
								strategy: {
									case: 'tx',
									value: txWithHash.tx
								}
							})
						)
				}
			}
		});

		// Create new block header object
		const blockHeader = createBlockHeaderFromRawTxs(
			chain.id,
			lastBlock.height,
			lastBlock.hash,
			// TODO: use txs instead of sortedTxsWithHash
			sortedTxsWithHash.map((tx) => tx.tx)
		);
		const signBytes = getBlockSignBytes(blockHeader);

		// Create Signatures
		const signatures = await Promise.all(
			signers.map(async (signer) => await signHandler(signer, signBytes))
		);

		// Create new block body object
		const blockBody = createBlockBody(txs, signers, signatures);

		// Create block hash
		const hash = crypto.createHash('sha256').update(signBytes).digest();

		await dbTx.insert(block_headers).values(convertBlockHeader(blockHeader));
		await dbTx.insert(block_bodies).values(convertBlockBody(hash, blockBody));
		await dbTx.insert(blocks).values(convertBlock(hash, blockHeader));

		// Create new block object
		block = createBlock(hash, blockHeader, blockBody);
	});

	return block!;
}

function createBlockHeaderFromRawTxs(
	chainId: string,
	lastHeight: number,
	lastBlockHash: string,
	txs: Tx[]
): BlockHeader {
	const merkleTree = new MerkleTree(
		txs.map((tx) => toBinary(TxSchema, tx)),
		(value: Buffer) => crypto.createHash('sha256').update(value).digest()
	);
	const txsRoot = merkleTree.getRoot();

	return createBlockHeader(
		chainId,
		BigInt(lastHeight + 1),
		new Date(),
		Buffer.from(lastBlockHash, 'hex'),
		txsRoot
	);
}
