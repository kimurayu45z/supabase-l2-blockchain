import type { AnyJson } from '@bufbuild/protobuf/wkt';

export type GenesisState = {
	genesis_hash: string;
	signers: AnyJson[];
	modules: Record<string, unknown>;
};
