import { assertEquals } from '@std/assert';
import { createAsset } from '@supabase-l2-blockchain/types/core';

import { createMockDb } from '../../chain.test.ts';
import { mint } from './mint.ts';
import { bankSchema, createTableSqlBalances } from './schema.ts';

Deno.test(
	'mint',
	{
		sanitizeOps: false,
		sanitizeResources: false
	},
	async () => {
		const db = await createMockDb(
			{
				...bankSchema
			},
			createTableSqlBalances
		);

		await db.transaction(async (dbTx) => {
			await mint(dbTx, 'address', [createAsset('asset_id', 100n)]);
		});

		const balance = await db.query.balances.findFirst({
			where: (balance, { eq }) => eq(balance.address, 'address')
		});

		assertEquals(balance?.amount, '100');
	}
);
