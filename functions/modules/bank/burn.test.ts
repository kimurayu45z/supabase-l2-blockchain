import { assertEquals } from '@std/assert';

import { createMockDb } from '../../chain.test.ts';
import { burn } from './burn.ts';
import { balances } from './schema.ts';

Deno.test('mint', async () => {
	const db = await createMockDb({
		balances
	});

	await db.transaction(async (dbTx) => {
		await burn(dbTx, 'address', [{ id: 'asset_id', amount: BigInt(100) }]);
	});

	const balance = await db.query.balances.findFirst({
		where: (balance, { eq }) => eq(balance.address, 'address')
	});

	assertEquals(balance?.amount, '100');
});
