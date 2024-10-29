import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { Buffer } from 'node:buffer';

import { zip } from 'https://deno.land/std@0.102.0/collections/zip.ts';

import type { Any } from '../../../types/any.ts';
import type { BlockHeader } from '../../../types/block.ts';
import { canonicalizeObjectForSerialization } from '../../../types/json.ts';
import type { SignBlockRequestBody } from '../../../types/sign-block.ts';
import type { Chain } from '../../chain.ts';
import type { PublicKey } from '../../types/crypto/public-key.ts';
import type { CoreSchema } from '../schema/mod.ts';

export function signBlockFactory(chain: Chain<CoreSchema>): Deno.ServeHandler {
	return async (req) => {
		const { block_header, signatures }: SignBlockRequestBody = await req.json();
		const lastBlock = await chain.db.query.blocks.findFirst({
			where: (block, { eq }) => eq(block.chain_id, block_header.chain_id),
			orderBy: (block, { desc }) => [desc(block.height)]
		});
		if (!lastBlock) {
			throw Error();
		}
		const bodyHash = lastBlock.body_hash;

		const lastBlockBody = await chain.db.query.block_bodies.findFirst({
			where: (blockBody, { eq }) => eq(blockBody.body_hash, bodyHash)
		});

		if (!lastBlockBody) {
			throw Error();
		}

		const signers = lastBlockBody.next_signers as Any[];

		const signBytes = getSignBytes(block_header);

		const signerPublicKeys = signers.map((signer) =>
			chain.moduleRegistry.extractAny<PublicKey>(signer)
		);

		await Promise.all(
			// deno-lint-ignore require-await
			zip(signerPublicKeys, signatures).map(async ([signerPublicKey, signature]) => {
				const signatureBuffer = Buffer.from(signature, 'hex');
				const match = signerPublicKey.verify(signBytes, signatureBuffer);

				if (!match) {
					throw Error();
				}
			})
		);

		const res = {};

		return new Response(JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } });
	};
}

function getSignBytes(blockHeader: BlockHeader): Buffer {
	const canonical = canonicalizeObjectForSerialization(blockHeader);
	const json = JSON.stringify(canonical);

	return Buffer.from(json);
}
