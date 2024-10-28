import type { PublicKey } from '../../types/crypto/public-key.ts';

export type AddressConverter = (publicKey: PublicKey) => string;
