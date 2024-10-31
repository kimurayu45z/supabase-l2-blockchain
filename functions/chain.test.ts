import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { createDb } from './chain.ts';

export async function createMockDb<Schema extends Record<string, unknown>>(schema: Schema) {
	const databaseContainer = await new PostgreSqlContainer().start();
	const dbUri = databaseContainer.getConnectionUri();

	const db = createDb(dbUri, { prepare: false }, { schema: schema, logger: true });

	migrate(db, { migrationsFolder: './migrations' });

	return db;
}
