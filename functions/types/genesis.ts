import type { Any } from '@supabase-l2-blockchain/types/core';

export type GenesisState = {
	genesis_hash: string;
	signers: Any[];
	modules: Record<string, unknown>;
};
