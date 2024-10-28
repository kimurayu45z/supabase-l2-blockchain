import { PublicKeyEd25519 } from '../../types/crypto/ed25519.ts';
import { PublicKeySecp256k1 } from '../../types/crypto/secp256k1.ts';
import type { Module } from '../../types/module.ts';

export function newCryptoModule<Schema extends Record<string, unknown>>(): Module<Schema> {
	return {
		name() {
			return 'crypto';
		},
		inspectors() {
			return [];
		},
		msgs() {
			return [];
		},
		types() {
			return [PublicKeyEd25519, PublicKeySecp256k1];
		}
	};
}
