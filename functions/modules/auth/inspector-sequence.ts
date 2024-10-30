import type { Tx } from '@supabase-l2-blockchain/types/core/index.d.ts';
import { eq, type ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Chain } from '../../core/chain.ts';
import type { PublicKey } from '../../types/crypto/public-key.ts';
import type { AddressConverter } from './address-converter.ts';
import { accounts, type AuthSchema } from './schema.ts';

export async function inspectorSequence<Schema extends AuthSchema>(
	chain: Chain<Schema>,
	dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
	tx: Tx,
	addressConverter: AddressConverter
) {
	for (const signerInfo of tx.auth_info.signer_infos) {
		const pubKey = chain.moduleRegistry.extractAny<PublicKey>(signerInfo.public_key);
		const address = addressConverter(pubKey);

		const sequence = await dbTx
			.select()
			.from(accounts)
			.where(eq(accounts.address, address))
			.limit(1)
			.then(async (rows) => {
				// Insert when empty
				if (rows.length === 0) {
					await dbTx.insert(accounts).values({
						address: address,
						sequence: 0
					});
					return 0;
				}

				return rows[0].sequence;
			});

		// Validation
		if (sequence !== signerInfo.sequence) {
			throw Error(`Invalid sequence of address ${address}: ${sequence} !== ${signerInfo.sequence}`);
		}

		// Increment sequence
		await dbTx
			.update(accounts)
			.set({ sequence: sequence + 1 })
			.where(eq(accounts.address, address));
	}
}
