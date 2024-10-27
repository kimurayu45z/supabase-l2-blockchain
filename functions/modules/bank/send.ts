import type { SupabaseClient } from 'jsr:@supabase/supabase-js';

import type { Asset } from '../../../types/asset.ts';
import type { Msg } from '../../../types/msg.ts';

export class MsgSend implements Msg {
	constructor(
		public from_address: string,
		public to_address: string,
		public assets: Asset[]
	) {}

	type(): string {
		return 'bank/send';
	}

	async stateTransitionFunction(supabase: SupabaseClient): Promise<void> {
		await supabase.rpc('bank_send', {
			from_address: this.from_address,
			to_address: this.to_address,
			assets: this.assets
		});
	}
}
