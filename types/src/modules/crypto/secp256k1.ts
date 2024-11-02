import { create, DescMessage, fromBinary, toBinary } from '@bufbuild/protobuf';
import { Any, AnySchema } from '@bufbuild/protobuf/wkt';
import * as secp from '@noble/secp256k1';

import { AnyPossibleConstructor } from '../../core/any-possible';
import { PrivateKey } from '../../core/private-key';
import { PublicKey } from '../../core/public-key';
import { PrivateKeySecp256k1Schema, PublicKeySecp256k1Schema } from './secp256k1_pb';

class PrivateKeySecp256k1 implements PrivateKey {
	private _value: Uint8Array;
	constructor(value: Uint8Array) {
		this._value = value;
	}

	value(): Uint8Array {
		return this._value;
	}

	async sign(msg: Uint8Array): Promise<Uint8Array> {
		const sig = await secp.signAsync(msg, this._value);

		return sig.toCompactRawBytes();
	}

	publicKey(): Promise<Uint8Array> {
		return Promise.resolve(secp.getPublicKey(this._value));
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

	static fromAny(value: Any): PrivateKeySecp256k1 {
		return new PrivateKeySecp256k1(fromBinary(PrivateKeySecp256k1Schema, value.value).value);
	}
}

const privateKeySecp256k1: AnyPossibleConstructor<PrivateKeySecp256k1> = PrivateKeySecp256k1;
export { privateKeySecp256k1 as PrivateKeySecp256k1 };

class PublicKeySecp256k1 implements PublicKey {
	private _value: Uint8Array;
	constructor(value: Uint8Array) {
		this._value = value;
	}

	value(): Uint8Array {
		return this._value;
	}

	verify(signature: Uint8Array, msg: Uint8Array): Promise<boolean> {
		return Promise.resolve(secp.verify(signature, msg, this._value));
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

	static fromAny(value: Any): PublicKeySecp256k1 {
		return new PublicKeySecp256k1(fromBinary(PublicKeySecp256k1Schema, value.value).value);
	}
}

const publicKeySecp256k1: AnyPossibleConstructor<PublicKeySecp256k1> = PublicKeySecp256k1;
export { publicKeySecp256k1 as PublicKeySecp256k1 };
