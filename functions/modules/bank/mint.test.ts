import { create } from '@bufbuild/protobuf';
import { assertEquals } from '@std/assert';
import { AssetSchema } from '@supabase-l2-blockchain/types/core';

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
			await mint(dbTx, 'address', [create(AssetSchema, { id: 'asset_id', amount: '100' })]);
		});

		const balance = await db.query.balances.findFirst({
			where: (balance, { eq }) => eq(balance.address, 'address')
		});

		assertEquals(balance?.amount, '100');
	}
);
