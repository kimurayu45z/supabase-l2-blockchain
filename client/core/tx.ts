import type { SupabaseClient } from '@supabase/supabase-js';

import type { Tx } from '../../types/tx';

const TABLE_TXS = 'txs';

type TxInclusion = {
	hash: string;
	height: number;
};

export async function getTx(supabase: SupabaseClient, hash: string): Promise<Tx & TxInclusion> {
	const res = await supabase
		.from(TABLE_TXS)
		.select('*')
		.eq('hash', hash)
		.single<Tx & TxInclusion>();
	if (res.error) {
		throw res.error;
	}

	return res.data;
}

export async function getTxs(
	supabase: SupabaseClient,
	height: bigint
): Promise<(Tx & TxInclusion)[]> {
	const res = await supabase
		.from(TABLE_TXS)
		.select('*')
		.eq('height', height)
		.returns<(Tx & TxInclusion)[]>();
	if (res.error) {
		throw res.error;
	}
	return res.data;
}

export async function getPendingTxs(supabase: SupabaseClient): Promise<(Tx & { hash: string })[]> {
	const res = await supabase
		.from(TABLE_TXS)
		.select('*')
		.eq('height', null)
		.returns<(Tx & TxInclusion)[]>();
	if (res.error) {
		throw res.error;
	}

	return res.data;
}
