// @generated by protoc-gen-es v2.2.2 with parameter "target=ts"
// @generated from file modules/bank/balance.proto (package supabase_l2_blockchain.modules.bank.v1, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Asset } from "../../core/asset_pb";
import { file_core_asset } from "../../core/asset_pb";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file modules/bank/balance.proto.
 */
export const file_modules_bank_balance: GenFile = /*@__PURE__*/
  fileDesc("Chptb2R1bGVzL2JhbmsvYmFsYW5jZS5wcm90bxImc3VwYWJhc2VfbDJfYmxvY2tjaGFpbi5tb2R1bGVzLmJhbmsudjEiUQoHQmFsYW5jZRIPCgdhZGRyZXNzGAEgASgJEjUKBmFzc2V0cxgCIAMoCzIlLnN1cGFiYXNlX2wyX2Jsb2NrY2hhaW4uY29yZS52MS5Bc3NldGIGcHJvdG8z", [file_core_asset]);

/**
 * @generated from message supabase_l2_blockchain.modules.bank.v1.Balance
 */
export type Balance = Message<"supabase_l2_blockchain.modules.bank.v1.Balance"> & {
  /**
   * @generated from field: string address = 1;
   */
  address: string;

  /**
   * @generated from field: repeated supabase_l2_blockchain.core.v1.Asset assets = 2;
   */
  assets: Asset[];
};

/**
 * Describes the message supabase_l2_blockchain.modules.bank.v1.Balance.
 * Use `create(BalanceSchema)` to create a new message.
 */
export const BalanceSchema: GenMessage<Balance> = /*@__PURE__*/
  messageDesc(file_modules_bank_balance, 0);
