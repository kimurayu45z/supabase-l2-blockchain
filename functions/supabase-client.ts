import { createClient } from 'jsr:@supabase/supabase-js';

export function supabaseClient() {
	return createClient(
		// Supabase API URL - env var exported by default.
		Deno.env.get('SUPABASE_URL') ?? '',
		// Supabase API ANON KEY - env var exported by default.
		Deno.env.get('SUPABASE_ANON_KEY') ?? ''
	);
}
