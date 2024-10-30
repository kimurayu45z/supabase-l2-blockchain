import type { Any } from './any.d.ts';

export type Tx = {
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
