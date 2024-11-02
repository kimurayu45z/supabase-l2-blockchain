import { createRegistry, toJsonString } from '@bufbuild/protobuf';

import { MsgSendSchema } from '../modules/bank/msgs_pb';
import { createAuthInfo, createTx, createTxBody, getTxSignBytes } from './tx';
import { TxBody, TxSchema } from './tx_pb';

test('getTxSignBytes', () => {
	const txBody: TxBody = createTxBody(
		[
			[MsgSendSchema, { fromAddress: 'from', toAddress: 'to', assets: [{ id: 'id', amount: '1' }] }]
		],
		'',
		new Date()
	);
	const registry = createRegistry(MsgSendSchema);
	const signBytes = getTxSignBytes(txBody, 'chainId', BigInt(1), registry);

	console.log(signBytes.toString());
});

test('createTx', () => {
	const tx = createTx(createTxBody([], '', new Date()), createAuthInfo([]), []);

	console.log(toJsonString(TxSchema, tx));
});
