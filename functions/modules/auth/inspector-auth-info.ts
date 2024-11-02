import type { PublicKey, Tx } from '@supabase-l2-blockchain/types/core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Chain } from '../../chain.ts';
import type { Msg } from '../../types/msg.ts';
import type { AddressConverter } from './address-converter.ts';
import type { AuthSchema } from './schema.ts';

// deno-lint-ignore require-await
export async function inspectorAuthInfo<Schema extends AuthSchema>(
	chain: Chain<Schema>,
	_: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
	tx: Tx,
	addressConverter: AddressConverter
) {
	const length = tx.authInfo?.signerInfos.length;
	if (length === 0) {
		throw Error('signer_infos is empty');
	}
	if (length !== tx.signatures.length) {
		throw Error(`signer_infos.length(${length}) !== signatures.length(${tx.signatures.length})`);
	}

	const signerMap: { [address: string]: boolean } = {};

	for (const msgAny of tx.body?.msgs || []) {
		const msg = chain.moduleRegistry.extractAny<Msg>(msgAny);
		for (const signer of msg.signers()) {
			signerMap[signer] = false;
		}
	}

	// Check duplicated signer
	for (const signerInfo of tx.authInfo?.signerInfos || []) {
		const address = addressConverter(
			chain.moduleRegistry.extractAny<PublicKey>(signerInfo.publicKey!)
		);

		if (signerMap[address]) {
			throw Error(`Duplicated signer: ${address}`);
		}

		signerMap[address] = true;
	}

	for (const address in signerMap) {
		if (!signerMap[address]) {
			throw Error(`Signature of the address ${address} is required`);
		}
	}
}
