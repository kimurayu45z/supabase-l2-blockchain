import '@supabase/functions-js/edge-runtime.d.ts';

import type { SendTxRequestBody } from '@supabase-l2-blockchain/types/core';

import type { Chain } from '../../chain.ts';
import { getTxHash } from '../../types/tx.ts';
import type { CoreSchema } from '../schema/mod.ts';
import { txs } from '../schema/txs.ts';

export function sendTxFactory<Schema extends CoreSchema>(chain: Chain<Schema>): Deno.ServeHandler {
	return async (req) => {
		const { tx }: SendTxRequestBody = await req.json();
		if (!tx) {
			return new Response(JSON.stringify({ error: 'tx is required' }), { status: 400 });
		}

		const hash = getTxHash(tx).toString('hex');

		await chain.db.insert(txs).values({
			hash: hash,
			body: tx.body,
			auth_info: tx.auth_info,
			signatures: tx.signatures
		});

		const res: { hash: string } = { hash: hash };

		return new Response(JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } });
	};
}
