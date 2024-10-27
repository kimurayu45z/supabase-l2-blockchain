import type { PgTransaction } from 'drizzle-orm/pg-core/session';
import type { SupabaseClient } from 'jsr:@supabase/supabase-js';

import type { Asset } from '../../../types/asset.ts';
import type { Msg } from '../../types/msg.ts';

export class MsgSend implements Msg {
	constructor(public value: { from_address: string; to_address: string; assets: Asset[] }) {}

	static name(): string {
		return 'send';
	}

	async stateTransitionFunction(
		supabase: SupabaseClient,
		dbTx: PgTransaction<any>
	): Promise<MsgSendResponse> {
		return {};
	}
}

// deno-lint-ignore ban-types
export type MsgSendResponse = {};
