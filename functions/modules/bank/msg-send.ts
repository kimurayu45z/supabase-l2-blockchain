import type { SupabaseClient } from 'jsr:@supabase/supabase-js';

import type { Asset } from '../../../types/asset.ts';
import type { Msg } from '../../types/msg.ts';

const TYPE = 'bank_send';

export class MsgSend implements Msg {
	constructor(public value: { from_address: string; to_address: string; assets: Asset[] }) {}

	static type(): string {
		return TYPE;
	}

	async stateTransitionFunction(supabase: SupabaseClient): Promise<MsgSendResponse> {
		await supabase.rpc(TYPE, {
			from_address: this.value.from_address,
			to_address: this.value.to_address,
			assets: this.value.assets
		});

		return {};
	}
}

// deno-lint-ignore ban-types
export type MsgSendResponse = {};
