import { create, fromJson, toJson, type JsonValue, type Registry } from '@bufbuild/protobuf';
import type { AnyPossibleConstructor, PublicKey, Tx } from '@supabase-l2-blockchain/types/core';
import { GenesisStateSchema } from '@supabase-l2-blockchain/types/modules/auth';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import type { Chain } from '../../chain.ts';
import type { Module } from '../../types/module.ts';
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

	async inspector(
		chain: Chain<Schema>,
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		tx: Tx
	): Promise<void> {
		await inspectorAuthInfo(chain, dbTx, tx, this.addressConverter);
		await inspectorSequence(chain, dbTx as any, tx, this.addressConverter);
		await inspectorSignature(chain, dbTx, tx, this.addressConverter, this.supportedPublicKeyTypes);
	}

	async importGenesis(
		dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		state: JsonValue,
		protobufRegistry: Registry
	): Promise<void> {
		const genesis = fromJson(GenesisStateSchema, state, { registry: protobufRegistry });

		for (const account of genesis.accounts) {
			await dbTx.insert(authSchema.accounts).values({
				address: account.address,
				sequence: Number(account.sequence)
			});
		}
	}

	async exportGenesis(
		db: PostgresJsDatabase<Schema>,
		protobufRegistry: Registry
	): Promise<JsonValue> {
		const accounts = await (
			db as unknown as PostgresJsDatabase<AuthSchema>
		).query.accounts.findMany();

		return toJson(
			GenesisStateSchema,
			create(GenesisStateSchema, {
				accounts: accounts.map((account) => ({
					address: account.address,
					sequence: BigInt(account.sequence)
				}))
			}),
			{ registry: protobufRegistry }
		);
	}
}
