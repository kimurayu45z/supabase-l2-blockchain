import { create, DescMessage, fromBinary, toBinary } from '@bufbuild/protobuf';
import { Any, AnySchema } from '@bufbuild/protobuf/wkt';
import * as ed from '@noble/ed25519';

import { AnyPossibleConstructor } from '../../core/any-possible';
import { PrivateKey } from '../../core/private-key';
import { PublicKey } from '../../core/public-key';
import { PrivateKeyEd25519Schema, PublicKeyEd25519Schema } from './ed25519_pb';

class privateKeyEd25519 implements PrivateKey {
	private _value: Uint8Array;
	constructor(value: Uint8Array) {
		this._value = value;
	}

	value(): Uint8Array {
		return this._value;
	}

	sign(msg: Uint8Array): Uint8Array {
		return ed.sign(msg, this._value);
	}

	publicKey(): Uint8Array {
		return ed.getPublicKey(this._value);
	}

	toAny(): Any {
		return create(AnySchema, {
			value: toBinary(
				PrivateKeyEd25519Schema,
				create(PrivateKeyEd25519Schema, { value: this._value })
			)
		});
	}

	static desc(): DescMessage {
		return PrivateKeyEd25519Schema;
	}

	static fromAny(value: Any): privateKeyEd25519 {
		return new privateKeyEd25519(fromBinary(PrivateKeyEd25519Schema, value.value).value);
	}
}

export const PrivateKeyEd25519: AnyPossibleConstructor<privateKeyEd25519> = privateKeyEd25519;

class publicKeyEd25519 implements PublicKey {
	private _value: Uint8Array;
	constructor(value: Uint8Array) {
		this._value = value;
	}

	value(): Uint8Array {
		return this._value;
	}

	verify(signature: Uint8Array, msg: Uint8Array): boolean {
		return ed.verify(signature, msg, this._value);
	}

	toAny(): Any {
		return create(AnySchema, {
			value: toBinary(
				PublicKeyEd25519Schema,
				create(PublicKeyEd25519Schema, { value: this._value })
			)
		});
	}

	static desc(): DescMessage {
		return PublicKeyEd25519Schema;
	}

	static fromAny(value: Any): publicKeyEd25519 {
		return new publicKeyEd25519(fromBinary(PublicKeyEd25519Schema, value.value).value);
	}
}

export const PublicKeyEd25519: AnyPossibleConstructor<publicKeyEd25519> = publicKeyEd25519;
