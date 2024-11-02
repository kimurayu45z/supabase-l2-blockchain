import { Buffer } from 'node:buffer';

import { toJson, type Registry } from '@bufbuild/protobuf';
import { AnySchema, type Any } from '@bufbuild/protobuf/wkt';
import { TxsSchema, type BlockBody, type BlockHeader } from '@supabase-l2-blockchain/types/core';
import type { InferInsertModel } from 'drizzle-orm';
import { integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const block_headers = pgTable('block_headers', {
	chain_id: text('chain_id').primaryKey(),
	height: integer('height').primaryKey(),
	time: timestamp('time').notNull(),
	last_block_hash: text('last_block_hash').notNull(),
	txs_merkle_root: text('txs_merkle_root').notNull()
});

export const block_bodies = pgTable('block_bodies', {
	block_hash: text('block_hash').primaryKey(),
	txs: jsonb('txs').notNull(),
	next_signers: jsonb('next_signers').array().notNull(),
	signatures: text('signatures').array().notNull()
});

export const blocks = pgTable('blocks', {
	hash: text('hash')
		.primaryKey()
		.references(() => block_bodies.block_hash),
	chain_id: text('chain_id')
		.notNull()
		.references(() => block_headers.chain_id),
	height: integer('height')
		.notNull()
		.references(() => block_headers.height)
});

export const createTableSqlBlocks = `
CREATE TABLE block_headers
(
	chain_id TEXT NOT NULL,
	height INTEGER NOT NULL,
	time TIMESTAMP NOT NULL,
	last_block_hash TEXT NOT NULL,
	txs_merkle_root TEXT NOT NULL,
	PRIMARY KEY (chain_id, height)
);

CREATE TABLE block_bodies
(
	block_hash TEXT NOT NULL PRIMARY KEY,
	txs JSONB NOT NULL,
	next_signers JSONB[] NOT NULL,
	signatures TEXT[] NOT NULL
);

CREATE TABLE blocks
(
	hash TEXT NOT NULL PRIMARY KEY,
	chain_id TEXT NOT NULL,
	height INTEGER NOT NULL,
	FOREIGN KEY (hash) REFERENCES block_bodies(block_hash),
	FOREIGN KEY (chain_id, height) REFERENCES block_headers(chain_id, height)
);
`;

export function convertBlockHeader(
	blockHeader: BlockHeader
): InferInsertModel<typeof block_headers> {
	return {
		chain_id: blockHeader.chainId,
		height: Number(blockHeader.height),
		time: new Date(
			Number(blockHeader.time?.seconds || 0) * 1000 + Number(blockHeader.time?.nanos || 0) / 1000000
		),
		last_block_hash: Buffer.from(blockHeader.lastBlockHash).toString('hex'),
		txs_merkle_root: Buffer.from(blockHeader.txsMerkleRoot).toString('hex')
	};
}

export function convertBlockBody(
	hash: Buffer,
	blockBody: BlockBody,
	protobufRegistry: Registry
): InferInsertModel<typeof block_bodies> {
	return {
		block_hash: hash.toString('hex'),
		txs: blockBody.txs ? toJson(TxsSchema, blockBody.txs) : {},
		next_signers: blockBody.nextSigners.map((signerAny: Any) =>
			toJson(AnySchema, signerAny, { registry: protobufRegistry })
		),
		signatures: blockBody.signatures.map((signature: Uint8Array) =>
			Buffer.from(signature).toString('hex')
		)
	};
}

export function convertBlock(
	hash: Buffer,
	blockHeader: BlockHeader
): InferInsertModel<typeof blocks> {
	return {
		hash: hash.toString('hex'),
		chain_id: blockHeader.chainId,
		height: Number(blockHeader.height)
	};
}
