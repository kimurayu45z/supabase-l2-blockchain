import type { SupabaseClient } from "jsr:@supabase/supabase-js";

export interface Msg {
  type(): string;
  stateTransitionFunction(supabase: SupabaseClient): Promise<void>;
}
