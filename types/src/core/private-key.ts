import { AnyPossible, AnyPossibleConstructor } from './any-possible';

export interface PrivateKey extends AnyPossible {
	value(): Uint8Array;
	sign(msg: Uint8Array): Promise<Uint8Array>;
	publicKey(): Promise<Uint8Array>;
}

export interface PrivateKeyConstructor<T extends PrivateKey> extends AnyPossibleConstructor<T> {
	new (value: Uint8Array): T;
}
