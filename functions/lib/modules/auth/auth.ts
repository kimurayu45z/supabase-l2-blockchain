import type { Module } from '../../types/module.ts';
import { inspectorSequence } from './inspector-sequence.ts';
import { inspectorSignature } from './inspector-signature.ts';
import type { AuthSchema } from './schema.ts';

export function newAuthModule<Schema extends AuthSchema>(): Module<Schema> {
	return {
		name() {
			return 'auth';
		},
		inspectors() {
			return [inspectorSequence, inspectorSignature];
		},
		msgs() {
			return [];
		}
	};
}
