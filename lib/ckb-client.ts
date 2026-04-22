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


// import { ccc } from "@ckb-ccc/core";

// /**
//  * 1. RPC URL Configuration
//  * We check the env first, then fall back to local devnet.
//  */
// export const CKB_RPC_URL = 
//   process.env.NEXT_PUBLIC_CKB_RPC_URL || "http://127.0.0.1:28114";

// /**
//  * 2. Client Initialization
//  */
// export const ckbClient = new ccc.ClientPublicTestnet({
//   url: CKB_RPC_URL,
// });

// /**
//  * 3. Private Key Handling
//  * CRITICAL: This variable will be 'undefined' if you try to 
//  * console.log it in a "use client" component. It only exists 
//  * in API routes or Server Actions.
//  */
// export const PRIVATE_KEY = process.env.CKB_PRIVATE_KEY;

// // Helper to ensure the key exists before running sensitive logic
// export const getPrivateKey = () => {
//   if (!PRIVATE_KEY) {
//     throw new Error("SECURE_ERROR: CKB_PRIVATE_KEY is not defined in environment variables.");
//   }
//   return PRIVATE_KEY;
// };