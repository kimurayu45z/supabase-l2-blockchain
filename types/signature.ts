export type DefaultSignatureTypes = 'secp256k1' | 'ed25519';

export type Signature<SignatureTypes = DefaultSignatureTypes> = {
	type: SignatureTypes;
	data: string;
};
