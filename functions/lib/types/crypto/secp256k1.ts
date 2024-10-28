import { Buffer } from 'node:buffer';

import * as secp from '@noble/secp256k1';

import type { AnyPossible } from '../../../../types/any.ts';

export class PublicKeySecp256k1 implements AnyPossible {
	['constructor'] = PublicKeySecp256k1;
	private _value: Buffer;

	static type() {
		return 'PublicKeyEd25519';
	}

	constructor(public value: string) {
		this._value = Buffer.from(value, 'hex');
	}

	verify(msg: Uint8Array, sig: Uint8Array) {
		return secp.verify(sig, msg, this._value);
	}
}
