import * as crypto from 'crypto';

import { create, DescMessage, fromBinary, toBinary } from '@bufbuild/protobuf';
import { Any, AnySchema } from '@bufbuild/protobuf/wkt';
import * as secp256k1 from 'secp256k1';

import { PrivateKey, PrivateKeyConstructor } from '../../core/private-key';
import { PublicKey, PublicKeyConstructor } from '../../core/public-key';
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
		const hash = crypto.createHash('sha256').update(msg).digest();
		const sig = secp256k1.ecdsaSign(hash, this._value).signature;

		return Promise.resolve(sig);
	}

	publicKey(): Promise<Uint8Array> {
		return Promise.resolve(secp256k1.publicKeyCreate(this._value));
	}

	toAny(): Any {
		const value = create(PrivateKeySecp256k1Schema, { value: this._value });
		return create(AnySchema, {
			typeUrl: value.$typeName,
			value: toBinary(PrivateKeySecp256k1Schema, value)
		});
	}

	static desc(): DescMessage {
		return PrivateKeySecp256k1Schema;
	}

	static fromAny(value: Any): PrivateKeySecp256k1 {
		return new PrivateKeySecp256k1(fromBinary(PrivateKeySecp256k1Schema, value.value).value);
	}
}

const privateKeySecp256k1: PrivateKeyConstructor<PrivateKeySecp256k1> = PrivateKeySecp256k1;
export { privateKeySecp256k1 as PrivateKeySecp256k1 };

class PublicKeySecp256k1 implements PublicKey {
	private _value: Uint8Array;
	constructor(value: Uint8Array) {
		this._value = value;
	}

	value(): Uint8Array {
		return this._value;
	}

	verify(msg: Uint8Array, sig: Uint8Array): Promise<boolean> {
		const hash = crypto.createHash('sha256').update(msg).digest();

		return Promise.resolve(secp256k1.ecdsaVerify(sig, new Uint8Array(hash), this._value));
	}

	toAny(): Any {
		const value = create(PublicKeySecp256k1Schema, { value: this._value });
		return create(AnySchema, {
			typeUrl: value.$typeName,
			value: toBinary(PublicKeySecp256k1Schema, value)
		});
	}

	static desc(): DescMessage {
		return PublicKeySecp256k1Schema;
	}

	static fromAny(value: Any): PublicKeySecp256k1 {
		return new PublicKeySecp256k1(fromBinary(PublicKeySecp256k1Schema, value.value).value);
	}
}

const publicKeySecp256k1: PublicKeyConstructor<PublicKeySecp256k1> = PublicKeySecp256k1;
export { publicKeySecp256k1 as PublicKeySecp256k1 };
