import { ccc } from "@ckb-ccc/core"

export const CKB_RPC_URL =
  process.env.NEXT_PUBLIC_CKB_RPC_URL || "http://127.0.0.1:28114"

export const ckbClient = new ccc.ClientPublicTestnet({
  url: CKB_RPC_URL,
})

// No fallback — key only lives in .env.local
export const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY ?? ""