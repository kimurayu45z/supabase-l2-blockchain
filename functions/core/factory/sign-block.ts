import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { Buffer } from 'node:buffer';
import * as crypto from 'node:crypto';

import { MerkleTree } from 'merkletreejs';

import type { BlockHeader } from '../../../types/block.ts';
import { canonicalizeObjectForSerialization } from '../../../types/json.ts';
import type { Tx } from '../../../types/tx.ts';
import type { Chain } from '../../chain.ts';
import { getSignBytes, produceBlock } from '../produce-block.ts';
import type { CoreSchema } from '../schema/mod.ts';

export function signBlockFactory(
	chain: Chain<CoreSchema>,
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
			where: (blockBody, { eq }) => eq(blockBody.body_hash, lastBlock.body_hash)
		});

		if (!lastBlockBody) {
			throw Error();
		}

		const blockHeader = createBlockHeader(
			chain.id,
			lastBlock.height,
			lastBlock.hash,
			lastBlockBody.txs as Tx[]
		);

		const signBytes = getSignBytes(blockHeader);

		const signatures = [] as string[];

		const block = await produceBlock(chain, blockHeader, signatures);
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
