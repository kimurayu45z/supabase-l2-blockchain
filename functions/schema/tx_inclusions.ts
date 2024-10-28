import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const tx_inclusions = pgTable('tx_inclusions', {
	tx_hash: text('tx_hash').primaryKey(),
	chain_id: text('chain_id'),
	height: integer('height')
});
