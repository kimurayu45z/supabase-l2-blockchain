import { PostgreSqlContainer } from '@testcontainers/postgresql';

import { createDb } from './chain.ts';

export async function createMockDb<Schema extends Record<string, unknown>>(
	schema: Schema,
	initSql: string
) {
	const databaseContainer = await new PostgreSqlContainer().start();
	const dbUri = databaseContainer.getConnectionUri();

	const db = createDb(dbUri, { prepare: false }, { schema: schema, logger: true });

	db.execute(initSql);

	return db;
}
