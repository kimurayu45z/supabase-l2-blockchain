import { block_bodies, block_headers } from './blocks.ts';
import { txs } from './txs.ts';

export const coreSchema = {
	block_headers,
	block_bodies,
	txs
};

export type CoreSchema = typeof coreSchema;
