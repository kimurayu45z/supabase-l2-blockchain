import type { SupabaseClient } from '@supabase/supabase-js';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Tx } from '../../../types/tx.ts';

export async function inspectorSignature(
	supabase: SupabaseClient,
	dbTx: PgTransaction<
		PgQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>,
	tx: Tx
) {}
