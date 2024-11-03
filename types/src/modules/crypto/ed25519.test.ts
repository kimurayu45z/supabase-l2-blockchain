import assert from 'assert';
import * as crypto from 'node:crypto';

import { createRegistry, toJsonString } from '@bufbuild/protobuf';
import { AnySchema } from '@bufbuild/protobuf/wkt';

import { PrivateKeyEd25519, PublicKeyEd25519 } from './ed25519';
import { PublicKeyEd25519Schema } from './ed25519_pb';

test('ed25519', async () => {
	const privateKey = new PrivateKeyEd25519(crypto.randomBytes(32));
	console.log(Buffer.from(privateKey.value()).toString('hex'));
	const publicKey = new PublicKeyEd25519(await privateKey.publicKey());

	const protoAny = publicKey.toAny();
	const json = toJsonString(AnySchema, protoAny, {
		registry: createRegistry(PublicKeyEd25519Schema)
	});
	console.log(json);

	const recovered = PublicKeyEd25519.fromAny(protoAny);

	assert.deepEqual(recovered.value(), publicKey.value());
});
