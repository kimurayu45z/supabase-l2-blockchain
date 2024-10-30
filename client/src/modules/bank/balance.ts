import type { Asset } from '@supabase-l2-blockchain/types/core';
import type { Balance } from '@supabase-l2-blockchain/types/modules/bank';
import type { SupabaseClient } from '@supabase/supabase-js/dist/module/index.js';

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
		.single<Balance>();

	const amount = !res.error ? res.data.amount : BigInt(0);

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

export type BalanceMap = {
	[address: string]: {
		assets: Asset[];
	};
};

export function createBalanceMap(balances: Balance[]): BalanceMap {
	const balanceMap: BalanceMap = {};
	for (const balance of balances) {
		if (!balanceMap[balance.address]) {
			balanceMap[balance.address] = {
				assets: []
			};
		}
		balanceMap[balance.address].assets.push({
			id: balance.asset_id,
			amount: balance.amount
		});
	}
	return balanceMap;
}
