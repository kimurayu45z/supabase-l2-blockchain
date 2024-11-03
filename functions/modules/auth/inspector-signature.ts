import { Buffer } from 'node:buffer';

import { zip } from '@std/collections';
import type { AnyPossibleConstructor, PublicKey, Tx } from '@supabase-l2-blockchain/types/core';
import { getTxSignMessage } from '@supabase-l2-blockchain/types/core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Chain } from '../../chain.ts';
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
	for (const [signerInfo, signature] of zip(tx.authInfo?.signerInfos || [], tx.signatures)) {
		if (
			!supportedPublicKeyTypes.some(
				(type) => type.desc().typeName === signerInfo.publicKey!.typeUrl
			)
		) {
			throw Error(`Unsupported public key type: ${signerInfo.publicKey!.typeUrl}`);
		}

		const signMessage = getTxSignMessage(
			tx.body!,
			chain.id,
			signerInfo.sequence,
			chain.moduleRegistry.protobufRegistry
		);

		const pubKey = chain.moduleRegistry.extractAny<PublicKey>(signerInfo.publicKey!);

		const match = pubKey.verify(signMessage, Buffer.from(signature));

		if (!match) {
			const address = addressConverter(pubKey);
			throw Error(`Invalid signature of address ${address}`);
		}
	}
}
