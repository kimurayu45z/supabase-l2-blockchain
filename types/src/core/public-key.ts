import { AnyPossible } from './any-possible';

export interface PublicKey extends AnyPossible {
	value(): Uint8Array;
	verify(msg: Uint8Array, signature: Uint8Array): boolean;
}
