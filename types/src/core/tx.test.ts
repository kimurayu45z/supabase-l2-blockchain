import { createRegistry, toJsonString } from '@bufbuild/protobuf';

import { createAuthInfo, createTx, createTxBody, getTxSignMessage } from './tx';
import { TxBody, TxSchema } from './tx_pb';

test('getTxSignMessage', () => {
	const txBody: TxBody = createTxBody([], '', new Date());
	const registry = createRegistry();
	const signMessage = getTxSignMessage(txBody, 'chainId', BigInt(1), registry);

	console.log(signMessage.toString());
});

test('createTx', () => {
	const tx = createTx(createTxBody([], '', new Date()), createAuthInfo([]), []);

	console.log(toJsonString(TxSchema, tx));
});
