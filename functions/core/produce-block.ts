import type { Buffer } from 'node:buffer';
import * as crypto from 'node:crypto';

import type {
	Any,
	Block,
	BlockBody,
	BlockHeader,
	Tx,
	TxResponse
} from '@supabase-l2-blockchain/types/core';
import { eq } from 'drizzle-orm';
import { MerkleTree } from 'merkletreejs';

import type { Chain } from '../chain.ts';
import { getBlockSignBytes } from '../types/block.ts';
import type { PublicKey } from '../types/crypto/public-key.ts';
import { getTxBytes } from '../types/tx.ts';
import { block_bodies, block_headers, blocks } from './schema/blocks.ts';
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
	signHandler: (signer: PublicKey, signBytes: Buffer) => Promise<Buffer>
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
	const signersAny = lastBlockBody.next_signers as Any[];
	const signers = signersAny.map((signerAny) =>
		chain.moduleRegistry.extractAny<PublicKey>(signerAny)
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
		const txs: Tx[] = sortedTxsWithHash
			.filter((txWithHash) => txResponses[txWithHash.hash].success)
			.map((txWithHash) => txWithHash.tx);

		// Create new block header object
		const blockHeader = createBlockHeader(
			chain.id,
			lastBlock.height,
			lastBlock.hash,
			sortedTxsWithHash.map((tx) => tx.tx)
		);
		const signBytes = getBlockSignBytes(blockHeader);

		// Create Signatures
		const signatures = await Promise.all(
			signers.map(async (signer) => await signHandler(signer, signBytes))
		);

		// Create new block body object
		const blockBody: BlockBody = {
			txs: txs,
			next_signers: signersAny,
			signatures: signatures.map((signature) => signature.toString('hex'))
		};

		// Create block hash
		const hash = crypto.createHash('sha256').update(signBytes).digest('hex');

		await dbTx.insert(block_headers).values(blockHeader);
		await dbTx.insert(block_bodies).values({ block_hash: hash, ...blockBody });
		await dbTx.insert(blocks).values({
			hash: hash,
			chain_id: blockHeader.chain_id,
			height: blockHeader.height
		});

		// Create new block object
		block = {
			hash: hash,
			header: blockHeader,
			body: blockBody
		};
	});

	return block!;
}

function createBlockHeader(
	chainId: string,
	lastHeight: number,
	lastBlockHash: string,
	txs: Tx[]
): BlockHeader {
	const merkleTree = new MerkleTree(
		txs.map((tx) => getTxBytes(tx)),
		(value: Buffer) => crypto.createHash('sha256').update(value).digest()
	);
	const txsRoot = merkleTree.getRoot();

	return {
		chain_id: chainId,
		height: lastHeight + 1,
		time: new Date(),
		last_block_hash: lastBlockHash,
		txs_merkle_root: txsRoot.toString('hex')
	};
}
