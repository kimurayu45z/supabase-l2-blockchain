import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import type { Tx } from '../../types/tx.ts';
import { registerModules, Registry } from '../modules/registry.ts';
import { supabaseClient } from '../supabase-client.ts';
import type { Module } from '../types/module.ts';

export function sendTxFactory(modules: Module[]): Deno.ServeHandler {
	const supabase = supabaseClient();

	const registry = new Registry();
	registerModules(registry, ...modules);

	return async (req) => {
		const { tx }: { tx: Tx } = await req.json();

		for (const inspector of registry.inspectors) {
			await inspector(supabase, tx);
		}

		const msg = tx.body.msg;

		const MsgConstructor = registry.msgs[msg.type];
		if (!MsgConstructor) {
			throw new Error(`Unknown message type: ${msg.type}`);
		}
		const msgInstance = new MsgConstructor(msg.value);
		const res = await msgInstance.stateTransitionFunction(supabase);

		return new Response(JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } });
	};
}
