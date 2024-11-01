// import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { PostgresMock } from 'npm:pgmock';

import { createDb } from './chain.ts';

export async function createMockDb<Schema extends Record<string, unknown>>(
	schema: Schema,
	initSql: string
) {
	// const databaseContainer = await new PostgreSqlContainer().start();
	// const dbUri = databaseContainer.getConnectionUri();

	const mock = await PostgresMock.create();
	const connectionString = await mock.listen(5432);

	const db = createDb(connectionString, { prepare: false }, { schema: schema, logger: true });

	const raw = await db.execute(initSql);
	console.log(raw);

	return db;
}
