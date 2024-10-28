import type { Module } from '../../types/module.ts';
import { MsgSend } from './msg-send.ts';
import type { BankSchema } from './schema.ts';

export function newBankModule<Schema extends BankSchema>(): Module<Schema> {
	return {
		name() {
			return 'bank';
		},
		inspectors() {
			return [];
		},
		msgs() {
			return [MsgSend];
		},
		types() {
			return [];
		}
	};
}
