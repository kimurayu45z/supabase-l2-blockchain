import type { SupabaseClient } from '@supabase/supabase-js';

export interface Msg {
	type(): string;
	stateTransitionFunction(supabase: SupabaseClient): Promise<void>;
}

export type MsgUnion = {
	type: string;
	value: Msg;
};
