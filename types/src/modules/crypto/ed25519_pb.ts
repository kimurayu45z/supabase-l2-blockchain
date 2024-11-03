// @generated by protoc-gen-es v2.2.2 with parameter "target=ts"
// @generated from file modules/crypto/ed25519.proto (package supabase_l2_blockchain.modules.crypto.v1, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file modules/crypto/ed25519.proto.
 */
export const file_modules_crypto_ed25519: GenFile = /*@__PURE__*/
  fileDesc("Chxtb2R1bGVzL2NyeXB0by9lZDI1NTE5LnByb3RvEihzdXBhYmFzZV9sMl9ibG9ja2NoYWluLm1vZHVsZXMuY3J5cHRvLnYxIiIKEVByaXZhdGVLZXlFZDI1NTE5Eg0KBXZhbHVlGAEgASgMIiEKEFB1YmxpY0tleUVkMjU1MTkSDQoFdmFsdWUYASABKAxiBnByb3RvMw");

/**
 * @generated from message supabase_l2_blockchain.modules.crypto.v1.PrivateKeyEd25519
 */
export type PrivateKeyEd25519 = Message<"supabase_l2_blockchain.modules.crypto.v1.PrivateKeyEd25519"> & {
  /**
   * @generated from field: bytes value = 1;
   */
  value: Uint8Array;
};

/**
 * Describes the message supabase_l2_blockchain.modules.crypto.v1.PrivateKeyEd25519.
 * Use `create(PrivateKeyEd25519Schema)` to create a new message.
 */
export const PrivateKeyEd25519Schema: GenMessage<PrivateKeyEd25519> = /*@__PURE__*/
  messageDesc(file_modules_crypto_ed25519, 0);

/**
 * @generated from message supabase_l2_blockchain.modules.crypto.v1.PublicKeyEd25519
 */
export type PublicKeyEd25519 = Message<"supabase_l2_blockchain.modules.crypto.v1.PublicKeyEd25519"> & {
  /**
   * @generated from field: bytes value = 1;
   */
  value: Uint8Array;
};

/**
 * Describes the message supabase_l2_blockchain.modules.crypto.v1.PublicKeyEd25519.
 * Use `create(PublicKeyEd25519Schema)` to create a new message.
 */
export const PublicKeyEd25519Schema: GenMessage<PublicKeyEd25519> = /*@__PURE__*/
  messageDesc(file_modules_crypto_ed25519, 1);
