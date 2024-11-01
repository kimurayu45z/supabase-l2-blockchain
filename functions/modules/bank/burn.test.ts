import { assertEquals } from '@std/assert';

import { createMockDb } from '../../chain.test.ts';
import { burn } from './burn.ts';
import { balances } from './schema.ts';

Deno.test(
	'burn',
	{
		sanitizeOps: false,
		sanitizeResources: false
	},
	async () => {
		const db = await createMockDb(
			{
				balances
			},
			`
		CREATE TABLE balances
		(
			address TEXT NOT NULL,
			asset_id TEXT NOT NULL,
			amount NUMERIC NOT NULL,
			PRIMARY KEY (address, asset_id)
		)
		`
		);

		await db.insert(balances).values({
			address: 'address',
			asset_id: 'asset_id',
			amount: '100'
		});

		await db.transaction(async (dbTx) => {
			await burn(dbTx, 'address', [{ id: 'asset_id', amount: BigInt(100) }]);
		});

		const balance = await db.query.balances.findFirst({
			where: (balance, { eq }) => eq(balance.address, 'address')
		});

		assertEquals(balance?.amount, '0');
	}
);
