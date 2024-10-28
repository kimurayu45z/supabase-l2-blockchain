import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import { getSignBytes, type Tx } from '../../../types/tx.ts';
import type { AuthSchema } from './schema.ts';

export async function inspectorSignature<Schema extends AuthSchema>(
	_: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
	tx: Tx
) {
	const chainId = Deno.env.get('CHAIN_ID');

	if (!chainId) {
		throw Error('chain_id is not configured');
	}

	for (const signerInfo of tx.auth_info.signer_infos) {
		const signBytes = getSignBytes(tx.body, chainId, signerInfo.sequence);

		const match = true;

		if (!match) {
			const address = signerInfo.public_key.value as string;
			throw Error(`Invalid signature of address ${address}`);
		}
	}
}
