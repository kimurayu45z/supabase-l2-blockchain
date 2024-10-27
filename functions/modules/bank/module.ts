import type { Module } from '../../types/module.ts';
import { MsgSend } from './msg-send.ts';

export function newBankModule(): Module {
	return {
		name() {
			return 'bank';
		},
		inspectors() {
			return [];
		},
		msgs() {
			return [MsgSend];
		}
	};
}
