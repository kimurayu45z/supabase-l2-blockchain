import { Buffer } from 'node:buffer';

import type { SendTxRequest, SendTxResponse } from '@supabase-l2-blockchain/types/core';

import type { Chain } from '../../../chain.ts';
import { corsHeaders } from '../../../cors.ts';
import type { CoreSchema } from '../../schema/mod.ts';
import { sendTx } from './send-tx.ts';

export function sendTxFactory<Schema extends CoreSchema>(chain: Chain<Schema>): Deno.ServeHandler {
	return async (req: Request) => {
		if (req.method === 'OPTIONS') {
			return new Response('ok', { headers: corsHeaders });
		}

		try {
			const { txBinary }: SendTxRequest = await req.json();
			const txHash = await sendTx(chain, Buffer.from(txBinary, 'base64'));

			const res: SendTxResponse = {
				txHash: txHash
			};

			return new Response(JSON.stringify(res), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 200
			});
		} catch (error) {
			return new Response(JSON.stringify({ error: (error as Error).message }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 400
			});
		}
	};
}
