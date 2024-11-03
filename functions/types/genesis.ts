import type { JsonValue } from '@bufbuild/protobuf';
import type { AnyJson } from '@bufbuild/protobuf/wkt';

export type GenesisState = {
	genesisHash: string;
	time: Date;
	signers: AnyJson[];
	modules: Record<string, JsonValue>;
};
