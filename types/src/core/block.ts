import { create, toBinary } from '@bufbuild/protobuf';
import { TimestampSchema } from '@bufbuild/protobuf/wkt';

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
		time: create(TimestampSchema, {
			seconds: BigInt(Math.floor(time.getTime() / 1000)),
			nanos: time.getMilliseconds() * 1000000
		}),
		lastBlockHash: lastBlockHash,
		txsMerkleRoot: txsMerkleRoot
	});
}

export function getBlockSignBytes(blockHeader: BlockHeader): Uint8Array {
	return toBinary(BlockHeaderSchema, blockHeader);
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
