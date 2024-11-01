import { numeric, pgTable, text } from 'drizzle-orm/pg-core';

const balances = pgTable('balances', {
	address: text('address').primaryKey(),
	asset_id: text('asset_id').primaryKey(),
	amount: numeric('amount').notNull()
});

export const bankSchema = {
	balances
};

export type BankSchema = typeof bankSchema;

export const createTableSqlBalances = `
CREATE TABLE balances
(
	address TEXT NOT NULL,
	asset_id TEXT NOT NULL,
	amount NUMERIC NOT NULL,
	PRIMARY KEY (address, asset_id)
)
`;
