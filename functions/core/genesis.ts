import { Buffer } from 'node:buffer';

import { type AnyJson } from '@bufbuild/protobuf/wkt';
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
	const hash = Buffer.from(state.genesis_hash, 'hex');
	const signers = state.signers.map((signerAny) =>
		chain.moduleRegistry.extractAnyJson<PublicKey>(signerAny)
	);

	await chain.db.transaction(async (dbTx) => {
		for (const moduleName in chain.moduleRegistry.modules) {
			await chain.moduleRegistry.modules[moduleName].importGenesis(dbTx, state.modules[moduleName]);
		}

		await insertGenesisBlock(chain, dbTx, hash, signers);
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
	const lastBlock = await (chain as unknown as Chain<CoreSchema>).db.query.blocks.findFirst({
		where: (block, { eq }) => eq(block.chain_id, chain.id),
		orderBy: (block, { desc }) => [desc(block.height)]
	});
	if (!lastBlock) {
		throw Error("Last block doesn't exist");
	}

	// Get last block body
	const lastBlockBody = await (
		chain as unknown as Chain<CoreSchema>
	).db.query.block_bodies.findFirst({
		where: (blockBody, { eq }) => eq(blockBody.block_hash, lastBlock.hash)
	});

	if (!lastBlockBody) {
		throw Error("Last block body doesn't exist");
	}

	const modules: Record<string, unknown> = {};

	for (const moduleName in chain.moduleRegistry.modules) {
		modules[moduleName] = await chain.moduleRegistry.modules[moduleName].exportGenesis(chain.db);
	}

	const state: GenesisState = {
		genesis_hash: lastBlock.hash,
		signers: lastBlockBody.next_signers as AnyJson[],
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
	genesisHash: Buffer,
	signers: PublicKey[]
): Promise<void> {
	const hash = genesisHash.toString('hex');

	await dbTx.insert(coreSchema.block_headers).values({
		chain_id: chain.id,
		height: 0,
		time: new Date(),
		last_block_hash: '',
		txs_merkle_root: ''
	});
	await dbTx.insert(coreSchema.block_bodies).values({
		block_hash: hash,
		txs: [],
		next_signers: signers.map((publicKey) => chain.moduleRegistry.toJson(publicKey.toAny())),
		signatures: []
	});
	await dbTx.insert(coreSchema.blocks).values({
		hash: hash,
		chain_id: chain.id,
		height: 0
	});
}
