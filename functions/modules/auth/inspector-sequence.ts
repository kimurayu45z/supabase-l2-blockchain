import type { PublicKey, Tx } from '@supabase-l2-blockchain/types/core';
import { eq, type ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Chain } from '../../chain.ts';
import type { AddressConverter } from './address-converter.ts';
import { accounts, type AuthSchema } from './schema.ts';

export async function inspectorSequence<Schema extends AuthSchema>(
	chain: Chain<Schema>,
	dbTx: PgTransaction<PgQueryResultHKT, AuthSchema, ExtractTablesWithRelations<AuthSchema>>,
	tx: Tx,
	addressConverter: AddressConverter
) {
	for (const signerInfo of tx.authInfo?.signerInfos || []) {
		const pubKey = chain.moduleRegistry.extractAny<PublicKey>(signerInfo.publicKey!);
		const address = addressConverter(pubKey);

		const account = await dbTx.query.accounts.findFirst({
			where: (row, { eq }) => eq(row.address, address)
		});
		if (!account) {
			await dbTx.insert(accounts).values({
				address: address,
				sequence: '0'
			});
		}

		const sequence = BigInt(account?.sequence ?? 0);

		// Validation
		if (sequence !== signerInfo.sequence) {
			throw Error(`Invalid sequence of address ${address}: ${sequence} !== ${signerInfo.sequence}`);
		}

		// Increment sequence
		await dbTx
			.update(accounts)
			.set({ sequence: (sequence + BigInt(1)).toString() })
			.where(eq(accounts.address, address));
	}
}
