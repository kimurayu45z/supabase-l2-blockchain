import type { Asset } from '@supabase-l2-blockchain/types/core/index.d.ts';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import { burn } from './burn.ts';
import { mint } from './mint.ts';
import type { BankSchema } from './schema.ts';

export async function send(
	dbTx: PgTransaction<PgQueryResultHKT, BankSchema, ExtractTablesWithRelations<BankSchema>>,
	fromAddress: string,
	toAddress: string,
	assets: Asset[]
): Promise<void> {
	await burn(dbTx, fromAddress, assets);
	await mint(dbTx, toAddress, assets);
}
