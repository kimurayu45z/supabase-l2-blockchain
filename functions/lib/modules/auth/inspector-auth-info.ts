import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Tx } from '../../../../types/tx.ts';
import type { Msg } from '../../types/msg.ts';
import { ModuleRegistry } from '../module-registry.ts';
import type { AuthSchema } from './schema.ts';

// deno-lint-ignore require-await
export async function inspectorAuthInfo<Schema extends AuthSchema>(
	_: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
	tx: Tx
) {
	const length = tx.auth_info.signer_infos.length;
	if (length === 0) {
		throw Error('signer_infos is empty');
	}
	if (length !== tx.signatures.length) {
		throw Error(`signer_infos.length(${length}) !== signatures.length(${tx.signatures.length})`);
	}

	const signerMap: { [address: string]: boolean } = {};

	for (const msgAny of tx.body.msgs) {
		const registry: ModuleRegistry<Schema> = new ModuleRegistry();

		const msg = registry.extractAny<Msg<Schema>>(msgAny);
		for (const signer of msg.signers()) {
			signerMap[signer] = false;
		}
	}

	for (const signerInfo of tx.auth_info.signer_infos) {
		const address = signerInfo.public_key.value as string;

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
