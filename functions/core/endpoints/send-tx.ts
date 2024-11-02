import { getTxHash, type Tx } from '@supabase-l2-blockchain/types/core';

import type { Chain } from '../../chain.ts';
import type { CoreSchema } from '../schema/mod.ts';
import { convertTx, txs } from '../schema/txs.ts';

export async function sendTx<Schema extends CoreSchema>(
	chain: Chain<Schema>,
	tx: Tx
): Promise<string> {
	const hash = getTxHash(tx);

	await chain.db.insert(txs).values(convertTx(hash, tx));

	return hash.toString('hex');
}
