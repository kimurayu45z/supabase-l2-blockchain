import { Buffer } from 'node:buffer';

import { createMockDb } from '../chain.test.ts';
import { Chain } from '../chain.ts';
import { ModuleRegistry } from '../module-registry.ts';
import { CryptoModule } from '../modules/crypto/crypto.ts';
import { createKeyPairEd25519, signEd25519 } from '../types/crypto/ed25519.test.ts';
import { produceBlock } from './produce-block.ts';
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
			await createMockDb(
				{ ...coreSchema },
				`
			CREATE TABLE block_headers
			(
				chain_id TEXT NOT NULL,
				height INTEGER NOT NULL,
				time TIMESTAMP NOT NULL,
				last_block_hash TEXT NOT NULL,
				txs_merkle_root TEXT NOT NULL,
				PRIMARY KEY (chain_id, height)
			);

			CREATE TABLE block_bodies
			(
				block_hash TEXT NOT NULL PRIMARY KEY,
				txs JSONB[] NOT NULL,
				next_signers JSONB[] NOT NULL,
				signatures TEXT[] NOT NULL
			);

			CREATE TABLE blocks
			(
				hash TEXT NOT NULL PRIMARY KEY,
				chain_id TEXT NOT NULL,
				height INTEGER NOT NULL,
				FOREIGN KEY (hash) REFERENCES block_bodies(block_hash),
				FOREIGN KEY (chain_id, height) REFERENCES block_headers(chain_id, height)
			);
			`
			),
			new ModuleRegistry(new CryptoModule())
		);

		const [privateKey, publicKey] = createKeyPairEd25519(Buffer.from('seed'));

		await chain.db.insert(coreSchema.block_headers).values({
			chain_id: chainId,
			height: 0,
			time: new Date(),
			last_block_hash: 'genesis',
			txs_merkle_root: 'genesis'
		});
		await chain.db.insert(coreSchema.block_bodies).values({
			block_hash: 'genesis',
			txs: [],
			next_signers: [chain.moduleRegistry.packAny(publicKey)],
			signatures: []
		});
		await chain.db.insert(coreSchema.blocks).values({
			hash: 'genesis',
			chain_id: chainId,
			height: 0
		});

		const block = await produceBlock(chain, [], (_, signBytes) =>
			Promise.resolve(signEd25519(privateKey, signBytes))
		);

		console.log(block);
	}
);
