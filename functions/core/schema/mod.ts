import type { block_bodies, block_headers, blocks } from './blocks.ts';
import type { txs } from './txs.ts';

export * from './blocks.ts';
export * from './txs.ts';

export type CoreSchema = {
	block_headers: typeof block_headers;
	block_bodies: typeof block_bodies;
	blocks: typeof blocks;
	txs: typeof txs;
};
