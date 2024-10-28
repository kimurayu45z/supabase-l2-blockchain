import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { AnyPossibleConstructor } from '../../../types/any.ts';
import type { Tx } from '../../../types/tx.ts';
import type { Chain } from '../../chain.ts';
import type { PublicKey } from '../../types/crypto/public-key.ts';
import type { Module } from '../../types/module.ts';
import type { MsgConstructor } from '../../types/msg.ts';
import type { AddressConverter } from './address-converter.ts';
import { inspectorAuthInfo } from './inspector-auth-info.ts';
import { inspectorSequence } from './inspector-sequence.ts';
import { inspectorSignature } from './inspector-signature.ts';
import type { AuthSchema } from './schema.ts';

export class AuthModule<Schema extends AuthSchema> implements Module<Schema> {
	constructor(
		public addressConverter: AddressConverter,
		public supportedPublicKeyTypes: AnyPossibleConstructor<PublicKey>[]
	) {}

	name(): string {
		return 'auth';
	}

	msgs(): MsgConstructor<Schema>[] {
		return [];
	}

	types(): AnyPossibleConstructor[] {
		return [];
	}

	async inspector(
		chain: Chain<Schema>,
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		tx: Tx
	): Promise<void> {
		await inspectorAuthInfo(chain, dbTx, tx);
		await inspectorSequence(chain, dbTx, tx, this.addressConverter);
		await inspectorSignature(chain, dbTx, tx, this.addressConverter, this.supportedPublicKeyTypes);
	}
}
