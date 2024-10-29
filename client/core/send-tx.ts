import { SupabaseClient } from '@supabase/supabase-js';

import { Tx } from '../../types/tx';

export async function sendTx(supabase: SupabaseClient, tx: Tx) {
	return await supabase.functions.invoke('send-tx', {
		body: {
			tx: tx
		}
	});
}
