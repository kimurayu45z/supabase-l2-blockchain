import { AnyPossible } from './any-possible';

export interface PrivateKey extends AnyPossible {
	value(): Uint8Array;
	sign(msg: Uint8Array): Uint8Array;
	publicKey(): Uint8Array;
}
