import { and, eq, type ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Asset } from '../../../../types/asset.ts';
import { balances, type BankSchema } from './schema.ts';

export async function send(
	fromAddress: string,
	toAddress: string,
	assets: Asset[],
	dbTx: PgTransaction<PgQueryResultHKT, BankSchema, ExtractTablesWithRelations<BankSchema>>
): Promise<void> {
	for (const asset of assets) {
		const fromBalance = await dbTx.query.balances
			.findFirst({
				where: (row, { eq, and }) => and(eq(row.address, fromAddress), eq(row.asset_id, asset.id))
			})
			.then((balance) => BigInt(balance?.amount || 0));

		const fromBalanceAfter = fromBalance - asset.amount;
		if (fromBalanceAfter < 0) {
			throw Error(`Insufficient balance of address ${fromAddress}: ${fromBalance} ${asset.id}`);
		}

		await dbTx
			.update(balances)
			.set({ amount: fromBalanceAfter.toString() })
			.where(and(eq(balances.address, fromAddress), eq(balances.asset_id, asset.id)));

		const toBalance = await dbTx.query.balances
			.findFirst({
				where: (row, { eq, and }) => and(eq(row.address, toAddress), eq(row.asset_id, asset.id))
			})
			.then((balance) => BigInt(balance?.amount || 0));

		const toBalanceAfter = toBalance + asset.amount;

		await dbTx
			.insert(balances)
			.values({
				address: toAddress,
				asset_id: asset.id,
				amount: toBalanceAfter.toString()
			})
			.onConflictDoUpdate({
				target: [balances.address, balances.asset_id],
				set: {
					amount: toBalanceAfter.toString()
				}
			});
	}
}
