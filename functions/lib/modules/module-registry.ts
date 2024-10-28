import type { Inspector } from '../types/inspector.ts';
import type { Module } from '../types/module.ts';
import type { MsgConstructor } from '../types/msg.ts';

export class ModuleRegistry<Schema extends Record<string, unknown>> {
	public msgs: { [type: string]: MsgConstructor<Schema> };
	public inspectors: Inspector<Schema>[];

	constructor() {
		this.msgs = {};
		this.inspectors = [];
	}
}

export function registerModules<Schema extends Record<string, unknown>>(
	registry: ModuleRegistry<Schema>,
	...modules: Module<Schema>[]
) {
	for (const module of modules) {
		for (const msg of module.msgs()) {
			registry.msgs[`${module.name()}/${msg.name()}`] = msg;
		}

		registry.inspectors = registry.inspectors.concat(module.inspectors());
	}
}
