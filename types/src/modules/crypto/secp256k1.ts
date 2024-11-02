import { create, DescMessage, fromBinary, toBinary } from '@bufbuild/protobuf';
import { Any, AnySchema } from '@bufbuild/protobuf/wkt';
import * as secp from '@noble/secp256k1';

import { AnyPossibleConstructor } from '../../core/any-possible';
import { PrivateKey } from '../../core/private-key';
import { PublicKey } from '../../core/public-key';
import { PrivateKeySecp256k1Schema, PublicKeySecp256k1Schema } from './secp256k1_pb';

class privateKeySecp256k1 implements PrivateKey {
	private _value: Uint8Array;
	constructor(value: Uint8Array) {
		this._value = value;
	}

	value(): Uint8Array {
		return this._value;
	}

	sign(msg: Uint8Array): Uint8Array {
		return secp.sign(msg, this._value).toCompactRawBytes();
	}

	publicKey(): Uint8Array {
		return secp.getPublicKey(this._value);
	}

	toAny(): Any {
		return create(AnySchema, {
			value: toBinary(
				PrivateKeySecp256k1Schema,
				create(PrivateKeySecp256k1Schema, { value: this._value })
			)
		});
	}

	static desc(): DescMessage {
		return PrivateKeySecp256k1Schema;
	}

	static fromAny(value: Any): privateKeySecp256k1 {
		return new PrivateKeySecp256k1(fromBinary(PrivateKeySecp256k1Schema, value.value).value);
	}
}

export const PrivateKeySecp256k1: AnyPossibleConstructor<privateKeySecp256k1> = privateKeySecp256k1;

class publicKeySecp256k1 implements PublicKey {
	private _value: Uint8Array;
	constructor(value: Uint8Array) {
		this._value = value;
	}

	value(): Uint8Array {
		return this._value;
	}

	verify(signature: Uint8Array, msg: Uint8Array): boolean {
		return secp.verify(signature, msg, this._value);
	}

	toAny(): Any {
		return create(AnySchema, {
			value: toBinary(
				PublicKeySecp256k1Schema,
				create(PublicKeySecp256k1Schema, { value: this._value })
			)
		});
	}

	static desc(): DescMessage {
		return PublicKeySecp256k1Schema;
	}

	static fromAny(value: Any): publicKeySecp256k1 {
		return new PublicKeySecp256k1(fromBinary(PublicKeySecp256k1Schema, value.value).value);
	}
}

export const PublicKeySecp256k1: AnyPossibleConstructor<publicKeySecp256k1> = publicKeySecp256k1;
