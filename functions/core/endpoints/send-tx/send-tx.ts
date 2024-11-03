import { fromBinary } from '@bufbuild/protobuf';
import { getTxHash, TxSchema } from '@supabase-l2-blockchain/types/core';

import type { Chain } from '../../../chain.ts';
import type { CoreSchema } from '../../schema/mod.ts';
import { convertTx, txs } from '../../schema/txs.ts';

export async function sendTx<Schema extends CoreSchema>(
	chain: Chain<Schema>,
	txBinary: Uint8Array
): Promise<string> {
	const tx = fromBinary(TxSchema, txBinary);
	const hash = getTxHash(tx);

	await chain.db.insert(txs).values(convertTx(hash, tx, chain.moduleRegistry.protobufRegistry));

	return hash;
}
