import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Asset } from '../../../types/asset.ts';
import { balances, type BankSchema } from './schema.ts';

export async function mint(
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

		const balanceAfter = balance + asset.amount;

		await dbTx
			.insert(balances)
			.values({
				address: address,
				asset_id: asset.id,
				amount: balanceAfter.toString()
			})
			.onConflictDoUpdate({
				target: [balances.address, balances.asset_id],
				set: {
					amount: balanceAfter.toString()
				}
			});
	}
}
