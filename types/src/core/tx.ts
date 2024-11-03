import * as crypto from 'crypto';

import { create, Registry, toBinary, toJsonString } from '@bufbuild/protobuf';
import { TimestampSchema } from '@bufbuild/protobuf/wkt';

import { AnyPossible } from './any-possible';
import { PublicKey } from './public-key';
import {
	AuthInfo,
	AuthInfoSchema,
	SignerInfoSchema,
	Tx,
	TxBody,
	TxBodySchema,
	TxSchema,
	TxSignDocSchema
} from './tx_pb';

export type MsgResponse =
	| {
			success: unknown;
	  }
	| {
			error: string;
	  };

export type TxResponse = {
	success: boolean;
	inspection_error?: string;
	msg_responses: MsgResponse[];
};

export function createTxBody(msgs: AnyPossible[], memo: string, timeoutTimestamp: Date): TxBody {
	return create(TxBodySchema, {
		msgs: msgs.map((msg) => msg.toAny()),
		memo,
		timeoutTimestamp: create(TimestampSchema, {
			seconds: BigInt(Math.floor(timeoutTimestamp.getTime() / 1000)),
			nanos: timeoutTimestamp.getMilliseconds() * 1000000
		})
	});
}

export function getTxSignMessage(
	txBody: TxBody,
	chainId: string,
	sequence: bigint,
	registry: Registry
): Buffer {
	const json = toJsonString(
		TxSignDocSchema,
		create(TxSignDocSchema, {
			body: txBody,
			chainId,
			sequence
		}),
		{ registry }
	);

	return Buffer.from(json);
}

export function createAuthInfo(
	signerInfos: { publicKey: PublicKey; sequence: bigint }[]
): AuthInfo {
	return create(AuthInfoSchema, {
		signerInfos: signerInfos.map((signerInfo) =>
			create(SignerInfoSchema, {
				publicKey: signerInfo.publicKey.toAny(),
				sequence: signerInfo.sequence
			})
		)
	});
}

export function createTx(txBody: TxBody, authInfo: AuthInfo, signatures: Uint8Array[]): Tx {
	return create(TxSchema, {
		body: txBody,
		authInfo: authInfo,
		signatures: signatures
	});
}

export function getTxHash(tx: Tx): Buffer {
	const bytes = toBinary(TxSchema, tx);
	const hash = crypto.createHash('sha256').update(bytes).digest();

	return hash;
}
