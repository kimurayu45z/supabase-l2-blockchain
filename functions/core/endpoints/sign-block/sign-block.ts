import { Buffer } from 'node:buffer';

import { fromJson, toBinary, type JsonValue } from '@bufbuild/protobuf';
import {
	AuthInfoSchema,
	BlockSchema,
	createTx,
	getTxHash,
	TxBodySchema,
	type PublicKey
} from '@supabase-l2-blockchain/types/core';

import type { Chain } from '../../../chain.ts';
import { produceBlock } from '../../produce-block.ts';
import type { CoreSchema } from '../../schema/mod.ts';

export async function signBlock(
	chain: Chain<CoreSchema>,
	signHandler: (signer: PublicKey, signMessage: Uint8Array) => Promise<Uint8Array>,
	postBlockHandler: (blockBinary: Uint8Array) => Promise<void>
): Promise<void> {
	const pendingTxs = await chain.db.query.txs.findMany({
		where: (tx, { isNull }) => isNull(tx.height),
		orderBy: (tx, { asc }) => [asc(tx.created_at)]
	});

	const sortedTxsWithHash = pendingTxs
		.map((tx) =>
			createTx(
				fromJson(TxBodySchema, tx.body as JsonValue),
				fromJson(AuthInfoSchema, tx.auth_info as JsonValue),
				tx.signatures.map((signature) => Buffer.from(signature, 'hex'))
			)
		)
		.map((tx) => ({
			hash: getTxHash(tx),
			tx
		}));

	const block = await produceBlock(chain, sortedTxsWithHash, signHandler);

	const blockBytes = toBinary(BlockSchema, block);
	await postBlockHandler(blockBytes).catch((_) => {});
}
