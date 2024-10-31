import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'npm:drizzle-orm/postgres-js';
import postgres from 'npm:postgres';

export async function createMockDb<Schema extends Record<string, unknown>>(schema: Schema) {
	const databaseContainer = await new PostgreSqlContainer().start();
	const dbUrl = databaseContainer.getConnectionUri();

	const db = drizzle(
		postgres(dbUrl, {
			prepare: false
		}),
		{
			schema: schema,
			logger: true
		}
	);

	migrate(db, { migrationsFolder: './migrations' });

	return db;
}
