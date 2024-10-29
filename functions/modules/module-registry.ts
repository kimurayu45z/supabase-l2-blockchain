import type { Any, AnyPossible, AnyPossibleConstructor } from '../../types/any.ts';
import type { Module } from '../types/module.ts';
import type { MsgConstructor } from '../types/msg.ts';

export class ModuleRegistry<Schema extends Record<string, unknown>> {
	public modules: { [name: string]: Module<Schema> };
	public msgs: { [type: string]: MsgConstructor<Schema> };
	public types: { [type: string]: AnyPossibleConstructor };

	constructor(...modules: Module<Schema>[]) {
		this.modules = {};
		this.msgs = {};
		this.types = {};
		for (const module of modules) {
			this.modules[module.constructor.name()] = module;

			for (const msg of module.msgs()) {
				this.msgs[`${module.constructor.name()}/${msg.type()}`] = msg;
			}

			for (const t of module.constructor.types()) {
				this.types[`${module.constructor.name()}/${t.type()}`] = t;
			}
		}
	}

	extractAny<T extends AnyPossible>(value: Any): T {
		const type = this.types[value.type];
		if (!type) {
			throw Error(`Unknown type: ${value.type}`);
		}
		return new type(value.value) as T;
	}

	packAny(value: AnyPossible): Any {
		return {
			type: value.constructor.type(),
			value: value.value
		};
	}
}
