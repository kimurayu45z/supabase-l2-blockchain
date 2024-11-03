import { toBinary } from '@bufbuild/protobuf';
import {
	SendTxRequest,
	SendTxResponse,
	TxSchema,
	type Tx
} from '@supabase-l2-blockchain/types/core';
import { SupabaseClient } from '@supabase/supabase-js';

export async function sendTx(supabase: SupabaseClient, tx: Tx) {
	return await supabase.functions.invoke<SendTxResponse>('send-tx', {
		body: {
			txBinary: Buffer.from(toBinary(TxSchema, tx)).toString('base64')
		} as SendTxRequest
	});
}
