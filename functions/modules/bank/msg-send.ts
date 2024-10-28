import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Asset } from '../../../types/asset.ts';
import type { Msg } from '../../types/msg.ts';
import type { BankSchema } from './schema.ts';
import { send } from './send.ts';

export class MsgSend<Schema extends BankSchema> implements Msg<Schema> {
	['constructor'] = MsgSend<Schema>;

	constructor(public value: { from_address: string; to_address: string; assets: Asset[] }) {}

	static type(): string {
		return 'MsgSend';
	}

	signers(): string[] {
		return [this.value.from_address];
	}

	async stateTransitionFunction(
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>
	): Promise<MsgSendResponse> {
		await send(this.value.from_address, this.value.to_address, this.value.assets, dbTx as any);

		return {};
	}
}

// deno-lint-ignore ban-types
export type MsgSendResponse = {};
