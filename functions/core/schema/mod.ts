import type { block_bodies, block_headers, blocks } from './blocks.ts';
import type { tx_inclusions } from './tx_inclusions.ts';
import type { txs } from './txs.ts';

export * from './blocks.ts';
export * from './txs.ts';
export * from './tx_inclusions.ts';

export type CoreSchema = {
	block_headers: typeof block_headers;
	block_bodies: typeof block_bodies;
	blocks: typeof blocks;
	txs: typeof txs;
	tx_inclusions: typeof tx_inclusions;
};
