import type { Inspector } from '../types/inspector.ts';
import type { Module } from '../types/module.ts';
import type { MsgConstructor } from '../types/msg.ts';

export class Registry {
	public msgs: { [type: string]: MsgConstructor };
	public inspectors: Inspector[];

	constructor() {
		this.msgs = {};
		this.inspectors = [];
	}
}

export function registerModules(registry: Registry, ...modules: Module[]) {
	for (const module of modules) {
		for (const msg of module.msgs()) {
			registry.msgs[`${module.name()}/${msg.name()}`] = msg;
		}

		registry.inspectors = registry.inspectors.concat(module.inspectors());
	}
}
