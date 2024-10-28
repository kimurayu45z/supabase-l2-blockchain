import { canonicalizeObjectForSerialization } from './json.ts';
import type { Tx } from './tx.ts';

export type BlockHeader = {
	chain_id: string;
	height: bigint;
	time: Date;
	last_signatures_hash: string;
	txs_hash: string;
	next_signers_hash: string;
	signatures: string[];
};

export type BlockBody = {
	txs: Tx[];
};

export type Block = {
	header: BlockHeader;
	body: BlockBody;
};

export function getSignBytes(block: Block): Buffer {
	const canonical = canonicalizeObjectForSerialization(block);
	const json = JSON.stringify(canonical);

	return Buffer.from(json);
}
