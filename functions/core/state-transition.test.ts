import { Buffer } from 'node:buffer';

import type { Tx } from '@supabase-l2-blockchain/types/core';

import { createMockDb } from '../chain.test.ts';
import { Chain } from '../chain.ts';
import { ModuleRegistry } from '../module-registry.ts';
import { CryptoModule } from '../modules/crypto/crypto.ts';
import { createKeyPairEd25519 } from '../types/crypto/ed25519.test.ts';
import { coreSchema } from './schema/mod.ts';
import { stateTransition } from './state-transition.ts';

Deno.test('stateTransition', async () => {
	const chainId = 'test';
	const chain = new Chain(
		chainId,
		await createMockDb({ ...coreSchema }),
		new ModuleRegistry(new CryptoModule())
	);

	// Empty Tx is allowed if AuthModule is detached
	const tx: Tx = {
		body: { msgs: [], memo: '', timeout_timestamp: new Date() },
		auth_info: {
			signer_infos: []
		},
		signatures: []
	};

	await chain.db.transaction(async (dbTx) => {
		const txResponse = await stateTransition(chain, dbTx, tx);

		console.log(txResponse);
	});
});
