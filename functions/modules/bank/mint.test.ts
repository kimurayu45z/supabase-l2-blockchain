import { assertEquals } from '@std/assert';

import { createMockDb } from '../../chain.test.ts';
import { mint } from './mint.ts';
import { balances } from './schema.ts';

Deno.test('mint', async () => {
	const db = await createMockDb({
		balances
	});

	await db.transaction(async (dbTx) => {
		await mint(dbTx, 'address', [{ id: 'asset_id', amount: BigInt(100) }]);
	});

	const balance = await db.query.balances.findFirst({
		where: (balance, { eq }) => eq(balance.address, 'address')
	});

	assertEquals(balance?.amount, '100');
});
