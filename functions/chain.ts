import type { ModuleRegistry } from './modules/module-registry.ts';

export class Chain<Schema extends Record<string, unknown>> {
	id: string;
	constructor(
		public db: { url: string; schema: Schema },
		public moduleRegistry: ModuleRegistry<Schema>
	) {
		const chainId = Deno.env.get('CHAIN_ID');
		if (!chainId) {
			throw Error('Environment variable CHAIN_ID is not configured');
		}
		this.id = chainId;
	}
}
