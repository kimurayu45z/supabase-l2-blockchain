import { Buffer } from 'node:buffer';

import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';
import { zip } from 'https://deno.land/std@0.102.0/collections/zip.ts';

import type { AnyPossibleConstructor } from '../../../types/any.ts';
import { getSignBytes, type Tx } from '../../../types/tx.ts';
import type { Chain } from '../../chain.ts';
import type { PublicKey } from '../../types/crypto/public-key.ts';
import type { AddressConverter } from './address-converter.ts';
import type { AuthSchema } from './schema.ts';

// deno-lint-ignore require-await
export async function inspectorSignature<Schema extends AuthSchema>(
	chain: Chain<Schema>,
	_dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
	tx: Tx,
	addressConverter: AddressConverter,
	supportedPublicKeyTypes: AnyPossibleConstructor<PublicKey>[]
) {
	for (const [signerInfo, signature] of zip(tx.auth_info.signer_infos, tx.signatures)) {
		const pubKey = chain.moduleRegistry.extractAny<PublicKey>(signerInfo.public_key);

		if (!supportedPublicKeyTypes.includes(pubKey.constructor)) {
			throw Error(`Unsupported public key type: ${pubKey.constructor.type()}`);
		}

		const signBytes = getSignBytes(tx.body, chain.id, signerInfo.sequence);

		const match = pubKey.verify(signBytes, Buffer.from(signature, 'hex'));

		if (!match) {
			const address = addressConverter(pubKey);
			throw Error(`Invalid signature of address ${address}`);
		}
	}
}
