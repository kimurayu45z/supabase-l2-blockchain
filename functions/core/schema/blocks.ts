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
	txs: jsonb('txs').array().notNull(),
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
	txs JSONB[] NOT NULL,
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
