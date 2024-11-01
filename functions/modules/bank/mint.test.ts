import { assertEquals } from '@std/assert';

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
			await mint(dbTx, 'address', [{ id: 'asset_id', amount: BigInt(100) }]);
		});

		const balance = await db.query.balances.findFirst({
			where: (balance, { eq }) => eq(balance.address, 'address')
		});

		assertEquals(balance?.amount, '100');
	}
);
