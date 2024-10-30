import type { Any } from './any.d.ts';
import type { Tx } from './tx.d.ts';

export type BlockHeader = {
	chain_id: string;
	height: number;
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
