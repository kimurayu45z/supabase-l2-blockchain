import type { Module } from '../../types/module.ts';
import { inspectorSequence } from './inspector-sequence.ts';
import { inspectorSignature } from './inspector-signature.ts';

export function newAuthModule(): Module {
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
