import type { SupabaseClient } from '@supabase/supabase-js';

import type { Tx } from '../../types/tx.ts';

export type Inspector = (supabase: SupabaseClient, tx: Tx) => Promise<void>;
