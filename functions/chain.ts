import type { ModuleRegistry } from './modules/module-registry.ts';

export class Chain<Schema extends Record<string, unknown>> {
	constructor(
		public id: string,
		public db: { url: string; schema: Schema },
		public moduleRegistry: ModuleRegistry<Schema>
	) {}
}
