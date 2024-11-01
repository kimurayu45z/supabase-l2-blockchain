import { Buffer } from 'node:buffer';

import { createMockDb } from '../../chain.test.ts';
import { Chain } from '../../chain.ts';
import { ModuleRegistry } from '../../module-registry.ts';
import { CryptoModule } from '../../modules/crypto/crypto.ts';
import { createKeyPairEd25519, signEd25519 } from '../../types/crypto/ed25519.test.ts';
import { coreSchema } from '../schema/mod.ts';
import { signBlockFactory } from './sign-block.ts';

Deno.test('sendTx', async () => {
	const chainId = 'test';
	const chain = new Chain(
		chainId,
		await createMockDb(
			{ ...coreSchema },
			`
			CREATE TABLE block_headers
			(
			)

			CREATE TABLE block_bodies
			(
			)

			CREATE TABLE blocks
			(
			)
			`
		),
		new ModuleRegistry(new CryptoModule())
	);

	const [privateKey, _publicKey] = createKeyPairEd25519(Buffer.from('seed'));

	const signBlock = signBlockFactory(
		chain,
		(_signer, signBytes) => Promise.resolve(signEd25519(privateKey, signBytes)),
		async (_) => {}
	);

	const res = await signBlock(
		new Request({ body: new Blob([JSON.stringify({})]).stream() } as any),
		{} as any
	);
	const body = await res.json();
	console.log(body);
});
