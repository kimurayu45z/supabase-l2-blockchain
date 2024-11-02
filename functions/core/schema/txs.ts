import { Buffer } from 'node:buffer';

import { toJson } from '@bufbuild/protobuf';
import { AuthInfoSchema, TxBodySchema, type Tx } from '@supabase-l2-blockchain/types/core';
import type { InferInsertModel } from 'drizzle-orm';
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

export function convertTx(hash: Buffer, tx: Tx): InferInsertModel<typeof txs> {
	return {
		hash: hash.toString('hex'),
		body: tx.body ? toJson(TxBodySchema, tx.body) : {},
		auth_info: tx.authInfo ? toJson(AuthInfoSchema, tx.authInfo) : {},
		signatures: tx.signatures.map((signature) => Buffer.from(signature).toString('hex'))
	};
}
