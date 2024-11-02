import { numeric, pgTable, text } from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
	address: text('address').primaryKey(),
	sequence: numeric('sequence').notNull()
});

export const authSchema = {
	accounts
};

export type AuthSchema = typeof authSchema;
