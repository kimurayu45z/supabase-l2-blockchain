import type { Tx } from '@supabase-l2-blockchain/types/core';
import type { SupabaseClient } from '@supabase/supabase-js/dist/module/index.js';

const TABLE_TXS = 'txs';

type PendingTx = Tx & {
	hash: string;
	height: OnErrorEventHandlerNonNull;
};

type ConfirmedTx = Tx & {
	hash: string;
	height: number;
};

export async function getTx(
	supabase: SupabaseClient,
	hash: string
): Promise<PendingTx | ConfirmedTx> {
	const res = await supabase
		.from(TABLE_TXS)
		.select('*')
		.eq('hash', hash)
		.single<PendingTx | ConfirmedTx>();
	if (res.error) {
		throw res.error;
	}

	return res.data;
}

export async function getTxs(supabase: SupabaseClient, height: bigint): Promise<ConfirmedTx[]> {
	const res = await supabase
		.from(TABLE_TXS)
		.select('*')
		.eq('height', height)
		.returns<ConfirmedTx[]>();
	if (res.error) {
		throw res.error;
	}
	return res.data;
}

export async function getPendingTxs(supabase: SupabaseClient): Promise<PendingTx[]> {
	const res = await supabase.from(TABLE_TXS).select('*').eq('height', null).returns<PendingTx[]>();
	if (res.error) {
		throw res.error;
	}

	return res.data;
}
