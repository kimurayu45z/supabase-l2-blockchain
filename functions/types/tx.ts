import { Buffer } from 'node:buffer';
import * as crypto from 'node:crypto';

import type { Tx } from '@supabase-l2-blockchain/types';
import type { TxBody, TxSignDoc } from '@supabase-l2-blockchain/types/core';

import { canonicalizeObjectForSerialization } from './crypto/json.ts';

export function getTxSignBytes(txBody: TxBody, chainId: string, sequence: number): Buffer {
	const signDoc: TxSignDoc = {
		body: txBody,
		chain_id: chainId,
		sequence: sequence
	};
	const canonical = canonicalizeObjectForSerialization(signDoc);
	const json = JSON.stringify(canonical);

	return Buffer.from(json);
}

export function getTxBytes(tx: Tx): Buffer {
	const canonical = canonicalizeObjectForSerialization(tx);
	const json = JSON.stringify(canonical);
	const bytes = Buffer.from(json);

	return bytes;
}

export function getTxHash(tx: Tx): Buffer {
	const bytes = getTxBytes(tx);
	const hash = crypto.createHash('sha256').update(bytes).digest();

	return hash;
}
