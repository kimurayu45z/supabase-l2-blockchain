import type { SupabaseClient } from '@supabase/supabase-js';
import type { PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Tx } from '../../../types/tx.ts';

export async function inspectorSequence(
	supabase: SupabaseClient,
	dbTx: PgTransaction<any>,
	tx: Tx
) {}
