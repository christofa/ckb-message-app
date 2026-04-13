import { ClientPublicTestnet } from "@ckb-ccc/core";

// 1. Pull the URL from the environment with a fallback for local dev
export const CKB_DEVNET_RPC =
  process.env.NEXT_PUBLIC_CKB_DEVNET_RPC || "http://127.0.0.1:8114";

// 2. Singleton instance for general use
export const ckbClient = new ClientPublicTestnet({
  url: CKB_DEVNET_RPC,
});

/**
 * Helper to create a custom client if you ever need to 
 * connect to a different node on the fly.
 */
export const createCkbClient = (rpcUrl = CKB_DEVNET_RPC) =>
  new ClientPublicTestnet({ url: rpcUrl });