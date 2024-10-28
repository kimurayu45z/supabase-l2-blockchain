import { Buffer } from 'node:buffer';

import * as ed from '@noble/ed25519';

import type { AnyPossible } from '../../../types/any.ts';

export class PublicKeyEd25519 implements AnyPossible {
	['constructor'] = PublicKeyEd25519;
	private _value: Buffer;

	static type() {
		return 'PublicKeyEd25519';
	}

	constructor(public value: string) {
		this._value = Buffer.from(value, 'hex');
	}

	verify(msg: Uint8Array, sig: Uint8Array) {
		return ed.verify(sig, msg, this._value);
	}
}
