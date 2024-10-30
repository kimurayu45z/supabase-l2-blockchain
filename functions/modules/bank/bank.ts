import type { AnyPossibleConstructor, Tx } from '@supabase-l2-blockchain/types/core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Chain } from '../../chain.ts';
import type { Module } from '../../types/module.ts';
import type { MsgConstructor } from '../../types/msg.ts';
import { MsgSend } from './msg-send.ts';
import type { BankSchema } from './schema.ts';

export class BankModule<Schema extends BankSchema> implements Module<Schema> {
	['constructor'] = BankModule<Schema>;

	static name(): string {
		return 'bank';
	}

	static types(): AnyPossibleConstructor[] {
		return [];
	}

	msgs(): MsgConstructor<Schema>[] {
		return [MsgSend];
	}

	async inspector(
		_chain: Chain<Schema>,
		_dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		_tx: Tx
	): Promise<void> {}
}
