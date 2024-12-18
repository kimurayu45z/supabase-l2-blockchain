import type { AnyPossible, AnyPossibleConstructor } from '@supabase-l2-blockchain/types/core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

export interface Msg<Schema extends Record<string, unknown> = Record<string, unknown>>
	extends AnyPossible {
	signers(): string[];

	stateTransitionFunction(
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>
	): Promise<unknown>;
}

export type MsgConstructor = AnyPossibleConstructor<Msg>;
