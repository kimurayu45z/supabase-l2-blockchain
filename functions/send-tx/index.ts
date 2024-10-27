// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import type { Tx } from '../../types/tx.ts';
import { registerModules, type MsgRegistry } from '../modules/registry.ts';
import { supabaseClient } from '../supabase-client.ts';
import type { Module } from '../types/module.ts';

export function sendTxfactory(modules: Module[]): Deno.ServeHandler {
	const supabase = supabaseClient();

	const registry: MsgRegistry = {};
	registerModules(registry, ...modules);

	return async (req) => {
		const { tx }: { tx: Tx } = await req.json();
		const msg = tx.body.msg;

		const MsgConstructor = registry[msg.type];
		if (!MsgConstructor) {
			throw new Error(`Unknown message type: ${msg.type}`);
		}
		const msgInstance = new MsgConstructor(msg.value);
		const res = await msgInstance.stateTransitionFunction(supabase);

		return new Response(JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } });
	};
}
