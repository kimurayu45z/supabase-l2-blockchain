import * as crypto from 'crypto';

import { SupabaseClient } from '@supabase/supabase-js';
import { MerkleTree } from 'merkletreejs';

import { BlockHeader } from '../../types/block';
import { canonicalizeObjectForSerialization } from '../../types/json';
import { SignBlockRequestBody } from '../../types/sign-block';
import { Tx } from '../../types/tx';

export async function signBlock(
	supabase: SupabaseClient,
	chainId: string,
	lastHeight: bigint,
	lastBlockHash: string,
	txs: Tx[],
	sign: (msg: Buffer) => Buffer[]
) {
	const blockHeader = createBlockHeader(chainId, lastHeight, lastBlockHash, txs);
	const signBytes = getSignBytes(blockHeader);
	const signatures = sign(signBytes).map((signature) => signature.toString('hex'));

	return await supabase.functions.invoke('sign-block', {
		body: {
			block_header: blockHeader,
			signatures: signatures
		} as SignBlockRequestBody
	});
}

export function createBlockHeader(
	chainId: string,
	last_height: bigint,
	last_block_hash: string,
	txs: Tx[]
): BlockHeader {
	const merkleTree = new MerkleTree(
		txs.map((tx) => Buffer.from(JSON.stringify(canonicalizeObjectForSerialization(tx)))),
		(value: Buffer) => crypto.createHash('sha256').update(value).digest()
	);
	const txsRoot = merkleTree.getRoot();

	return {
		chain_id: chainId,
		height: last_height + BigInt(1),
		time: new Date(),
		last_block_hash: last_block_hash,
		txs_merkle_root: txsRoot.toString('hex')
	};
}

export function getSignBytes(blockHeader: BlockHeader): Buffer {
	const canonical = canonicalizeObjectForSerialization(blockHeader);
	const json = JSON.stringify(canonical);

	return Buffer.from(json);
}
