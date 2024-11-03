import { fromJson, JsonValue, Registry } from '@bufbuild/protobuf';
import { AnyJson } from '@bufbuild/protobuf/wkt';
import {
	BlockBodySchema,
	BlockHeaderSchema,
	createBlock,
	createBlockHeader,
	type Block,
	type BlockHeader
} from '@supabase-l2-blockchain/types/core';
import type { SupabaseClient } from '@supabase/supabase-js/dist/module/index.js';

const TABLE_BLOCK_HEADERS = 'block_headers';
const TABLE_BLOCK_BODIES = 'block_bodies';

type DbBlockHeader = {
	chain_id: string;
	height: number;
	time: Date;
	last_block_hash: string;
	txs_merkle_root: string;
};

type DbBlockBody = {
	block_hash: string;
	txs: JsonValue;
	next_signers: AnyJson[];
	signatures: string[];
};

type DbBlock = {
	hash: string;
	chain_id: string;
	height: number;
};

export async function getBlockHeader(
	supabase: SupabaseClient,
	chainId: string,
	height: bigint | null,
	protobufRegistry: Registry
): Promise<BlockHeader> {
	const select = supabase.from(TABLE_BLOCK_HEADERS).select('*');
	let data: DbBlockHeader;
	if (!height) {
		const res = await select
			.eq('chain_id', chainId)
			.order('height', { ascending: false })
			.single<DbBlockHeader>();
		if (res.error) {
			throw res.error;
		}
		data = res.data;
	}

	const res = await select.eq('chain_id', chainId).eq('height', height).single<DbBlockHeader>();
	if (res.error) {
		throw res.error;
	}
	data = res.data;

	return fromJson(
		BlockHeaderSchema,
		{
			chainId: data.chain_id,
			height: data.height,
			time: JSON.stringify(data.time),
			lastBlockHash: data.last_block_hash,
			txsMerkleRoot: data.txs_merkle_root
		},
		{ registry: protobufRegistry }
	);
}

export async function getBlock(
	supabase: SupabaseClient,
	chainId: string,
	height: number | null,
	protobufRegistry: Registry
): Promise<Block> {
	const select = supabase
		.from(TABLE_BLOCK_HEADERS)
		.select(
			`
*,
${TABLE_BLOCK_BODIES} (*)
`
		)
		.eq('chain_id', chainId)
		.eq(`${TABLE_BLOCK_BODIES}.chain_id`, chainId);

	const res = await (() => {
		if (!height) {
			return select
				.order('height', { ascending: false })
				.order(`${TABLE_BLOCK_BODIES}.height`, { ascending: false })
				.single<DbBlock & DbBlockHeader & DbBlockBody>();
		}

		return select
			.eq('height', height)
			.eq(`${TABLE_BLOCK_BODIES}.height`, height)
			.single<DbBlock & DbBlockHeader & DbBlockBody>();
	})();

	if (res.error) {
		throw res.error;
	}
	const data = res.data;

	return createBlock(
		Buffer.from(data.hash, 'base64'),
		fromJson(
			BlockHeaderSchema,
			{
				chainId: data.chain_id,
				height: data.height,
				time: JSON.stringify(data.time),
				lastBlockHash: data.last_block_hash,
				txsMerkleRoot: data.txs_merkle_root
			},
			{ registry: protobufRegistry }
		),
		fromJson(
			BlockBodySchema,
			{
				txs: data.txs,
				nextSigners: data.next_signers,
				signatures: data.signatures
			},
			{ registry: protobufRegistry }
		)
	);
}
