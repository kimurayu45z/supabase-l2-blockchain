import type { Tx, TxBody, TxSignDoc } from '@supabase-l2-blockchain/types/core';
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

function canonicalizeObjectForSerialization(value: object): unknown {
	if (Object.prototype.toString.call(value) === '[object Object]') {
		const sorted = {} as Record<string, unknown>;
		const keys = Object.keys(value).sort();

		for (const key of keys) {
			const keyValue = (value as Record<string, unknown>)[key];
			if (keyValue != null) {
				sorted[key] = canonicalizeObjectForSerialization(keyValue);
			}
		}

		return sorted;
	}

	if (Array.isArray(value)) {
		return value.map((element) => canonicalizeObjectForSerialization(element));
	}

	return value === undefined ? null : value;
}

export function getSignBytes(txBody: TxBody, chainId: string, sequence: number): Buffer {
	const signDoc: TxSignDoc = {
		body: txBody,
		chain_id: chainId,
		sequence: sequence
	};
	const canonical = canonicalizeObjectForSerialization(signDoc);
	const json = JSON.stringify(canonical);

	return Buffer.from(json);
}
