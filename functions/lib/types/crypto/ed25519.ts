import { Buffer } from 'node:buffer';

import * as ed from '@noble/ed25519';

export class PublicKeyEd25519 {
	value: Buffer;

	static type() {
		return 'crypto/PublicKeyEd25519';
	}

	constructor(value: string) {
		this.value = Buffer.from(value, 'hex');
	}

	verify(msg: Uint8Array, sig: Uint8Array) {
		return ed.verify(sig, msg, this.value);
	}
}
