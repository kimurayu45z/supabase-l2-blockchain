import type { Tx } from '@supabase-l2-blockchain/types/core';
import { eq, type ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Chain } from '../../chain.ts';
import type { PublicKey } from '../../types/crypto/public-key.ts';
import type { AddressConverter } from './address-converter.ts';
import { accounts, type AuthSchema } from './schema.ts';

export async function inspectorSequence<Schema extends AuthSchema>(
	chain: Chain<Schema>,
	dbTx: PgTransaction<PgQueryResultHKT, AuthSchema, ExtractTablesWithRelations<AuthSchema>>,
	tx: Tx,
	addressConverter: AddressConverter
) {
	for (const signerInfo of tx.auth_info.signer_infos) {
		const pubKey = chain.moduleRegistry.extractAny<PublicKey>(signerInfo.public_key);
		const address = addressConverter(pubKey);

		const account = await dbTx.query.accounts.findFirst({
			where: (row, { eq }) => eq(row.address, address)
		});
		if (!account) {
			await dbTx.insert(accounts).values({
				address: address,
				sequence: 0
			});
		}

		const sequence = account?.sequence ?? 0;

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
