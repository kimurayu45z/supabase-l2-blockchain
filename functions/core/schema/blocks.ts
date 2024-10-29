import { integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const block_headers = pgTable('block_headers', {
	chain_id: text('chain_id').primaryKey(),
	height: integer('height').primaryKey(),
	time: timestamp('time').notNull(),
	last_block_hash: text('last_block_hash').notNull(),
	txs_merkle_root: text('txs_merkle_root').notNull()
});

export const block_bodies = pgTable('block_bodies', {
	body_hash: text('body_hash').primaryKey(),
	txs: jsonb('txs').array().notNull(),
	next_signers: jsonb('next_signers').array().notNull(),
	signatures: text('signatures').array().notNull()
});

export const blocks = pgTable('blocks', {
	hash: text('hash').primaryKey(),
	chain_id: text('chain_id')
		.notNull()
		.references(() => block_headers.chain_id),
	height: integer('height')
		.notNull()
		.references(() => block_headers.height),
	body_hash: text('body_hash').notNull()
});
