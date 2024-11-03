import { create, DescMessage, fromBinary, toBinary } from '@bufbuild/protobuf';
import { Any, AnySchema } from '@bufbuild/protobuf/wkt';
import * as nacl from 'tweetnacl';

import { PrivateKey, PrivateKeyConstructor } from '../../core/private-key';
import { PublicKey, PublicKeyConstructor } from '../../core/public-key';
import { PrivateKeyEd25519Schema, PublicKeyEd25519Schema } from './ed25519_pb';

class PrivateKeyEd25519 implements PrivateKey {
	private _value: Uint8Array;
	constructor(value: Uint8Array) {
		this._value = value;
	}

	value(): Uint8Array {
		return this._value;
	}

	sign(msg: Uint8Array): Promise<Uint8Array> {
		const keypair = nacl.sign.keyPair.fromSeed(this._value);
		return Promise.resolve(nacl.sign(msg, keypair.secretKey));
	}

	publicKey(): Promise<Uint8Array> {
		const slicedKey = this._value.slice(0, 32);
		const keypair = nacl.sign.keyPair.fromSeed(slicedKey);

		return Promise.resolve(keypair.publicKey);
	}

	toAny(): Any {
		const value = create(PrivateKeyEd25519Schema, { value: this._value });
		return create(AnySchema, {
			typeUrl: value.$typeName,
			value: toBinary(PrivateKeyEd25519Schema, value)
		});
	}

	static desc(): DescMessage {
		return PrivateKeyEd25519Schema;
	}

	static fromAny(value: Any): PrivateKeyEd25519 {
		return new PrivateKeyEd25519(fromBinary(PrivateKeyEd25519Schema, value.value).value);
	}
}

const privateKeyEd25519: PrivateKeyConstructor<PrivateKeyEd25519> = PrivateKeyEd25519;
export { privateKeyEd25519 as PrivateKeyEd25519 };

class PublicKeyEd25519 implements PublicKey {
	private _value: Uint8Array;
	constructor(value: Uint8Array) {
		this._value = value;
	}

	value(): Uint8Array {
		return this._value;
	}

	verify(_msg: Uint8Array, sig: Uint8Array): Promise<boolean> {
		return Promise.resolve(nacl.sign.open(sig, this._value) !== null);
	}

	toAny(): Any {
		const value = create(PublicKeyEd25519Schema, { value: this._value });
		return create(AnySchema, {
			typeUrl: value.$typeName,
			value: toBinary(PublicKeyEd25519Schema, value)
		});
	}

	static desc(): DescMessage {
		return PublicKeyEd25519Schema;
	}

	static fromAny(value: Any): PublicKeyEd25519 {
		return new PublicKeyEd25519(fromBinary(PublicKeyEd25519Schema, value.value).value);
	}
}

const publicKeyEd25519: PublicKeyConstructor<PublicKeyEd25519> = PublicKeyEd25519;
export { publicKeyEd25519 as PublicKeyEd25519 };
