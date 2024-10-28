import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import type { Tx } from '../../types/tx.ts';
import { postgresDatabase } from '../lib/drizzle.ts';
import type { ModuleRegistry } from '../lib/modules/module-registry.ts';
import type { MsgResponse } from '../lib/types/msg.ts';

export function sendTxFactory<Schema extends Record<string, unknown>>(
	db: { url: string; schema: Schema },
	registry: ModuleRegistry<Schema>
): Deno.ServeHandler {
	const drizzle = postgresDatabase(db.url, db.schema);

	return async (req) => {
		const { tx }: { tx: Tx } = await req.json();
		const res: MsgResponse[] = [];

		await drizzle.transaction(async (dbTx) => {
			try {
				for (const inspector of registry.inspectors) {
					await inspector(dbTx, tx);
				}

				for (const msg of tx.body.msgs) {
					const MsgConstructor = registry.msgs[msg.type];
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
