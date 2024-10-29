import { BlockHeader } from './block';

export type SignBlockRequestBody = {
	block_header: BlockHeader;
	signatures: string[];
};
