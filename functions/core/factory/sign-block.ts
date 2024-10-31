import '@supabase/functions-js/edge-runtime.d.ts';

import { Buffer } from 'node:buffer';

import type { Tx } from '@supabase-l2-blockchain/types/core';

import type { Chain } from '../../chain.ts';
import { canonicalizeObjectForSerialization } from '../../types/crypto/json.ts';
import type { PublicKey } from '../../types/crypto/public-key.ts';
import { getTxHash } from '../../types/tx.ts';
import { produceBlock } from '../produce-block.ts';
import type { CoreSchema } from '../schema/mod.ts';

export function signBlockFactory(
	chain: Chain<CoreSchema>,
	signHandler: (signer: PublicKey, signBytes: Buffer) => Promise<Buffer>,
	postBlockHandler: (blockBytes: Buffer) => Promise<void>
): Deno.ServeHandler {
	return async (_) => {
		const pendingTxs = await chain.db.query.txs.findMany({
			where: (tx, { isNull }) => isNull(tx.height),
			orderBy: (tx, { asc }) => [asc(tx.created_at)]
		});
		if (pendingTxs.length === 0) {
			return new Response(JSON.stringify({ error: 'No pending txs' }), { status: 400 });
		}

		const sortedTxsWithHash = pendingTxs.map((tx) => ({
			hash: getTxHash(tx).toString('hex'),
			tx: {
				body: tx.body,
				auth_info: tx.auth_info,
				signatures: tx.signatures
			} as Tx
		}));

		const block = await produceBlock(chain, sortedTxsWithHash, signHandler);
		const res = canonicalizeObjectForSerialization(block);

		const blockBytes = Buffer.from(JSON.stringify(res));
		await postBlockHandler(blockBytes).catch((_) => {});

		return new Response(JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } });
	};
}
