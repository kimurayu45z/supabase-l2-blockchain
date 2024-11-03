import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
	address: text('address').primaryKey(),
	sequence: integer('sequence').notNull()
});

export const authSchema = {
	accounts
};

export type AuthSchema = typeof authSchema;

export const createTableSqlAccounts = `
CREATE TABLE accounts
(
	address TEXT NOT NULL PRIMARY KEY,
	sequence INTEGER NOT NULL
)
`;
