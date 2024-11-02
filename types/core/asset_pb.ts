// @generated by protoc-gen-es v2.2.2 with parameter "target=ts"
// @generated from file core/asset.proto (package supabase_l2_blockchain.core.v1, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file core/asset.proto.
 */
export const file_core_asset: GenFile = /*@__PURE__*/
  fileDesc("ChBjb3JlL2Fzc2V0LnByb3RvEh5zdXBhYmFzZV9sMl9ibG9ja2NoYWluLmNvcmUudjEiIwoFQXNzZXQSCgoCaWQYASABKAkSDgoGYW1vdW50GAIgASgJYgZwcm90bzM");

/**
 * @generated from message supabase_l2_blockchain.core.v1.Asset
 */
export type Asset = Message<"supabase_l2_blockchain.core.v1.Asset"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;

  /**
   * @generated from field: string amount = 2;
   */
  amount: string;
};

/**
 * Describes the message supabase_l2_blockchain.core.v1.Asset.
 * Use `create(AssetSchema)` to create a new message.
 */
export const AssetSchema: GenMessage<Asset> = /*@__PURE__*/
  messageDesc(file_core_asset, 0);
