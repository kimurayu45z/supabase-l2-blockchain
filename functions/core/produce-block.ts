import { Buffer } from 'node:buffer';
import * as crypto from 'node:crypto';

import type {
	Any,
	Block,
	BlockBody,
	BlockHeader
} from '@supabase-l2-blockchain/types/core/index.d.ts';
import { zip } from 'https://deno.land/std@0.102.0/collections/zip.ts';

import { getSignBytes } from '../types/block.ts';
import type { PublicKey } from '../types/crypto/public-key.ts';
import type { Chain } from './chain.ts';
import { block_bodies, block_headers, blocks } from './schema/blocks.ts';
import type { CoreSchema } from './schema/mod.ts';

export async function produceBlock(
	chain: Chain<CoreSchema>,
	blockHeader: BlockHeader,
	blockBody: BlockBody
): Promise<Block> {
	const lastBlock = await chain.db.query.blocks.findFirst({
		where: (block, { eq }) => eq(block.chain_id, blockHeader.chain_id),
		orderBy: (block, { desc }) => [desc(block.height)]
	});
	if (!lastBlock) {
		throw Error();
	}

	const lastBlockBody = await chain.db.query.block_bodies.findFirst({
		where: (blockBody, { eq }) => eq(blockBody.block_hash, lastBlock.hash)
	});

	if (!lastBlockBody) {
		throw Error();
	}

	const signers = lastBlockBody.next_signers as Any[];

	const signBytes = getSignBytes(blockHeader);

	const signerPublicKeys = signers.map((signer) =>
		chain.moduleRegistry.extractAny<PublicKey>(signer)
	);

	await Promise.all(
		// deno-lint-ignore require-await
		zip(signerPublicKeys, blockBody.signatures).map(async ([signerPublicKey, signature]) => {
			const signatureBuffer = Buffer.from(signature, 'hex');
			const match = signerPublicKey.verify(signBytes, signatureBuffer);

			if (!match) {
				throw Error();
			}
		})
	);

	const hash = crypto.createHash('sha256').update(signBytes).digest('hex');
	const block: Block = {
		hash: hash,
		header: blockHeader,
		body: blockBody
	};

	await chain.db.transaction(async (dbTx) => {
		try {
			await dbTx.insert(blocks).values({
				hash: hash,
				chain_id: blockHeader.chain_id,
				height: blockHeader.height
			});
			await dbTx.insert(block_headers).values(blockHeader);
			await dbTx.insert(block_bodies).values({ block_hash: hash, ...blockBody });
		} catch (e) {
			dbTx.rollback();
			throw e;
		}
	});

	return block;
}
