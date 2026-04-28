import { ccc } from "@ckb-ccc/core"

const CKB_RPC_URL =
  process.env.NEXT_PUBLIC_CKB_RPC_URL || "http://127.0.0.1:28114"

// Devnet secp256k1 cellDep — from your system-scripts.json
const DEVNET_SECP256K1_TX_HASH =
  "0x4d804f1495612631da202fe9902fa9899118554b08138cfe5dfb50e1ede76293"

export function createClient() {
  return new ccc.ClientPublicTestnet({
    url: CKB_RPC_URL,
    scripts: {
      Secp256k1Blake160: [
        {
          codeHash:
            "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          hashType: "type" as const,
          cellDeps: [
            {
              cellDep: {
                outPoint: {
                  txHash: DEVNET_SECP256K1_TX_HASH,
                  index: 0,
                },
                depType: "depGroup" as const,
              },
            },
          ],
        },
      ],
    } as any,
  })
}

export const PRIVATE_KEY = process.env.CKB_PRIVATE_KEY || ""