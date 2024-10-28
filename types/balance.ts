import type { Asset } from './asset.ts';

export type Balance = {
	address: string;
	asset_id: string;
	amount: bigint;
};

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
