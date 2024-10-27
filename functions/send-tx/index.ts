import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { drizzle as createDrizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import type { Tx } from '../../types/tx.ts';
import { registerModules, Registry } from '../modules/registry.ts';
import { supabaseClient } from '../supabase-client.ts';
import type { Module } from '../types/module.ts';

export function sendTxFactory(supabaseDbUrl: string, modules: Module[]): Deno.ServeHandler {
	const supabase = supabaseClient();

	const pg = postgres(supabaseDbUrl, {
		prepare: false,
		ssl: true
	});
	const drizzle = createDrizzle(pg);

	const registry = new Registry();
	registerModules(registry, ...modules);

	return async (req) => {
		const { tx }: { tx: Tx } = await req.json();
		const res: any[] = [];

		await drizzle.transaction(async (dbTx) => {
			for (const inspector of registry.inspectors) {
				await inspector(supabase, dbTx, tx);
			}

			for (const msg of tx.body.msgs) {
				const MsgConstructor = registry.msgs[msg.type];
				if (!MsgConstructor) {
					throw new Error(`Unknown message type: ${msg.type}`);
				}
				const msgInstance = new MsgConstructor(msg.value);
				res.push(await msgInstance.stateTransitionFunction(supabase, dbTx));
			}
		});

		return new Response(JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } });
	};
}
