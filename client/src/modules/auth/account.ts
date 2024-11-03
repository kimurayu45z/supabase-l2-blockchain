import { create } from '@bufbuild/protobuf';
import { Account, AccountSchema } from '@supabase-l2-blockchain/types/modules/auth';
import { SupabaseClient } from '@supabase/supabase-js';

const TABLE_ACCOUNTS = 'accounts';

type DbAccount = {
	address: string;
	sequence: number;
};

export async function getAccount(
	supabase: SupabaseClient,
	address: string
): Promise<Account | null> {
	const res = await supabase
		.from(TABLE_ACCOUNTS)
		.select('*')
		.eq('address', address)
		.single<DbAccount>();

	if (res.error) {
		throw res.error;
	}
	if (!res.data) {
		return null;
	}

	return create(AccountSchema, {
		address: res.data.address,
		sequence: BigInt(res.data.sequence)
	});
}
