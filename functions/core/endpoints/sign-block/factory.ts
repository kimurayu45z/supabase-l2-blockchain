import type { PublicKey } from '@supabase-l2-blockchain/types/core';

import type { Chain } from '../../../chain.ts';
import type { CoreSchema } from '../../schema/mod.ts';
import { signBlock } from './sign-block.ts';

export function signBlockFactory(
	chain: Chain<CoreSchema>,
	signHandler: (signer: PublicKey, signMessage: Uint8Array) => Promise<Uint8Array>,
	postBlockHandler: (blockBinary: Uint8Array) => Promise<void>
): Deno.ServeHandler {
	return async (_req: Request) => {
		await signBlock(chain, signHandler, postBlockHandler);

		return new Response(null, { status: 200 });
	};
}
