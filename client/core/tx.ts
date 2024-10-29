import type { SupabaseClient } from '@supabase/supabase-js';

import type { Tx } from '../../types/tx';

const TABLE_TXS = 'txs';
const TABLE_TX_INCLUSIONS = 'tx-inclusions';

export async function getTx(supabase: SupabaseClient, hash: string): Promise<Tx> {
	const res = await supabase.from(TABLE_TXS).select('*').eq('hash', hash).single<Tx>();
	if (res.error) {
		throw res.error;
	}

	return res.data;
}

export async function getTxs(
	supabase: SupabaseClient,
	chainId: string,
	height: bigint
): Promise<Tx[]> {
	const res = await supabase
		.from(TABLE_TX_INCLUSIONS)
		.select('*')
		.eq('chain_id', chainId)
		.eq('height', height)
		.returns<Tx[]>();
	if (res.error) {
		throw res.error;
	}
	return res.data;
}

export async function getPendingTxs(supabase: SupabaseClient): Promise<Tx[]> {
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
