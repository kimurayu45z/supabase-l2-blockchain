// @generated by protoc-gen-es v2.2.2 with parameter "target=ts"
// @generated from file modules/auth/account.proto (package supabase_l2_blockchain.modules.auth.v1, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file modules/auth/account.proto.
 */
export const file_modules_auth_account: GenFile = /*@__PURE__*/
  fileDesc("Chptb2R1bGVzL2F1dGgvYWNjb3VudC5wcm90bxImc3VwYWJhc2VfbDJfYmxvY2tjaGFpbi5tb2R1bGVzLmF1dGgudjEiLAoHQWNjb3VudBIPCgdhZGRyZXNzGAEgASgJEhAKCHNlcXVlbmNlGAIgASgEYgZwcm90bzM");

/**
 * @generated from message supabase_l2_blockchain.modules.auth.v1.Account
 */
export type Account = Message<"supabase_l2_blockchain.modules.auth.v1.Account"> & {
  /**
   * @generated from field: string address = 1;
   */
  address: string;

  /**
   * @generated from field: uint64 sequence = 2;
   */
  sequence: bigint;
};

/**
 * Describes the message supabase_l2_blockchain.modules.auth.v1.Account.
 * Use `create(AccountSchema)` to create a new message.
 */
export const AccountSchema: GenMessage<Account> = /*@__PURE__*/
  messageDesc(file_modules_auth_account, 0);

