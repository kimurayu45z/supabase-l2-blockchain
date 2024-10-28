import type { AnyPossible } from '../../../types/any.ts';

export interface PublicKey extends AnyPossible {
	verify(msg: Uint8Array, sig: Uint8Array): boolean;
}
