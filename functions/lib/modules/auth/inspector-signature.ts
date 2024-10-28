import { Buffer } from 'node:buffer';

import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';
import { zip } from 'https://deno.land/std@0.102.0/collections/zip.ts';

import { getSignBytes, type Tx } from '../../../../types/tx.ts';
import type { Chain } from '../../chain.ts';
import type { PublicKey } from '../../types/crypto/public-key.ts';
import { ModuleRegistry } from '../module-registry.ts';
import type { AuthSchema } from './schema.ts';

// deno-lint-ignore require-await
export async function inspectorSignature<Schema extends AuthSchema>(
	chain: Chain<Schema>,
	_dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
	tx: Tx
) {
	for (const [signerInfo, signature] of zip(tx.auth_info.signer_infos, tx.signatures)) {
		const registry: ModuleRegistry<Schema> = new ModuleRegistry();

		const pubKey = registry.extractAny<PublicKey>(signerInfo.public_key);

		const signBytes = getSignBytes(tx.body, chain.id, signerInfo.sequence);

		const match = pubKey.verify(signBytes, Buffer.from(signature, 'hex'));

		if (!match) {
			const address = signerInfo.public_key.value as string;
			throw Error(`Invalid signature of address ${address}`);
		}
	}
}
