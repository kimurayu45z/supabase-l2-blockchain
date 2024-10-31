import type { Tx, TxBody, TxResponse, TxSignDoc } from '@supabase-l2-blockchain/types/core';
import type { SupabaseClient } from '@supabase/supabase-js/dist/module/index.js';

const TABLE_TXS = 'txs';

type PendingTx = {
	hash: string;
	tx: Tx;
	height: null;
	response: null;
};

type ConfirmedTx = {
	hash: string;
	tx: Tx;
	height: number;
	response: TxResponse;
};

type SchemaTx = {
	hash: string;
} & Tx & {
		height: number | null;
	} & Partial<TxResponse>;

function createPendingTx(schemaTx: SchemaTx): PendingTx {
	return {
		hash: schemaTx.hash,
		tx: {
			body: schemaTx.body,
			auth_info: schemaTx.auth_info,
			signatures: schemaTx.signatures
		},
		height: null,
		response: null
	};
}

function createConfirmedTx(schemaTx: SchemaTx): ConfirmedTx {
	return {
		hash: schemaTx.hash,
		tx: {
			body: schemaTx.body,
			auth_info: schemaTx.auth_info,
			signatures: schemaTx.signatures
		},
		height: schemaTx.height!,
		response: {
			success: schemaTx.success!,
			inspection_error: schemaTx.inspection_error,
			msg_responses: schemaTx.msg_responses || []
		}
	};
}

export async function getTx(
	supabase: SupabaseClient,
	hash: string
): Promise<PendingTx | ConfirmedTx> {
	const res = await supabase.from(TABLE_TXS).select('*').eq('hash', hash).single<SchemaTx>();
	if (res.error) {
		throw res.error;
	}

	const data: PendingTx | ConfirmedTx =
		res.data.height && res.data.success ? createConfirmedTx(res.data) : createPendingTx(res.data);

	return data;
}

export async function getConfirmedTxs(
	supabase: SupabaseClient,
	height: bigint
): Promise<ConfirmedTx[]> {
	const res = await supabase
		.from(TABLE_TXS)
		.select('*')
		.eq('height', height)
		.eq('success', true)
		.returns<SchemaTx[]>();
	if (res.error) {
		throw res.error;
	}

	const data: ConfirmedTx[] = res.data.map((datum) => createConfirmedTx(datum));

	return data;
}

export async function getPendingTxs(supabase: SupabaseClient): Promise<PendingTx[]> {
	const res = await supabase.from(TABLE_TXS).select('*').eq('height', null).returns<SchemaTx[]>();
	if (res.error) {
		throw res.error;
	}

	const data: PendingTx[] = res.data.map((datum) => createPendingTx(datum));

	return data;
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

export function getTxSignBytes(txBody: TxBody, chainId: string, sequence: number): Buffer {
	const signDoc: TxSignDoc = {
		body: txBody,
		chain_id: chainId,
		sequence: sequence
	};
	const canonical = canonicalizeObjectForSerialization(signDoc);
	const json = JSON.stringify(canonical);

	return Buffer.from(json);
}
