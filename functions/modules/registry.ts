import type { Module } from '../types/module.ts';
import type { MsgConstructor } from '../types/msg.ts';

export type MsgRegistry = { [type: string]: MsgConstructor };

export function registerModules(msgRegistry: MsgRegistry, ...modules: Module[]) {
	for (const module of modules) {
		for (const msg of module.msgs()) {
			msgRegistry[msg.type()] = msg;
		}
	}
}
