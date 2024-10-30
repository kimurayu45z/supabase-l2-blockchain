import { Buffer } from 'node:buffer';

import type { TxBody, TxSignDoc } from '@supabase-l2-blockchain/types/core/index.d.ts';

import { canonicalizeObjectForSerialization } from './crypto/json.ts';

export function getSignBytes(txBody: TxBody, chainId: string, sequence: number): Buffer {
	const signDoc: TxSignDoc = {
		body: txBody,
		chain_id: chainId,
		sequence: sequence
	};
	const canonical = canonicalizeObjectForSerialization(signDoc);
	const json = JSON.stringify(canonical);

	return Buffer.from(json);
}
