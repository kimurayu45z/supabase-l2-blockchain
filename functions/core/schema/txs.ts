import { toJson, type JsonValue, type Registry } from '@bufbuild/protobuf';
import { TxSchema, type MsgResponse, type Tx } from '@supabase-l2-blockchain/types/core';
import type { InferInsertModel } from 'drizzle-orm';
import { boolean, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const txs = pgTable('txs', {
	hash: text('hash').primaryKey(),
	created_at: timestamp('created_at').defaultNow().notNull(),
	body: jsonb('body').$type<JsonValue>().notNull(),
	auth_info: jsonb('auth_info').$type<JsonValue>().notNull(),
	signatures: text('signatures').array().notNull(),
	height: integer('height'),
	success: boolean('success'),
	inspection_error: text('inspection_error'),
	msg_responses: jsonb('msg_responses').$type<MsgResponse>().array()
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

export function convertTx(
	hash: string,
	tx: Tx,
	protobufRegistry: Registry
): InferInsertModel<typeof txs> {
	const json = toJson(TxSchema, tx, { registry: protobufRegistry }) as unknown as {
		body: JsonValue;
		authInfo: JsonValue;
		signatures: string[];
	};
	return {
		hash: hash,
		body: json.body,
		auth_info: json.authInfo,
		signatures: json.signatures || []
	};
}
