import type { AnyPossibleConstructor } from '@supabase-l2-blockchain/types/core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

export type MsgResponse = {
	success?: unknown;
	error?: string;
};

export interface Msg<Schema extends Record<string, unknown>> {
	constructor: MsgConstructor<Schema>;
	value: unknown;

	signers(): string[];

	stateTransitionFunction(
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>
	): Promise<unknown>;
}

export type MsgConstructor<Schema extends Record<string, unknown>> = AnyPossibleConstructor<
	Msg<Schema>
>;
