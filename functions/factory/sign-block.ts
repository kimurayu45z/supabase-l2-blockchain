import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

export function signBlockFactory(): Deno.ServeHandler {
	return async (req) => {
		const {} = await req.json();

		const res = {};

		return new Response(JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } });
	};
}
