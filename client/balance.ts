import type { SupabaseClient } from '@supabase/supabase-js';

import type { Asset } from '../types/asset';
import { createBalanceMap, type Balance } from '../types/balance';

const TABLE_BALANCES = 'balances';

export async function getBalance(
	supabase: SupabaseClient,
	address: string,
	assetId: string
): Promise<Asset> {
	const res = await supabase
		.from(TABLE_BALANCES)
		.select('*')
		.eq('address', address)
		.eq('asset_id', assetId)
		.returns<Balance[]>();
	if (res.error) {
		throw res.error;
	}
	const amount = res.data.length > 0 ? res.data[0].amount : BigInt(0);

	return {
		id: assetId,
		amount: amount
	};
}

export async function getBalances(supabase: SupabaseClient, address: string): Promise<Asset[]> {
	const res = await supabase
		.from(TABLE_BALANCES)
		.select('*')
		.eq('address', address)
		.returns<Balance[]>();
	if (res.error) {
		throw res.error;
	}

	const map = createBalanceMap(res.data);

	return map[address].assets;
}
