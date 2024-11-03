import { create, toJson, type JsonValue, type Registry } from '@bufbuild/protobuf';
import type { AnyPossibleConstructor, Tx } from '@supabase-l2-blockchain/types/core';
import {
	GenesisStateSchema,
	PrivateKeyEd25519,
	PrivateKeySecp256k1,
	PublicKeyEd25519,
	PublicKeySecp256k1
} from '@supabase-l2-blockchain/types/modules/crypto';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import type { Chain } from '../../chain.ts';
import type { Module } from '../../types/module.ts';

export class CryptoModule<Schema extends Record<string, unknown>> implements Module<Schema> {
	['constructor']: typeof CryptoModule<Schema> = CryptoModule<Schema>;

	static name(): string {
		return 'crypto';
	}

	static types(): AnyPossibleConstructor[] {
		return [PrivateKeyEd25519, PrivateKeySecp256k1, PublicKeyEd25519, PublicKeySecp256k1];
	}

	async inspector(
		_chain: Chain<Schema>,
		_dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		_tx: Tx
	): Promise<void> {}

	async importGenesis(
		_dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		_state: JsonValue,
		_protobufRegistry: Registry
	): Promise<void> {}

	// deno-lint-ignore require-await
	async exportGenesis(
		_db: PostgresJsDatabase<Schema>,
		_protobufRegistry: Registry
	): Promise<JsonValue> {
		return toJson(GenesisStateSchema, create(GenesisStateSchema, {}));
	}
}
