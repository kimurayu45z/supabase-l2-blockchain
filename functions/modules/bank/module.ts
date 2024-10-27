import type { Module } from '../../types/module.ts';
import type { MsgConstructor } from '../../types/msg.ts';
import { MsgSend } from './send.ts';

export function newBankModule(): Module {
	return {
		name(): string {
			return 'bank';
		},
		msgs(): MsgConstructor[] {
			return [MsgSend];
		}
	};
}
