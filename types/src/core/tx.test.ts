import { createRegistry, toJsonString } from '@bufbuild/protobuf';

import { createAuthInfo, createTx, createTxBody, getTxSignBytes } from './tx';
import { TxBody, TxSchema } from './tx_pb';

test('getTxSignBytes', () => {
	const txBody: TxBody = createTxBody([], '', new Date());
	const registry = createRegistry();
	const signBytes = getTxSignBytes(txBody, 'chainId', BigInt(1), registry);

	console.log(signBytes.toString());
});

test('createTx', () => {
	const tx = createTx(createTxBody([], '', new Date()), createAuthInfo([]), []);

	console.log(toJsonString(TxSchema, tx));
});
