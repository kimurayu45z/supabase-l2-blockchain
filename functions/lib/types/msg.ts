import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

// deno-lint-ignore no-empty-interface
export interface MsgResponse {}

export interface Msg<Schema extends Record<string, unknown>> {
	signers(): string[];

	stateTransitionFunction(
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>
	): Promise<MsgResponse>;
}

export type MsgConstructor<Schema extends Record<string, unknown>> = {
	name(): string;
	// deno-lint-ignore no-explicit-any
	new (value: any): Msg<Schema>;
};
