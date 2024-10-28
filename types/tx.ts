import type { Any } from './any.ts';
import { canonicalizeObjectForSerialization } from './json.ts';

export type Tx = {
	hash: string;
	body: TxBody;
	auth_info: AuthInfo;
	signatures: string[];
};

export type TxBody = {
	msgs: Any[];
	memo: string;
	timeout_timestamp: Date;
};

export type AuthInfo = {
	signer_infos: SignerInfo[];
};

export type SignerInfo = {
	public_key: Any;
	sequence: number;
};

export type TxSignDoc = {
	body: TxBody;
	chain_id: string;
	sequence: number;
};

export function getSignBytes(txBody: TxBody, chainId: string, sequence: number): Buffer {
	const signDoc: TxSignDoc = {
		body: txBody,
		chain_id: chainId,
		sequence: sequence
	};
	const canonical = canonicalizeObjectForSerialization(signDoc);
	const json = JSON.stringify(canonical);

	return Buffer.from(json);
}
