import { toBinary } from '@bufbuild/protobuf';

import { BlockHeader, BlockHeaderSchema } from './block_pb';

export function getBlockSignBytes(blockHeader: BlockHeader): Uint8Array {
	return toBinary(BlockHeaderSchema, blockHeader);
}
