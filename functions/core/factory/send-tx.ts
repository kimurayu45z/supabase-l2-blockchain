import '@supabase/functions-js/edge-runtime.d.ts';

import type { SendTxRequestBody } from '@supabase-l2-blockchain/types/core/index.d.ts';

import type { Chain } from '../../chain.ts';
import type { MsgResponse } from '../../types/msg.ts';

export function sendTxFactory<Schema extends Record<string, unknown>>(
	chain: Chain<Schema>
): Deno.ServeHandler {
	return async (req) => {
		const { tx }: SendTxRequestBody = await req.json();
		const res: MsgResponse[] = [];

		await chain.db.transaction(async (dbTx) => {
			try {
				for (const moduleName in chain.moduleRegistry.modules) {
					await chain.moduleRegistry.modules[moduleName].inspector(chain, dbTx, tx);
				}

				for (const msg of tx.body.msgs) {
					const MsgConstructor = chain.moduleRegistry.msgs[msg.type];
					if (!MsgConstructor) {
						throw new Error(`Unknown message type: ${msg.type}`);
					}
					const msgInstance = new MsgConstructor(msg.value);
					res.push(await msgInstance.stateTransitionFunction(dbTx));
				}
			} catch (e) {
				dbTx.rollback();
				throw e;
			}
		});

		return new Response(JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } });
	};
}
