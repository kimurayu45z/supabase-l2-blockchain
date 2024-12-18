import { assertEquals } from '@std/assert';
import { createAsset } from '@supabase-l2-blockchain/types/core';

import { createMockDb } from '../../chain.test.ts';
import { burn } from './burn.ts';
import { bankSchema, createTableSqlBalances } from './schema.ts';

Deno.test(
	'burn',
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

		await db.insert(bankSchema.balances).values({
			address: 'address',
			asset_id: 'asset_id',
			amount: '100'
		});

		await db.transaction(async (dbTx) => {
			await burn(dbTx, 'address', [createAsset('asset_id', 100n)]);
		});

		const balance = await db.query.balances.findFirst({
			where: (balance, { eq }) => eq(balance.address, 'address')
		});

		assertEquals(balance?.amount, '0');
	}
);
