import type { SendTxRequestBody, Tx } from '@supabase-l2-blockchain/types/core';
import { SupabaseClient } from '@supabase/supabase-js';

export async function sendTx(supabase: SupabaseClient, tx: Tx) {
	return await supabase.functions.invoke('send-tx', {
		body: {
			tx: tx
		} as SendTxRequestBody
	});
}
