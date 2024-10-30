import type { Asset } from '@supabase-l2-blockchain/types/core/index.d.ts';
import { and, eq, type ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import { balances, type BankSchema } from './schema.ts';

export async function burn(
	dbTx: PgTransaction<PgQueryResultHKT, BankSchema, ExtractTablesWithRelations<BankSchema>>,
	address: string,
	assets: Asset[]
): Promise<void> {
	for (const asset of assets) {
		const balance = await dbTx.query.balances
			.findFirst({
				where: (row, { eq, and }) => and(eq(row.address, address), eq(row.asset_id, asset.id))
			})
			.then((balance) => BigInt(balance?.amount || 0));

		const balanceAfter = balance - asset.amount;
		if (balanceAfter < 0) {
			throw Error(`Insufficient balance of address ${address}: ${balance} ${asset.id}`);
		}

		await dbTx
			.update(balances)
			.set({ amount: balanceAfter.toString() })
			.where(and(eq(balances.address, address), eq(balances.asset_id, asset.id)));
	}
}
