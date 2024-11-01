import { pgTable, serial, text } from 'drizzle-orm/pg-core';

const accounts = pgTable('accounts', {
	address: text('address').primaryKey(),
	sequence: serial('sequence').default(0).notNull()
});

export const authSchema = {
	accounts
};

export type AuthSchema = typeof authSchema;
