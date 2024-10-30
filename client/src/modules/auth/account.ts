import type { Account } from '@supabase-l2-blockchain/types/modules/auth';
import { SupabaseClient } from '@supabase/supabase-js';

const TABLE_ACCOUNTS = 'accounts';

export async function getAccount(
	supabase: SupabaseClient,
	address: string
): Promise<Account | null> {
	const res = await supabase
		.from(TABLE_ACCOUNTS)
		.select('*')
		.eq('address', address)
		.single<Account>();

	return res.data;
}
