import { Any } from '@bufbuild/protobuf/wkt';

export interface PublicKey {
	value(): Uint8Array;
	verify(msg: Uint8Array, signature: Uint8Array): boolean;
	toAny(): Any;
}
