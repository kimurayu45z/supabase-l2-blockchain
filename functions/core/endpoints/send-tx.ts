import '@supabase/functions-js/edge-runtime.d.ts';

import type { Tx } from '@supabase-l2-blockchain/types/core';

import type { Chain } from '../../chain.ts';
import { getTxHash } from '../../types/tx.ts';
import type { CoreSchema } from '../schema/mod.ts';
import { txs } from '../schema/txs.ts';

export async function sendTx<Schema extends CoreSchema>(
	chain: Chain<Schema>,
	tx: Tx
): Promise<string> {
	const hash = getTxHash(tx).toString('hex');

	await chain.db.insert(txs).values({
		hash: hash,
		body: tx.body,
		auth_info: tx.auth_info,
		signatures: tx.signatures
	});

	return hash;
}
