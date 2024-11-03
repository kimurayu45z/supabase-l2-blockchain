import { toJson, type JsonValue, type Registry } from '@bufbuild/protobuf';
import type { AnyJson } from '@bufbuild/protobuf/wkt';
import {
	BlockBodySchema,
	BlockHeaderSchema,
	getBlockHash,
	type BlockBody,
	type BlockHeader
} from '@supabase-l2-blockchain/types/core';
import type { InferInsertModel } from 'drizzle-orm';
import { integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const block_headers = pgTable('block_headers', {
	chain_id: text('chain_id').primaryKey(),
	height: integer('height').primaryKey(),
	time: timestamp('time').notNull(),
	last_block_hash: text('last_block_hash').notNull(),
	txs_merkle_root: text('txs_merkle_root').notNull(),

	hash: text('hash').notNull()
});

export const block_bodies = pgTable('block_bodies', {
	chain_id: text('chain_id').primaryKey(),
	height: integer('height').primaryKey(),
	txs: jsonb('txs').$type<JsonValue>().notNull(),
	next_signers: jsonb('next_signers').array().$type<AnyJson[]>().notNull(),
	signatures: text('signatures').array().notNull()
});

export const createTableSqlBlocks = `
CREATE TABLE block_bodies
(
	chain_id TEXT NOT NULL,
	height INTEGER NOT NULL,
	txs JSONB NOT NULL,
	next_signers JSONB[] NOT NULL,
	signatures TEXT[] NOT NULL,
	PRIMARY KEY (chain_id, height)
);

CREATE TABLE block_headers
(
	chain_id TEXT NOT NULL,
	height INTEGER NOT NULL,
	time TIMESTAMP NOT NULL,
	last_block_hash TEXT NOT NULL,
	txs_merkle_root TEXT NOT NULL,

	hash TEXT NOT NULL,

	PRIMARY KEY (chain_id, height),
	FOREIGN KEY (chain_id, height) REFERENCES block_bodies(chain_id, height)
);
`;

export function convertBlockHeader(
	blockHeader: BlockHeader,
	protobufRegistry: Registry
): InferInsertModel<typeof block_headers> {
	const hash = getBlockHash(blockHeader);
	const json = toJson(BlockHeaderSchema, blockHeader, {
		registry: protobufRegistry
	}) as unknown as {
		chainId: string;
		height: string;
		time: string;
		lastBlockHash?: string;
		txsMerkleRoot?: string;
	};

	return {
		chain_id: json.chainId,
		height: Number(json.height),
		time: new Date(json.time),
		last_block_hash: json.lastBlockHash || '',
		txs_merkle_root: json.txsMerkleRoot || '',

		hash: hash.toString('hex')
	};
}

export function convertBlockBody(
	chainId: string,
	height: number,
	blockBody: BlockBody,
	protobufRegistry: Registry
): InferInsertModel<typeof block_bodies> {
	const json = toJson(BlockBodySchema, blockBody, { registry: protobufRegistry }) as unknown as {
		txs: JsonValue;
		nextSigners: AnyJson[];
		signatures: string[];
	};

	return {
		chain_id: chainId,
		height: height,
		txs: json.txs,
		next_signers: json.nextSigners,
		signatures: json.signatures
	};
}
