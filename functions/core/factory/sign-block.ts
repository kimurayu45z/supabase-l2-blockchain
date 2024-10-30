import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { Buffer } from 'node:buffer';
import * as crypto from 'node:crypto';

import type {
	Any,
	BlockBody,
	BlockHeader,
	Tx
} from '@supabase-l2-blockchain/types/core/index.d.ts';
import { MerkleTree } from 'merkletreejs';

import { getSignBytes } from '../../types/block.ts';
import { canonicalizeObjectForSerialization } from '../../types/crypto/json.ts';
import type { PublicKey } from '../../types/crypto/public-key.ts';
import type { Chain } from '../chain.ts';
import { produceBlock } from '../produce-block.ts';
import type { CoreSchema } from '../schema/mod.ts';

export function signBlockFactory(
	chain: Chain<CoreSchema>,
	signHandler: (signer: PublicKey, signBytes: Buffer) => Promise<Buffer>,
	postBlockHandler: (blockBytes: Buffer) => Promise<void>
): Deno.ServeHandler {
	return async (_) => {
		const lastBlock = await chain.db.query.blocks.findFirst({
			where: (block, { eq }) => eq(block.chain_id, chain.id),
			orderBy: (block, { desc }) => [desc(block.height)]
		});
		if (!lastBlock) {
			throw Error();
		}

		const lastBlockBody = await chain.db.query.block_bodies.findFirst({
			where: (blockBody, { eq }) => eq(blockBody.block_hash, lastBlock.hash)
		});
		if (!lastBlockBody) {
			throw Error();
		}

		const pendingTxs = await chain.db.query.txs
			.findMany({
				where: (tx, { isNull }) => isNull(tx.height)
			})
			.then((txs) =>
				txs.map(
					(tx) => ({ body: tx.body, auth_info: tx.auth_info, signatures: tx.signatures }) as Tx
				)
			);
		if (!pendingTxs) {
			throw Error();
		}

		const blockHeader = createBlockHeader(chain.id, lastBlock.height, lastBlock.hash, pendingTxs);
		const signBytes = getSignBytes(blockHeader);

		const signatures = await Promise.all(
			(lastBlockBody.next_signers as Any[]).map(async (signerAny) => {
				const signer = chain.moduleRegistry.extractAny<PublicKey>(signerAny);
				return await signHandler(signer, signBytes);
			})
		);

		const blockBody: BlockBody = {
			txs: pendingTxs,
			next_signers: lastBlockBody.next_signers as Any[],
			signatures: signatures.map((signature) => signature.toString('hex'))
		};

		const block = await produceBlock(chain, blockHeader, blockBody);
		const res = canonicalizeObjectForSerialization(block);

		const blockBytes = Buffer.from(JSON.stringify(res));
		await postBlockHandler(blockBytes).catch((_) => {});

		return new Response(JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } });
	};
}

function createBlockHeader(
	chainId: string,
	lastHeight: number,
	lastBlockHash: string,
	txs: Tx[]
): BlockHeader {
	const merkleTree = new MerkleTree(
		txs.map((tx) => Buffer.from(JSON.stringify(canonicalizeObjectForSerialization(tx)))),
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
