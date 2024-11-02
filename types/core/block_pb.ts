// @generated by protoc-gen-es v2.2.2 with parameter "target=ts"
// @generated from file core/block.proto (package supabase_l2_blockchain.core.v1, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Any, Timestamp } from "@bufbuild/protobuf/wkt";
import { file_google_protobuf_any, file_google_protobuf_timestamp } from "@bufbuild/protobuf/wkt";
import type { Tx } from "./tx_pb";
import { file_core_tx } from "./tx_pb";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file core/block.proto.
 */
export const file_core_block: GenFile = /*@__PURE__*/
  fileDesc("ChBjb3JlL2Jsb2NrLnByb3RvEh5zdXBhYmFzZV9sMl9ibG9ja2NoYWluLmNvcmUudjEiiwEKC0Jsb2NrSGVhZGVyEhAKCGNoYWluX2lkGAEgASgJEg4KBmhlaWdodBgCIAEoAxIoCgR0aW1lGAMgASgLMhouZ29vZ2xlLnByb3RvYnVmLlRpbWVzdGFtcBIXCg9sYXN0X2Jsb2NrX2hhc2gYBCABKAwSFwoPdHhzX21lcmtsZV9yb290GAUgASgMIjwKCFR4U2VyaWVzEjAKA3R4cxgBIAMoCzIjLnN1cGFiYXNlX2wyX2Jsb2NrY2hhaW4uY29yZS52MS5UeHMiPgoKVHhQYXJhbGxlbBIwCgN0eHMYAiADKAsyIy5zdXBhYmFzZV9sMl9ibG9ja2NoYWluLmNvcmUudjEuVHhzIr8BCgNUeHMSMAoCdHgYASABKAsyIi5zdXBhYmFzZV9sMl9ibG9ja2NoYWluLmNvcmUudjEuVHhIABI6CgZzZXJpZXMYAiABKAsyKC5zdXBhYmFzZV9sMl9ibG9ja2NoYWluLmNvcmUudjEuVHhTZXJpZXNIABI+CghwYXJhbGxlbBgDIAEoCzIqLnN1cGFiYXNlX2wyX2Jsb2NrY2hhaW4uY29yZS52MS5UeFBhcmFsbGVsSABCCgoIc3RyYXRlZ3kifQoJQmxvY2tCb2R5EjAKA3R4cxgBIAMoCzIjLnN1cGFiYXNlX2wyX2Jsb2NrY2hhaW4uY29yZS52MS5UeHMSKgoMbmV4dF9zaWduZXJzGAIgAygLMhQuZ29vZ2xlLnByb3RvYnVmLkFueRISCgpzaWduYXR1cmVzGAMgAygMIosBCgVCbG9jaxIMCgRoYXNoGAEgASgMEjsKBmhlYWRlchgCIAEoCzIrLnN1cGFiYXNlX2wyX2Jsb2NrY2hhaW4uY29yZS52MS5CbG9ja0hlYWRlchI3CgRib2R5GAMgASgLMikuc3VwYWJhc2VfbDJfYmxvY2tjaGFpbi5jb3JlLnYxLkJsb2NrQm9keWIGcHJvdG8z", [file_google_protobuf_any, file_google_protobuf_timestamp, file_core_tx]);

/**
 * @generated from message supabase_l2_blockchain.core.v1.BlockHeader
 */
export type BlockHeader = Message<"supabase_l2_blockchain.core.v1.BlockHeader"> & {
  /**
   * @generated from field: string chain_id = 1;
   */
  chainId: string;

  /**
   * @generated from field: int64 height = 2;
   */
  height: bigint;

  /**
   * @generated from field: google.protobuf.Timestamp time = 3;
   */
  time?: Timestamp;

  /**
   * @generated from field: bytes last_block_hash = 4;
   */
  lastBlockHash: Uint8Array;

  /**
   * @generated from field: bytes txs_merkle_root = 5;
   */
  txsMerkleRoot: Uint8Array;
};

/**
 * Describes the message supabase_l2_blockchain.core.v1.BlockHeader.
 * Use `create(BlockHeaderSchema)` to create a new message.
 */
export const BlockHeaderSchema: GenMessage<BlockHeader> = /*@__PURE__*/
  messageDesc(file_core_block, 0);

/**
 * @generated from message supabase_l2_blockchain.core.v1.TxSeries
 */
export type TxSeries = Message<"supabase_l2_blockchain.core.v1.TxSeries"> & {
  /**
   * @generated from field: repeated supabase_l2_blockchain.core.v1.Txs txs = 1;
   */
  txs: Txs[];
};

/**
 * Describes the message supabase_l2_blockchain.core.v1.TxSeries.
 * Use `create(TxSeriesSchema)` to create a new message.
 */
export const TxSeriesSchema: GenMessage<TxSeries> = /*@__PURE__*/
  messageDesc(file_core_block, 1);

/**
 * @generated from message supabase_l2_blockchain.core.v1.TxParallel
 */
export type TxParallel = Message<"supabase_l2_blockchain.core.v1.TxParallel"> & {
  /**
   * @generated from field: repeated supabase_l2_blockchain.core.v1.Txs txs = 2;
   */
  txs: Txs[];
};

/**
 * Describes the message supabase_l2_blockchain.core.v1.TxParallel.
 * Use `create(TxParallelSchema)` to create a new message.
 */
export const TxParallelSchema: GenMessage<TxParallel> = /*@__PURE__*/
  messageDesc(file_core_block, 2);

/**
 * @generated from message supabase_l2_blockchain.core.v1.Txs
 */
export type Txs = Message<"supabase_l2_blockchain.core.v1.Txs"> & {
  /**
   * @generated from oneof supabase_l2_blockchain.core.v1.Txs.strategy
   */
  strategy: {
    /**
     * @generated from field: supabase_l2_blockchain.core.v1.Tx tx = 1;
     */
    value: Tx;
    case: "tx";
  } | {
    /**
     * @generated from field: supabase_l2_blockchain.core.v1.TxSeries series = 2;
     */
    value: TxSeries;
    case: "series";
  } | {
    /**
     * @generated from field: supabase_l2_blockchain.core.v1.TxParallel parallel = 3;
     */
    value: TxParallel;
    case: "parallel";
  } | { case: undefined; value?: undefined };
};

/**
 * Describes the message supabase_l2_blockchain.core.v1.Txs.
 * Use `create(TxsSchema)` to create a new message.
 */
export const TxsSchema: GenMessage<Txs> = /*@__PURE__*/
  messageDesc(file_core_block, 3);

/**
 * @generated from message supabase_l2_blockchain.core.v1.BlockBody
 */
export type BlockBody = Message<"supabase_l2_blockchain.core.v1.BlockBody"> & {
  /**
   * @generated from field: repeated supabase_l2_blockchain.core.v1.Txs txs = 1;
   */
  txs: Txs[];

  /**
   * @generated from field: repeated google.protobuf.Any next_signers = 2;
   */
  nextSigners: Any[];

  /**
   * @generated from field: repeated bytes signatures = 3;
   */
  signatures: Uint8Array[];
};

/**
 * Describes the message supabase_l2_blockchain.core.v1.BlockBody.
 * Use `create(BlockBodySchema)` to create a new message.
 */
export const BlockBodySchema: GenMessage<BlockBody> = /*@__PURE__*/
  messageDesc(file_core_block, 4);

/**
 * @generated from message supabase_l2_blockchain.core.v1.Block
 */
export type Block = Message<"supabase_l2_blockchain.core.v1.Block"> & {
  /**
   * @generated from field: bytes hash = 1;
   */
  hash: Uint8Array;

  /**
   * @generated from field: supabase_l2_blockchain.core.v1.BlockHeader header = 2;
   */
  header?: BlockHeader;

  /**
   * @generated from field: supabase_l2_blockchain.core.v1.BlockBody body = 3;
   */
  body?: BlockBody;
};

/**
 * Describes the message supabase_l2_blockchain.core.v1.Block.
 * Use `create(BlockSchema)` to create a new message.
 */
export const BlockSchema: GenMessage<Block> = /*@__PURE__*/
  messageDesc(file_core_block, 5);

