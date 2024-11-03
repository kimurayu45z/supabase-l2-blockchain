import assert from 'assert';
import * as crypto from 'crypto';
import { webcrypto } from 'crypto';

import { PrivateKeyEd25519, PublicKeyEd25519 } from './ed25519';

// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto;

test('ed25519', async () => {
	const privateKey = new PrivateKeyEd25519(crypto.randomBytes(32));
	console.log(Buffer.from(privateKey.value()).toString('hex'));
	const publicKey = new PublicKeyEd25519(await privateKey.publicKey());

	const protoAny = publicKey.toAny();

	const recovered = PublicKeyEd25519.fromAny(protoAny);

	assert.deepEqual(recovered.value(), publicKey.value());
});
