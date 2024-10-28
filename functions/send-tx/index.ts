import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import type { Tx } from '../../types/tx.ts';
import type { Chain } from '../lib/chain.ts';
import { postgresDatabase } from '../lib/drizzle.ts';
import type { MsgResponse } from '../lib/types/msg.ts';

export function sendTxFactory<Schema extends Record<string, unknown>>(
	chain: Chain<Schema>
): Deno.ServeHandler {
	const drizzle = postgresDatabase(chain.db.url, chain.db.schema);

	return async (req) => {
		const { tx }: { tx: Tx } = await req.json();
		const res: MsgResponse[] = [];

		await drizzle.transaction(async (dbTx) => {
			try {
				for (const inspector of chain.moduleRegistry.inspectors) {
					await inspector(chain, dbTx, tx);
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
