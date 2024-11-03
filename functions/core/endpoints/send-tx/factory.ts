import { Buffer } from 'node:buffer';

import type { SendTxRequest, SendTxResponse } from '@supabase-l2-blockchain/types/core';

import type { Chain } from '../../../chain.ts';
import type { CoreSchema } from '../../schema/mod.ts';
import { sendTx } from './send-tx.ts';

export function sendTxFactory<Schema extends CoreSchema>(chain: Chain<Schema>): Deno.ServeHandler {
	return async (req: Request) => {
		const { txBinary }: SendTxRequest = await req.json();
		const txHash = await sendTx(chain, Buffer.from(txBinary, 'base64'));

		const res: SendTxResponse = {
			txHash: txHash
		};

		return new Response(JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } });
	};
}
