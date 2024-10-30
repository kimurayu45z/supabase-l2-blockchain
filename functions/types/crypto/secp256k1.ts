import { Buffer } from 'node:buffer';

import * as secp from '@noble/secp256k1';

import type { PublicKey } from './public-key.ts';

export class PublicKeySecp256k1 implements PublicKey {
	['constructor'] = PublicKeySecp256k1;
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
		return secp.verify(sig, msg, this._value);
	}
}
