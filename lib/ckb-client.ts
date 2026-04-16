import { ccc } from "@ckb-ccc/core";

// Which node to connect to
export const CKB_RPC_URL =
  process.env.NEXT_PUBLIC_CKB_RPC_URL || "http://127.0.0.1:28114";

// Connect to the CKB node
export const ckbClient = new ccc.ClientPublicTestnet({
  url: CKB_RPC_URL,
});

// Test account private key (never use on mainnet!)
export const PRIVATE_KEY =
  "0x6109170b275a09ad54877b82f7d9930f88cab5717d484fb4741ae9d1dd078cd6";
