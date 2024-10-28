import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { AnyPossibleConstructor } from '../../types/any.ts';
import type { Tx } from '../../types/tx.ts';
import type { Chain } from '../chain.ts';
import type { MsgConstructor } from './msg.ts';

export interface Module<Schema extends Record<string, unknown>> {
	name(): string;
	msgs(): MsgConstructor<Schema>[];
	types(): AnyPossibleConstructor[];
	inspector(
		chain: Chain<Schema>,
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		tx: Tx
	): Promise<void>;
}
