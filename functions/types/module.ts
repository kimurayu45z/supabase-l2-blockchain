import type { AnyPossibleConstructor, Tx } from '@supabase-l2-blockchain/types/core/index.d.ts';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Chain } from '../core/chain.ts';
import type { MsgConstructor } from './msg.ts';

export interface Module<Schema extends Record<string, unknown>> {
	constructor: {
		// deno-lint-ignore no-explicit-any
		new (...args: any[]): Module<Schema>;
		name(): string;
		types(): AnyPossibleConstructor[];
	};

	msgs(): MsgConstructor<Schema>[];

	inspector(
		chain: Chain<Schema>,
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		tx: Tx
	): Promise<void>;
}
