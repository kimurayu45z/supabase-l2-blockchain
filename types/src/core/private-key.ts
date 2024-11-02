import { Any } from '@bufbuild/protobuf/wkt';

export interface PrivateKey {
	value(): Uint8Array;
	sign(msg: Uint8Array): Uint8Array;
	publicKey(): Uint8Array;
	toAny(): Any;
}
