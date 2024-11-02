import type { AnyPossibleConstructor, Tx } from '@supabase-l2-blockchain/types/core';
import type { Balance } from '@supabase-l2-blockchain/types/modules/bank';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import type { Chain } from '../../chain.ts';
import type { Module } from '../../types/module.ts';
import { MsgSend } from './msg-send.ts';
import type { BankSchema } from './schema.ts';
import { bankSchema } from './schema.ts';

export class BankModule<Schema extends BankSchema> implements Module<Schema> {
	['constructor']: typeof BankModule<Schema> = BankModule<Schema>;

	static name(): string {
		return 'bank';
	}

	static types(): AnyPossibleConstructor[] {
		return [MsgSend];
	}

	async inspector(
		_chain: Chain<Schema>,
		_dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		_tx: Tx
	): Promise<void> {}

	async importGenesis(
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		state: BankState
	): Promise<void> {
		for (const balance of state.balances) {
			await dbTx.insert(bankSchema.balances).values({
				address: balance.address,
				asset_id: balance.asset_id,
				amount: balance.amount.toString()
			});
		}
	}

	async exportGenesis(db: PostgresJsDatabase<Schema>): Promise<BankState> {
		const balances = await (
			db as unknown as PostgresJsDatabase<BankSchema>
		).query.balances.findMany();

		return {
			balances: balances.map((balance) => ({ ...balance, amount: BigInt(balance.amount) }))
		};
	}
}

export type BankState = {
	balances: Balance[];
};
