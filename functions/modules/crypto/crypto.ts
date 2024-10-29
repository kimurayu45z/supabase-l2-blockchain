import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Tx } from '../../../types/tx.ts';
import type { Chain } from '../../chain.ts';
import { PublicKeyEd25519 } from '../../types/crypto/ed25519.ts';
import { PublicKeySecp256k1 } from '../../types/crypto/secp256k1.ts';
import type { Module } from '../../types/module.ts';

export class CryptoModule<Schema extends Record<string, unknown>> implements Module<Schema> {
	['constructor'] = CryptoModule<Schema>;

	static name() {
		return 'crypto';
	}

	static types() {
		return [PublicKeyEd25519, PublicKeySecp256k1];
	}

	msgs() {
		return [];
	}

	async inspector(
		_chain: Chain<Schema>,
		_dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
		_tx: Tx
	): Promise<void> {}
}
