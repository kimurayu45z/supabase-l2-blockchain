import { AnyPossible } from './any-possible';

export interface PrivateKey extends AnyPossible {
	value(): Uint8Array;
	sign(msg: Uint8Array): Promise<Uint8Array>;
	publicKey(): Promise<Uint8Array>;
}
