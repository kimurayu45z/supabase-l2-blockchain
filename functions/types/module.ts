import type { AnyPossibleConstructor, Tx } from '@supabase-l2-blockchain/types/core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import type { Chain } from '../chain.ts';

export interface Module<Schema extends Record<string, unknown>> {
	constructor: {
		// deno-lint-ignore no-explicit-any
		new (...args: any[]): Module<Schema>;
		name(): string;
		types(): AnyPossibleConstructor[];
	};

	inspector(
		chain: Chain<Schema>,
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		tx: Tx
	): Promise<void>;

	importGenesis(
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		state: unknown
	): Promise<void>;

	exportGenesis(db: PostgresJsDatabase<Schema>): Promise<unknown>;
}
