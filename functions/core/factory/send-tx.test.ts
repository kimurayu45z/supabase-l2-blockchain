import { Buffer } from 'node:buffer';

import type { Tx, TxBody } from '@supabase-l2-blockchain/types/core';

import { createMockDb } from '../../chain.test.ts';
import { Chain } from '../../chain.ts';
import { ModuleRegistry } from '../../module-registry.ts';
import { CryptoModule } from '../../modules/crypto/crypto.ts';
import { createKeyPairEd25519, signEd25519 } from '../../types/crypto/ed25519.test.ts';
import { getTxSignBytes } from '../../types/tx.ts';
import { coreSchema } from '../schema/mod.ts';
import { sendTxFactory } from './send-tx.ts';

Deno.test('sendTx', async () => {
	const chainId = 'test';
	const chain = new Chain(
		chainId,
		await createMockDb({ ...coreSchema }),
		new ModuleRegistry(new CryptoModule())
	);

	const [privateKey, publicKey] = createKeyPairEd25519(Buffer.from('seed'));

	const sendTx = sendTxFactory(chain);

	// Empty Tx is allowed if AuthModule is detached
	const tx: Tx = {
		body: { msgs: [], memo: '', timeout_timestamp: new Date() },
		auth_info: {
			signer_infos: []
		},
		signatures: []
	};

	const res = await sendTx(
		new Request({ body: new Blob([JSON.stringify({ tx })]).stream() } as any),
		{} as any
	);
	const body = await res.json();
	console.log(body);
});
