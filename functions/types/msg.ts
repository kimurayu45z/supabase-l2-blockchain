import type { SupabaseClient } from 'jsr:@supabase/supabase-js';

// deno-lint-ignore no-empty-interface
export interface MsgResponse {}

export interface Msg {
	stateTransitionFunction(supabase: SupabaseClient): Promise<MsgResponse>;
}

export type MsgConstructor = {
	type(): string;
	// deno-lint-ignore no-explicit-any
	new (value: any): Msg;
};
