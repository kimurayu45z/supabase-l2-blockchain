import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';
import type { SupabaseClient } from 'jsr:@supabase/supabase-js';

// deno-lint-ignore no-empty-interface
export interface MsgResponse {}

export interface Msg {
	stateTransitionFunction(
		supabase: SupabaseClient,
		dbTx: PgTransaction<
			PgQueryResultHKT,
			Record<string, never>,
			ExtractTablesWithRelations<Record<string, never>>
		>
	): Promise<MsgResponse>;
}

export type MsgConstructor = {
	name(): string;
	// deno-lint-ignore no-explicit-any
	new (value: any): Msg;
};
