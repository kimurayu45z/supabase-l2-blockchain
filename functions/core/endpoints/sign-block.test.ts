import { Buffer } from 'node:buffer';

import { createMockDb } from '../../chain.test.ts';
import { Chain } from '../../chain.ts';
import { ModuleRegistry } from '../../module-registry.ts';
import { CryptoModule } from '../../modules/crypto/crypto.ts';
import { createKeyPairEd25519, signEd25519 } from '../../types/crypto/ed25519.test.ts';
import { insertGenesisBlock } from '../genesis.ts';
import { createTableSqlBlocks } from '../schema/blocks.ts';
import { coreSchema } from '../schema/mod.ts';
import { createTableSqlTxs } from '../schema/txs.ts';
import { signBlock } from './sign-block.ts';

Deno.test(
	'signBlock',
	{
		sanitizeOps: false,
		sanitizeResources: false
	},
	async () => {
		const chainId = 'test';
		const chain = new Chain(
			chainId,
			await createMockDb({ ...coreSchema }, createTableSqlTxs + createTableSqlBlocks),
			new ModuleRegistry(new CryptoModule())
		);

		const [privateKey, publicKey] = createKeyPairEd25519(Buffer.from('seed'));

		await chain.db.transaction(async (dbTx) => {
			await insertGenesisBlock(chain, dbTx, Buffer.from('genesis'), [publicKey]);
		});

		const blockBytes = await signBlock(
			chain,
			(_signer, signBytes) => Promise.resolve(signEd25519(privateKey, signBytes)),
			async (_) => {}
		);
		console.log(blockBytes.toString());
	}
);