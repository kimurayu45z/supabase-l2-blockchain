import { createAsset, type Asset } from '@supabase-l2-blockchain/types/core';
import type { SupabaseClient } from '@supabase/supabase-js/dist/module/index.js';

const TABLE_BALANCES = 'balances';

type DbBalance = {
	address: string;
	asset_id: string;
	amount: string;
};

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
		.single<DbBalance>();

	const amount = BigInt(!res.error ? res.data.amount : 0);

	return createAsset(assetId, amount);
}

export async function getBalances(supabase: SupabaseClient, address: string): Promise<Asset[]> {
	const res = await supabase
		.from(TABLE_BALANCES)
		.select('*')
		.eq('address', address)
		.returns<DbBalance[]>();
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

export function createBalanceMap(balances: DbBalance[]): BalanceMap {
	const balanceMap: BalanceMap = {};
	for (const balance of balances) {
		if (!balanceMap[balance.address]) {
			balanceMap[balance.address] = {
				assets: []
			};
		}
		balanceMap[balance.address].assets.push(createAsset(balance.asset_id, BigInt(balance.amount)));
	}
	return balanceMap;
}
