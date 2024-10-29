import { SupabaseClient } from '@supabase/supabase-js';

export async function sendTx(supabase: SupabaseClient) {
	return await supabase.functions.invoke('sign-block', {
		body: {}
	});
}
