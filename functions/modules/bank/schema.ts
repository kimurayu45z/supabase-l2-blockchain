import { numeric, pgTable, text } from 'drizzle-orm/pg-core';

export const balances = pgTable('balances', {
	address: text('address').primaryKey(),
	asset_id: text('asset_id').primaryKey(),
	amount: numeric('amount').notNull()
});

export const bankSchema = {
	balances
};

export type BankSchema = typeof bankSchema;
