import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { AnyPossibleConstructor } from '../../types/any.ts';

// deno-lint-ignore no-empty-interface
export interface MsgResponse {}

export interface Msg<Schema extends Record<string, unknown>> {
	constructor: MsgConstructor<Schema>;
	value: unknown;

	signers(): string[];

	stateTransitionFunction(
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>
	): Promise<MsgResponse>;
}

export type MsgConstructor<Schema extends Record<string, unknown>> = AnyPossibleConstructor<
	Msg<Schema>
>;
