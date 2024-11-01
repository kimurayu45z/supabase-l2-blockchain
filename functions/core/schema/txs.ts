import { boolean, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const txs = pgTable('txs', {
	hash: text('hash').primaryKey(),
	created_at: timestamp('created_at').defaultNow().notNull(),
	body: jsonb('body').notNull(),
	auth_info: jsonb('auth_info').notNull(),
	signatures: text('signatures').array().notNull(),
	height: integer('height'),
	success: boolean('success'),
	inspection_error: text('inspection_error'),
	msg_responses: jsonb('msg_responses').array()
});

export const createTableSqlTxs = `
CREATE TABLE txs
(
	hash TEXT NOT NULL PRIMARY KEY,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	body JSONB NOT NULL,
	auth_info JSONB NOT NULL,
	signatures TEXT[] NOT NULL,
	height INTEGER,
	success BOOLEAN,
	inspection_error TEXT,
	msg_responses JSONB[]
);
`;
