import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export function postgresDatabase<Schema extends Record<string, unknown>>(
	dbUrl: string,
	schema: Schema
) {
	const pg = postgres(dbUrl, {
		prepare: false,
		ssl: true
	});
	return drizzle(pg, { schema });
}
