import { Buffer } from 'node:buffer';

import * as ed from '@noble/ed25519';

import type { PublicKey } from './public-key.ts';

export class PublicKeyEd25519 implements PublicKey {
	['constructor'] = PublicKeyEd25519;
	private _value: Buffer;

	static type(): string {
		return 'PublicKeyEd25519';
	}

	constructor(public value: string) {
		this._value = Buffer.from(value, 'hex');
	}

	bytes(): Buffer {
		return this._value;
	}

	verify(msg: Uint8Array, sig: Uint8Array): boolean {
		return ed.verify(sig, msg, this._value);
	}
}
