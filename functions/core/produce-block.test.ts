import { Buffer } from 'node:buffer';

import { createMockDb } from '../chain.test.ts';
import { Chain } from '../chain.ts';
import { ModuleRegistry } from '../module-registry.ts';
import { CryptoModule } from '../modules/crypto/crypto.ts';
import { createKeyPairEd25519, signEd25519 } from '../types/crypto/ed25519.test.ts';
import { produceBlock } from './produce-block.ts';
import { coreSchema } from './schema/mod.ts';

Deno.test('produceBlock', async () => {
	const chainId = 'test';
	const chain = new Chain(
		chainId,
		await createMockDb({ ...coreSchema }),
		new ModuleRegistry(new CryptoModule())
	);

	const [privateKey, publicKey] = createKeyPairEd25519(Buffer.from('seed'));

	const block = await produceBlock(chain, [], (_, signBytes) =>
		Promise.resolve(signEd25519(privateKey, signBytes))
	);

	console.log(block);
});
