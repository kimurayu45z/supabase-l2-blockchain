import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

import type { ModuleRegistry } from './modules/module-registry.ts';
import { postgresDatabase } from './postgres.ts';

export class Chain<Schema extends Record<string, unknown>> {
	db: PostgresJsDatabase<Schema>;

	constructor(
		public id: string,
		db: { url: string; schema: Schema },
		public moduleRegistry: ModuleRegistry<Schema>
	) {
		this.db = postgresDatabase(db.url, db.schema);
	}
}
