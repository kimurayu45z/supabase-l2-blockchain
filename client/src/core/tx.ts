import { fromJson, JsonValue, Registry } from '@bufbuild/protobuf';
import {
	AuthInfoSchema,
	createTx,
	TxBodySchema,
	type Tx,
	type TxResponse
} from '@supabase-l2-blockchain/types/core';
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
	body: JsonValue;
	auth_info: JsonValue;
	signatures: string[];

	height: number | null;
} & Partial<TxResponse>;

function createTxFromJson(
	body: JsonValue,
	authInfo: JsonValue,
	signatures: string[],
	protobufRegistry: Registry
): Tx {
	return createTx(
		fromJson(TxBodySchema, body, { registry: protobufRegistry }),
		fromJson(AuthInfoSchema, authInfo, { registry: protobufRegistry }),
		signatures.map((signature) => Buffer.from(signature, 'hex'))
	);
}

function createPendingTx(schemaTx: SchemaTx, protobufRegistry: Registry): PendingTx {
	return {
		hash: schemaTx.hash,
		tx: createTxFromJson(schemaTx.body, schemaTx.auth_info, schemaTx.signatures, protobufRegistry),
		height: null,
		response: null
	};
}

function createConfirmedTx(schemaTx: SchemaTx, protobufRegistry: Registry): ConfirmedTx {
	return {
		hash: schemaTx.hash,
		tx: createTxFromJson(schemaTx.body, schemaTx.auth_info, schemaTx.signatures, protobufRegistry),
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
	hash: string,
	protobufRegistry: Registry
): Promise<PendingTx | ConfirmedTx> {
	const res = await supabase.from(TABLE_TXS).select('*').eq('hash', hash).single<SchemaTx>();
	if (res.error) {
		throw res.error;
	}

	const data: PendingTx | ConfirmedTx =
		res.data.height && res.data.success
			? createConfirmedTx(res.data, protobufRegistry)
			: createPendingTx(res.data, protobufRegistry);

	return data;
}

export async function getConfirmedTxs(
	supabase: SupabaseClient,
	height: bigint,
	protobufRegistry: Registry
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

	const data: ConfirmedTx[] = res.data.map((datum) => createConfirmedTx(datum, protobufRegistry));

	return data;
}

export async function getPendingTxs(
	supabase: SupabaseClient,
	protobufRegistry: Registry
): Promise<PendingTx[]> {
	const res = await supabase.from(TABLE_TXS).select('*').eq('height', null).returns<SchemaTx[]>();
	if (res.error) {
		throw res.error;
	}

	const data: PendingTx[] = res.data.map((datum) => createPendingTx(datum, protobufRegistry));

	return data;
}
