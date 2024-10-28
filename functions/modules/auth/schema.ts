import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
	address: text('address').primaryKey(),
	sequence: serial('sequence').default(0).notNull()
});

export type AuthSchema = {
	accounts: typeof accounts;
};
