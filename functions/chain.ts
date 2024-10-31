import type { DrizzleConfig } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import postgres from 'postgres';

import type { ModuleRegistry } from './module-registry.ts';

export function createDb<Schema extends Record<string, unknown>>(
	connectionUri: string,
	options: postgres.Options<Record<string, postgres.PostgresType>>,
	config: DrizzleConfig<Schema>
): PostgresJsDatabase<Schema> {
	const db = drizzle(postgres(connectionUri, options), config);

	return db;
}

export class Chain<Schema extends Record<string, unknown>> {
	constructor(
		public id: string,
		public db: PostgresJsDatabase<Schema>,
		public moduleRegistry: ModuleRegistry<Schema>
	) {}
}
