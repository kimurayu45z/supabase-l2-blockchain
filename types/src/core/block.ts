import * as crypto from 'crypto';

import { create, toBinary } from '@bufbuild/protobuf';
import { timestampFromDate } from '@bufbuild/protobuf/wkt';

import {
	Block,
	BlockBody,
	BlockBodySchema,
	BlockHeader,
	BlockHeaderSchema,
	BlockSchema,
	Txs
} from './block_pb';
import { PublicKey } from './public-key';

export function createBlockHeader(
	chainId: string,
	height: bigint,
	time: Date,
	lastBlockHash: Uint8Array,
	txsMerkleRoot: Uint8Array
): BlockHeader {
	return create(BlockHeaderSchema, {
		chainId: chainId,
		height: height,
		time: timestampFromDate(time),
		lastBlockHash: lastBlockHash,
		txsMerkleRoot: txsMerkleRoot
	});
}

export function getBlockSignMessage(blockHeader: BlockHeader): Uint8Array {
	return toBinary(BlockHeaderSchema, blockHeader);
}

export function getBlockHash(blockHeader: BlockHeader): Buffer {
	return crypto.createHash('sha256').update(toBinary(BlockHeaderSchema, blockHeader)).digest();
}

export function createBlockBody(
	txs: Txs,
	nextSigners: PublicKey[],
	signatures: Uint8Array[]
): BlockBody {
	return create(BlockBodySchema, {
		txs: txs,
		nextSigners: nextSigners.map((signer) => signer.toAny()),
		signatures: signatures
	});
}

export function createBlock(hash: Uint8Array, header: BlockHeader, body: BlockBody): Block {
	return create(BlockSchema, {
		hash: hash,
		header: header,
		body: body
	});
}
