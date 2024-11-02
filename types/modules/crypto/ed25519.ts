import { create, toBinary } from '@bufbuild/protobuf';
import { Any, AnySchema } from '@bufbuild/protobuf/wkt';
import * as ed from '@noble/ed25519';

import { PrivateKey } from '../../core/private-key.ts';
import { PublicKey } from '../../core/public-key';
import { PrivateKeyEd25519Schema, PublicKeyEd25519Schema } from './ed25519_pb.ts';

export class PrivateKeyEd25519 implements PrivateKey {
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
}

export class PublicKeyEd25519 implements PublicKey {
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
}
