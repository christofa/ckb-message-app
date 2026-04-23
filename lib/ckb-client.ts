import { ccc } from "@ckb-ccc/core";

// Which node to connect to
export const CKB_RPC_URL =
  process.env.NEXT_PUBLIC_CKB_RPC_URL || "http://127.0.0.1:28114";

// Connect to the CKB node
export const ckbClient = new ccc.ClientPublicTestnet({
  url: CKB_RPC_URL,
});

// Test account private key 
export const PRIVATE_KEY = process.env.CKB_PRIVATE_KEY;


 export const getPrivateKey = () => {
  if (!PRIVATE_KEY) {
    throw new Error("SECURE_ERROR: CKB_PRIVATE_KEY is not defined in environment variables.");
  }
  return PRIVATE_KEY;
};
