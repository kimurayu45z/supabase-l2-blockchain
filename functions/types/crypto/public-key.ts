import type { Buffer } from 'node:buffer';

import type { AnyPossible } from '@supabase-l2-blockchain/types/core/index.d.ts';

export interface PublicKey extends AnyPossible {
	bytes(): Buffer;
	verify(msg: Uint8Array, sig: Uint8Array): boolean;
}
