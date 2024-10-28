import { Buffer } from 'node:buffer';

import * as secp from '@noble/secp256k1';

export class PublicKeySecp256k1 {
	value: Buffer;

	static type() {
		return 'crypto/PublicKeyEd25519';
	}

	constructor(value: string) {
		this.value = Buffer.from(value, 'hex');
	}

	verify(msg: Uint8Array, sig: Uint8Array) {
		return secp.verify(sig, msg, this.value);
	}
}
