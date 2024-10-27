import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { supabaseClient } from '../supabase-client.ts';

export function signBlockFactory(): Deno.ServeHandler {
	const supabase = supabaseClient();

	return async (req) => {
		const {} = await req.json();

		const res = {};

		return new Response(JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } });
	};
}
