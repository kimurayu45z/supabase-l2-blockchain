import * as crypto from 'crypto';

import {
	create,
	DescMessage,
	MessageInitShape,
	Registry,
	toBinary,
	toJsonString
} from '@bufbuild/protobuf';
import { AnySchema, TimestampSchema } from '@bufbuild/protobuf/wkt';

import {
	AuthInfo,
	AuthInfoSchema,
	SignerInfoSchema,
	Tx,
	TxBody,
	TxBodySchema,
	TxSchema,
	TxSignDocSchema
} from './tx_pb.ts';

export function createTxBody<T extends DescMessage>(
	msgs: [T, MessageInitShape<T>][],
	memo: string,
	timeoutTimestamp: Date
): TxBody {
	return create(TxBodySchema, {
		msgs: msgs.map((msg) =>
			create(AnySchema, {
				typeUrl: msg[0].typeName,
				value: toBinary(msg[0], create(msg[0], msg[1]))
			})
		),
		memo,
		timeoutTimestamp: create(TimestampSchema, {
			seconds: BigInt(Math.floor(timeoutTimestamp.getTime() / 1000)),
			nanos: timeoutTimestamp.getMilliseconds() * 1000000
		})
	});
}

export function getTxSignBytes(
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

export function createAuthInfo<T extends DescMessage>(
	signerInfos: { publicKey: [T, MessageInitShape<T>]; sequence: bigint }[]
): AuthInfo {
	return create(AuthInfoSchema, {
		signerInfos: signerInfos.map((signerInfo) =>
			create(SignerInfoSchema, {
				publicKey: create(AnySchema, {
					typeUrl: signerInfo.publicKey[0].typeName,
					value: toBinary(
						signerInfo.publicKey[0],
						create(signerInfo.publicKey[0], signerInfo.publicKey[1])
					)
				}),
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
