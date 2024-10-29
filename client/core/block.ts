import type { SupabaseClient } from '@supabase/supabase-js';

import { Block, BlockBody, BlockHeader } from '../../types/block';

const TABLE_BLOCK_HEADERS = 'block_headers';
const TABLE_BLOCK_BODIES = 'block_bodies';
const TABLE_BLOCKS = 'blocks';

export async function getBlockHeader(
	supabase: SupabaseClient,
	chainId: string,
	height: bigint | null
): Promise<BlockHeader> {
	const select = supabase.from(TABLE_BLOCK_HEADERS).select('*');
	if (!height) {
		const res = await select
			.eq('chain_id', chainId)
			.order('height', { ascending: false })
			.single<BlockHeader>();
		if (res.error) {
			throw res.error;
		}
		return res.data;
	}

	const res = await select.eq('chain_id', chainId).eq('height', height).single<BlockHeader>();
	if (res.error) {
		throw res.error;
	}
	return res.data;
}

export async function getBlock(
	supabase: SupabaseClient,
	chainId: string,
	height: bigint | null
): Promise<Block> {
	const select = supabase
		.from(TABLE_BLOCKS)
		.select(
			`
        hash,
        ${TABLE_BLOCK_HEADERS} (*),
        ${TABLE_BLOCK_BODIES} (*)
`
		)
		.eq('chain_id', chainId)
		.eq(`${TABLE_BLOCK_HEADERS}.chain_id`, chainId)
		.eq(`${TABLE_BLOCK_BODIES}.body_hash`, `${TABLE_BLOCKS}.body_hash`);

	const res = await (() => {
		if (!height) {
			return select
				.order('height', { ascending: false })
				.order(`${TABLE_BLOCK_HEADERS}.height`, { ascending: false })
				.single<{ hash: string } & BlockHeader & BlockBody>();
		}

		return select
			.eq('height', height)
			.eq(`${TABLE_BLOCK_HEADERS}.height`, height)
			.single<{ hash: string } & BlockHeader & BlockBody>();
	})().then((res) => ({
		...res,
		data: res.data
			? ({
					hash: res.data.hash,
					header: {
						chain_id: res.data.chain_id,
						height: res.data.height,
						time: res.data.time,
						last_block_hash: res.data.last_block_hash,
						txs_merkle_root: res.data.txs_merkle_root
					},
					body: {
						txs: res.data.txs,
						next_signers: res.data.next_signers,
						signatures: res.data.signatures
					}
				} as Block)
			: null
	}));

	if (res.error) {
		throw res.error;
	}

	return res.data!;
}
