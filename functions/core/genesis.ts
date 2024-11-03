import type { JsonValue } from '@bufbuild/protobuf';
import type { AnyJson } from '@bufbuild/protobuf/wkt';
import type { PublicKey } from '@supabase-l2-blockchain/types/core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core/session';

import type { Chain } from '../chain.ts';
import type { GenesisState } from '../types/genesis.ts';
import { coreSchema, type CoreSchema } from './schema/mod.ts';

/**
 *
 * @param chain
 * @param state
 */
export async function importGenesis<Schema extends CoreSchema>(
	chain: Chain<Schema>,
	state: GenesisState
): Promise<void> {
	const signers = state.signers.map((signerAny) =>
		chain.moduleRegistry.extractAnyJson<PublicKey>(signerAny)
	);

	await chain.db.transaction(async (dbTx) => {
		for (const moduleName in chain.moduleRegistry.modules) {
			await chain.moduleRegistry.modules[moduleName].importGenesis(
				dbTx,
				state.modules[moduleName],
				chain.moduleRegistry.protobufRegistry
			);
		}

		await insertGenesisBlock(chain, dbTx, state.genesisHash, signers);
	});
}

/**
 *
 * @param chain
 * @returns
 */
export async function exportGenesis<Schema extends CoreSchema>(
	chain: Chain<Schema>
): Promise<GenesisState> {
	// Get last block info
	const lastBlockHeader = await (
		chain as unknown as Chain<CoreSchema>
	).db.query.block_headers.findFirst({
		where: (block, { eq }) => eq(block.chain_id, chain.id),
		orderBy: (block, { desc }) => [desc(block.height)]
	});
	if (!lastBlockHeader) {
		throw Error("Last block doesn't exist");
	}

	// Get last block body
	const lastBlockBody = await (
		chain as unknown as Chain<CoreSchema>
	).db.query.block_bodies.findFirst({
		where: (blockBody, { eq, and }) =>
			and(
				eq(blockBody.chain_id, lastBlockHeader.chain_id),
				eq(blockBody.height, lastBlockHeader.height)
			)
	});

	if (!lastBlockBody) {
		throw Error("Last block body doesn't exist");
	}

	const modules: Record<string, JsonValue> = {};

	for (const moduleName in chain.moduleRegistry.modules) {
		modules[moduleName] = await chain.moduleRegistry.modules[moduleName].exportGenesis(
			chain.db,
			chain.moduleRegistry.protobufRegistry
		);
	}

	const state: GenesisState = {
		genesisHash: lastBlockHeader.hash,
		time: new Date(),
		signers: lastBlockBody.next_signers,
		modules: modules
	};

	return state;
}

/**
 *
 * @param chain
 * @param signers
 * @param dbTx
 */
export async function insertGenesisBlock<Schema extends CoreSchema>(
	chain: Chain<Schema>,
	dbTx: PgTransaction<PgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>,
	genesisHash: string,
	signers: PublicKey[]
): Promise<void> {
	await dbTx.insert(coreSchema.block_bodies).values({
		chain_id: chain.id,
		height: 0,
		txs: {},
		next_signers: signers.map(
			(publicKey) => chain.moduleRegistry.toJson(publicKey.toAny()) as AnyJson
		),
		signatures: []
	});
	await dbTx.insert(coreSchema.block_headers).values({
		chain_id: chain.id,
		height: 0,
		time: new Date(),
		last_block_hash: '',
		txs_merkle_root: '',

		hash: genesisHash
	});
}
