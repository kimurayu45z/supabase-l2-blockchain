import * as crypto from 'node:crypto';

import { PrivateKeyEd25519, PublicKeyEd25519 } from '@supabase-l2-blockchain/types/modules/crypto';

import { createMockDb } from '../chain.test.ts';
import { Chain } from '../chain.ts';
import { ModuleRegistry } from '../module-registry.ts';
import { CryptoModule } from '../modules/crypto/crypto.ts';
import { insertGenesisBlock } from './genesis.ts';
import { produceBlock } from './produce-block.ts';
import { createTableSqlBlocks } from './schema/blocks.ts';
import { coreSchema } from './schema/mod.ts';

Deno.test(
	'produceBlock',
	{
		sanitizeOps: false,
		sanitizeResources: false
	},
	async () => {
		const chainId = 'test';
		const chain = new Chain(
			chainId,
			await createMockDb({ ...coreSchema }, createTableSqlBlocks),
			new ModuleRegistry(new CryptoModule())
		);

		const privateKey = new PrivateKeyEd25519(crypto.randomBytes(32));
		const publicKey = new PublicKeyEd25519(await privateKey.publicKey());

		await chain.db.transaction(async (dbTx) => {
			await insertGenesisBlock(chain, dbTx, 'genesis', [publicKey]);
		});
		const block = await produceBlock(chain, [], (_, signBytes) => privateKey.sign(signBytes));

		console.log(block);
	}
);
