import type { MsgResponse, Tx, TxResponse } from '@supabase-l2-blockchain/types/core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Chain } from '../chain.ts';
import type { Msg } from '../types/msg.ts';

/**
 *
 * @param chain
 * @param dbTx
 * @param tx
 * @returns TxResponse
 * @throws Nothing
 */
export async function stateTransition<Schema extends Record<string, unknown>>(
	chain: Chain<Schema>,
	dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
	tx: Tx
): Promise<TxResponse> {
	try {
		for (const moduleName in chain.moduleRegistry.modules) {
			await chain.moduleRegistry.modules[moduleName].inspector(chain, dbTx, tx);
		}
	} catch (e) {
		return {
			success: false,
			inspection_error: (e as Error).message,
			msg_responses: []
		};
	}

	const msgResponses: MsgResponse[] = [];

	for (const msg of tx.body?.msgs || []) {
		try {
			const msgInstance = chain.moduleRegistry.extractAny<Msg<Schema>>(msg);
			const success = await msgInstance.stateTransitionFunction(dbTx);
			msgResponses.push({ success: success });
		} catch (e) {
			msgResponses.push({ error: (e as Error).message });

			return {
				success: false,
				msg_responses: msgResponses
			};
		}
	}

	return { success: true, msg_responses: msgResponses };
}
