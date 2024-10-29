import { Any } from './any.ts';
import { canonicalizeObjectForSerialization } from './json.ts';
import type { Tx } from './tx.ts';

export type BlockHeader = {
	chain_id: string;
	height: bigint;
	time: Date;
	last_block_hash: string;
	txs_merkle_root: string;
};

export type BlockBody = {
	txs: Tx[];
	next_signers: Any[];
	signatures: string[];
};

export type Block = {
	hash: string;
	header: BlockHeader;
	body: BlockBody;
};
