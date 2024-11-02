import type { PublicKey } from '@supabase-l2-blockchain/types/core';

export type AddressConverter = (publicKey: PublicKey) => string;
