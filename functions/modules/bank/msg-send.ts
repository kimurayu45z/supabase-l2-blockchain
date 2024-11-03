import type { Message } from '@bufbuild/protobuf';
import { create, fromBinary, toBinary } from '@bufbuild/protobuf';
import type { Any } from '@bufbuild/protobuf/wkt';
import { AnySchema } from '@bufbuild/protobuf/wkt';
import {
	MsgSendSchema,
	type MsgSend as ProtoMsgSend
} from '@supabase-l2-blockchain/types/modules/bank';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Msg, MsgConstructor } from '../../types/msg.ts';
import type { BankSchema } from './schema.ts';
import { send } from './send.ts';

class MsgSend<Schema extends BankSchema> implements Msg<Schema> {
	constructor(public value: Omit<ProtoMsgSend, keyof Message>) {}

	signers(): string[] {
		return [this.value.fromAddress];
	}

	async stateTransitionFunction(
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>
	): Promise<unknown> {
		await send(dbTx as any, this.value.fromAddress, this.value.toAddress, this.value.assets);

		return {};
	}

	toAny(): Any {
		const value = create(MsgSendSchema, this.value);
		return create(AnySchema, {
			typeUrl: value.$typeName,
			value: toBinary(MsgSendSchema, value)
		});
	}

	static desc() {
		return MsgSendSchema;
	}

	static fromAny(value: Any): Msg {
		return new MsgSend<BankSchema>(fromBinary(MsgSendSchema, value.value));
	}
}

const msgSend: MsgConstructor = MsgSend;
export { msgSend as MsgSend };
