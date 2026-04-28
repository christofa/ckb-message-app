import { ccc } from "@ckb-ccc/core"

const CKB_RPC_URL =
  process.env.NEXT_PUBLIC_CKB_RPC_URL || "http://127.0.0.1:28114"

export function createClient() {
  // ✅ Use this for devnet to avoid testnet cellDeps
  return new ccc.ClientPublicMainnet({
    url: CKB_RPC_URL,
  })
}

export const PRIVATE_KEY = process.env.CKB_PRIVATE_KEY || ""