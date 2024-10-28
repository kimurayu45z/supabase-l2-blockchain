import { eq, type ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Tx } from '../../../types/tx.ts';
import { accounts, type AuthSchema } from './schema.ts';

export async function inspectorSequence<Schema extends AuthSchema>(
	dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
	tx: Tx
) {
	const usedAddress: { [address: string]: true } = {};
	for (const signerInfo of tx.auth_info.signer_infos) {
		const address = signerInfo.public_key.value as string;

		if (usedAddress[address]) {
			throw Error(`Duplicated address: ${address}`);
		}
		usedAddress[address] = true;

		dbTx.query;

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
