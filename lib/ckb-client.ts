import { ccc } from "@ckb-ccc/core"

// Use testnet — works with CCC out of the box, no script issues
export const ckbClient = new ccc.ClientPublicTestnet()

export const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY ?? ""