import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

import type { ModuleRegistry } from './module-registry.ts';

export class Chain<Schema extends Record<string, unknown>> {
	constructor(
		public id: string,
		public db: PostgresJsDatabase<Schema>,
		public moduleRegistry: ModuleRegistry<Schema>
	) {}
}
