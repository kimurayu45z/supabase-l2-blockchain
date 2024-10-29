import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import type { Chain } from '../chain.ts';

export function signBlockFactory<Schema extends Record<string, unknown>>(
	chain: Chain<Schema>
): Deno.ServeHandler {
	return async (req) => {
		const {} = await req.json();

		const res = {};

		return new Response(JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } });
	};
}
