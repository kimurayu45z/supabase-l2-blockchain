import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Tx } from '../../../types/tx.ts';
import type { Chain } from '../../chain.ts';
import type { Module } from '../../types/module.ts';
import { MsgSend } from './msg-send.ts';
import type { BankSchema } from './schema.ts';

export class BankModule<Schema extends BankSchema> implements Module<Schema> {
	name() {
		return 'bank';
	}
	msgs() {
		return [MsgSend];
	}
	types() {
		return [];
	}

	async inspector(
		_chain: Chain<Schema>,
		_dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		_tx: Tx
	) {}
}
