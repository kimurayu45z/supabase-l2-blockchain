import type { SupabaseClient } from '@supabase/supabase-js';

import type { Tx } from '../types/tx';

const TABLE_TXS = 'txs';
const TABLE_TX_INCLUSIONS = 'tx-inclusions';

export async function getTx(supabase: SupabaseClient, hash: string): Promise<Tx> {
	const res = await supabase.from(TABLE_TXS).select('*').eq('hash', hash).returns<Tx[]>();
	if (res.error) {
		throw res.error;
	}

	return res.data[0];
}

export async function getTxs(
	supabase: SupabaseClient,
	includedIn: { chainId: string; height: bigint } | null
): Promise<Tx[]> {
	if (!includedIn) {
		const res = await supabase
			.from(TABLE_TX_INCLUSIONS)
			.select('*')
			.eq('chain_id', null)
			.eq('height', null)
			.returns<Tx[]>();
		if (res.error) {
			throw res.error;
		}
		return res.data;
	}

	const res = await supabase
		.from(TABLE_TX_INCLUSIONS)
		.select('*')
		.eq('chain_id', includedIn.chainId)
		.eq('height', includedIn.height)
		.returns<Tx[]>();
	if (res.error) {
		throw res.error;
	}
	return res.data;
}
