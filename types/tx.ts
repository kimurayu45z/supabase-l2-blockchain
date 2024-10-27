import { canonicalizeObjectForSerialization } from './json';
import type { MsgUnion } from './msg';
import type { DefaultSignatureTypes, Signature } from './signature';

export type Tx<SignatureType = DefaultSignatureTypes> = {
	hash: string;
	body: TxBody;
	signatures: Signature<SignatureType>[];
};

export type TxBody = {
	msg: MsgUnion;
	memo: string;
	timeout_timestamp: Date;
};

export type TxSignDoc = {
	body: TxBody;
	chain_id: string;
	sequence: bigint;
};

export function getSignBytes(txBody: TxBody, chainId: string, sequence: bigint): Buffer {
	const signDoc: TxSignDoc = {
		body: txBody,
		chain_id: chainId,
		sequence: sequence
	};
	const canonical = canonicalizeObjectForSerialization(signDoc);
	const json = JSON.stringify(canonical);

	return Buffer.from(json);
}
