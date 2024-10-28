export interface PublicKey {
	verify(msg: Uint8Array, sig: Uint8Array): boolean;
}
