import { createAuthInfo, createTx, createTxBody } from '@supabase-l2-blockchain/types/core';

import { createMockDb } from '../chain.test.ts';
import { Chain } from '../chain.ts';
import { ModuleRegistry } from '../module-registry.ts';
import { CryptoModule } from '../modules/crypto/crypto.ts';
import { coreSchema } from './schema/mod.ts';
import { createTableSqlTxs } from './schema/txs.ts';
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
			await createMockDb({ ...coreSchema }, createTableSqlTxs),
			new ModuleRegistry(new CryptoModule())
		);

		// Empty Tx is allowed if AuthModule is detached
		const tx = createTx(createTxBody([], '', new Date()), createAuthInfo([]), []);

		await chain.db.transaction(async (dbTx) => {
			const txResponse = await stateTransition(chain, dbTx, tx);

			console.log(txResponse);
		});
	}
);
