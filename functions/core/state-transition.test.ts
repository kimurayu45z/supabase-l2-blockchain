import type { Tx } from '@supabase-l2-blockchain/types/core';

import { createMockDb } from '../chain.test.ts';
import { Chain } from '../chain.ts';
import { ModuleRegistry } from '../module-registry.ts';
import { CryptoModule } from '../modules/crypto/crypto.ts';
import { coreSchema } from './schema/mod.ts';
import { stateTransition } from './state-transition.ts';

Deno.test(
	'stateTransition',
	{
		sanitizeOps: false,
		sanitizeResources: false
	},
	async () => {
		const chainId = 'test';
		const chain = new Chain(
			chainId,
			await createMockDb(
				{ ...coreSchema },
				`
			CREATE TABLE txs
			(
				hash TEXT NOT NULL PRIMARY KEY,
				created_at TIMESTAMP NOT NULL DEFAULT NOW(),
				body JSONB NOT NULL,
				auth_info JSONB NOT NULL,
				signatures TEXT[] NOT NULL,
				height INTEGER,
				success BOOLEAN,
				inspection_error TEXT,
				msg_responses JSONB[] NOT NULL
			);
			`
			),
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
	}
);
