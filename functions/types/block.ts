import { Buffer } from 'node:buffer';

import type { BlockHeader } from '../../types/block.d.ts';
import { canonicalizeObjectForSerialization } from './crypto/json.ts';

export function getSignBytes(blockHeader: BlockHeader): Buffer {
	const canonical = canonicalizeObjectForSerialization(blockHeader);
	const json = JSON.stringify(canonical);

	return Buffer.from(json);
}
