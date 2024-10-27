import type { SupabaseClient } from 'jsr:@supabase/supabase-js';

import type { Asset } from '../../../types/asset.ts';
import type { Msg } from '../../types/msg.ts';

export class MsgSend implements Msg {
	constructor(public value: { from_address: string; to_address: string; assets: Asset[] }) {}

	static type(): string {
		return 'bank/send';
	}

	async stateTransitionFunction(supabase: SupabaseClient): Promise<MsgSendResponse> {
		await supabase.rpc('bank_send', {
			from_address: this.value.from_address,
			to_address: this.value.to_address,
			assets: this.value.assets
		});

		return {};
	}
}

export type MsgSendResponse = {};
