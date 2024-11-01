import { block_bodies, block_headers, blocks } from './blocks.ts';
import { txs } from './txs.ts';

export const coreSchema = {
	block_headers,
	block_bodies,
	blocks,
	txs
};

export type CoreSchema = typeof coreSchema;
