import { Buffer } from 'node:buffer';
import * as crypto from 'node:crypto';

import * as ed from '@noble/ed25519';

import { PublicKeyEd25519 } from './ed25519.ts';
import type { PublicKey } from './public-key.ts';

export function createKeyPairEd25519(seed: Buffer): [Buffer, PublicKey] {
	const privateKey = crypto.createHash('sha-256').update(seed).digest();

	const publicKeyBytes = ed.getPublicKey(privateKey);
	const publicKey = new PublicKeyEd25519(Buffer.from(publicKeyBytes).toString('hex'));

	return [privateKey, publicKey];
}

export function signEd25519(privateKey: Buffer, msg: Buffer): Buffer {
	return Buffer.from(ed.sign(msg, privateKey));
}
