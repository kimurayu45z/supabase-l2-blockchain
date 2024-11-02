import { createRegistry, fromJson, type Registry } from '@bufbuild/protobuf';
import { AnySchema, type Any, type AnyJson } from '@bufbuild/protobuf/wkt';
import type { AnyPossible, AnyPossibleConstructor } from '@supabase-l2-blockchain/types/core';

import type { Module } from './types/module.ts';

export class ModuleRegistry<Schema extends Record<string, unknown>> {
	public modules: { [name: string]: Module<Schema> };
	public types: { [type: string]: AnyPossibleConstructor };
	public protobufRegistry: Registry;

	constructor(...modules: Module<Schema>[]) {
		this.modules = {};
		this.types = {};

		for (const module of modules) {
			this.modules[module.constructor.name()] = module;

			for (const type of module.constructor.types()) {
				this.types[type.desc().typeName] = type;
			}
		}

		this.protobufRegistry = createRegistry(
			...modules.flatMap((module) => module.constructor.types().map((type) => type.desc()))
		);
	}

	extractAny<T extends AnyPossible>(value: Any): T {
		const type = this.types[value.typeUrl];
		if (!type) {
			throw Error(`Unknown type: ${value.typeUrl}`);
		}
		return type.fromAny(value) as T;
	}

	extractAnyJson<T extends AnyPossible>(value: AnyJson): T {
		const protoAny = fromJson(AnySchema, value);
		return this.extractAny<T>(protoAny);
	}
}
