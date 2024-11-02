import { create } from '@bufbuild/protobuf';

import { Asset, AssetSchema } from './asset_pb';

export function createAsset(id: string, amount: bigint): Asset {
	return create(AssetSchema, {
		id: id,
		amount: amount.toString()
	});
}
