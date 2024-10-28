import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { AnyPossibleConstructor } from '../../../types/any.ts';
import type { Tx } from '../../../types/tx.ts';
import type { Chain } from '../../chain.ts';
import type { Module } from '../../types/module.ts';
import type { MsgConstructor } from '../../types/msg.ts';
import { MsgSend } from './msg-send.ts';
import type { BankSchema } from './schema.ts';

export class BankModule<Schema extends BankSchema> implements Module<Schema> {
	name(): string {
		return 'bank';
	}

	msgs(): MsgConstructor<Schema>[] {
		return [MsgSend];
	}

	types(): AnyPossibleConstructor[] {
		return [];
	}

	async inspector(
		_chain: Chain<Schema>,
		_dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		_tx: Tx
	): Promise<void> {}
}
