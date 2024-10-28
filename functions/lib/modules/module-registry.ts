import type { Any, AnyPossibleConstructor } from '../../../types/any.ts';
import type { Inspector } from '../types/inspector.ts';
import type { Module } from '../types/module.ts';
import type { MsgConstructor } from '../types/msg.ts';

export class ModuleRegistry<Schema extends Record<string, unknown>> {
	public inspectors: Inspector<Schema>[];
	public msgs: { [type: string]: MsgConstructor<Schema> };
	public types: { [type: string]: AnyPossibleConstructor };

	constructor() {
		this.inspectors = [];
		this.msgs = {};
		this.types = {};
	}

	extractAny<T = unknown>(value: Any): T {
		const type = this.types[value.type];
		if (!type) {
			throw Error(`Unknown type: ${value.type}`);
		}
		return new type(value.value) as T;
	}
}

export function registerModules<Schema extends Record<string, unknown>>(
	registry: ModuleRegistry<Schema>,
	...modules: Module<Schema>[]
) {
	for (const module of modules) {
		for (const msg of module.msgs()) {
			registry.msgs[msg.type()] = msg;
		}

		registry.inspectors = registry.inspectors.concat(module.inspectors());
	}
}
