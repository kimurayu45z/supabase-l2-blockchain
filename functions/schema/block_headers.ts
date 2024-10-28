import { jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const block_headers = pgTable('block_headers', {
	chain_id: text('chain_id').primaryKey(),
	height: serial('height').primaryKey(),
	time: timestamp('time').notNull(),
	last_signatures_hash: text('last_signatures_hash').notNull(),
	txs_hash: text('txs_hash').notNull(),
	next_signers_hash: text('next_signers_hash').notNull(),
	signatures: jsonb('signatures').array()
});
