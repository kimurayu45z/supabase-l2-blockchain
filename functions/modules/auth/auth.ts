import type { AnyPossibleConstructor, Tx } from '@supabase-l2-blockchain/types/core';
import type { Account } from '@supabase-l2-blockchain/types/modules/auth';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import type { Chain } from '../../chain.ts';
import type { PublicKey } from '../../types/crypto/public-key.ts';
import type { Module } from '../../types/module.ts';
import type { MsgConstructor } from '../../types/msg.ts';
import type { AddressConverter } from './address-converter.ts';
import { inspectorAuthInfo } from './inspector-auth-info.ts';
import { inspectorSequence } from './inspector-sequence.ts';
import { inspectorSignature } from './inspector-signature.ts';
import { authSchema, type AuthSchema } from './schema.ts';

export class AuthModule<Schema extends AuthSchema> implements Module<Schema> {
	['constructor']: typeof AuthModule<Schema> = AuthModule<Schema>;

	constructor(
		public addressConverter: AddressConverter,
		public supportedPublicKeyTypes: AnyPossibleConstructor<PublicKey>[]
	) {}

	static name(): string {
		return 'auth';
	}

	static types(): AnyPossibleConstructor[] {
		return [];
	}

	msgs(): MsgConstructor<Schema>[] {
		return [];
	}

	async inspector(
		chain: Chain<Schema>,
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		tx: Tx
	): Promise<void> {
		await inspectorAuthInfo(chain, dbTx, tx);
		await inspectorSequence(chain, dbTx as any, tx, this.addressConverter);
		await inspectorSignature(chain, dbTx, tx, this.addressConverter, this.supportedPublicKeyTypes);
	}

	async importGenesis(
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		state: AuthState
	): Promise<void> {
		for (const account of state.accounts) {
			await dbTx.insert(authSchema.accounts).values({
				address: account.address,
				sequence: account.sequence
			});
		}
	}

	async exportGenesis(db: PostgresJsDatabase<Schema>): Promise<AuthState> {
		const accounts = await (
			db as unknown as PostgresJsDatabase<AuthSchema>
		).query.accounts.findMany();

		return {
			accounts: accounts
		};
	}
}

export type AuthState = {
	accounts: Account[];
};
