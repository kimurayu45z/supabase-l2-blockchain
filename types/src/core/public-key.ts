import { AnyPossible, AnyPossibleConstructor } from './any-possible';

export interface PublicKey extends AnyPossible {
	value(): Uint8Array;
	verify(msg: Uint8Array, sig: Uint8Array): Promise<boolean>;
}

export interface PublicKeyConstructor<T extends PublicKey> extends AnyPossibleConstructor<T> {
	new (value: Uint8Array): T;
}
