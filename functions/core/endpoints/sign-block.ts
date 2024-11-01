import '@supabase/functions-js/edge-runtime.d.ts';

import { Buffer } from 'node:buffer';

import type { AuthInfo, Tx, TxBody } from '@supabase-l2-blockchain/types/core';

import type { Chain } from '../../chain.ts';
import { canonicalizeObjectForSerialization } from '../../types/crypto/json.ts';
import type { PublicKey } from '../../types/crypto/public-key.ts';
import { getTxHash } from '../../types/tx.ts';
import { produceBlock } from '../produce-block.ts';
import type { CoreSchema } from '../schema/mod.ts';

export async function signBlock(
	chain: Chain<CoreSchema>,
	signHandler: (signer: PublicKey, signBytes: Buffer) => Promise<Buffer>,
	postBlockHandler: (blockBytes: Buffer) => Promise<void>
): Promise<Buffer> {
	const pendingTxs = await chain.db.query.txs.findMany({
		where: (tx, { isNull }) => isNull(tx.height),
		orderBy: (tx, { asc }) => [asc(tx.created_at)]
	});

	const sortedTxsWithHash = pendingTxs.map((tx) => ({
		hash: getTxHash({
			body: tx.body as TxBody,
			auth_info: tx.auth_info as AuthInfo,
			signatures: tx.signatures
		}).toString('hex'),
		tx: {
			body: tx.body,
			auth_info: tx.auth_info,
			signatures: tx.signatures
		} as Tx
	}));

	const block = await produceBlock(chain, sortedTxsWithHash, signHandler);
	const res = canonicalizeObjectForSerialization(block);

	const blockBytes = Buffer.from(JSON.stringify(res));
	await postBlockHandler(blockBytes).catch((_) => {});

	return blockBytes;
}
