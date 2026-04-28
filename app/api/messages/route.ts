import { NextResponse } from "next/server"
import { ccc } from "@ckb-ccc/core"
import { createClient, PRIVATE_KEY } from "@/lib/ckb-client"

const MESSAGE_PREFIX = "ckb-msg:"

function hexToText(hex: string): string {
  if (!hex || hex === "0x") return ""

  const clean = hex.startsWith("0x") ? hex.slice(2) : hex
  const pairs = clean.match(/.{1,2}/g)

  if (!pairs) return ""

  const bytes = new Uint8Array(
    pairs.map(b => parseInt(b, 16))
  )

  return new TextDecoder().decode(bytes)
}

export async function GET() {
  try {
    if (!PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Private key not configured" },
        { status: 500 }
      )
    }

    const client = createClient()

    const signer = new ccc.SignerCkbPrivateKey(client, PRIVATE_KEY)

    const address = await signer.getRecommendedAddress()

    const { script: lockScript } = await ccc.Address.fromString(
      address,
      client
    )

    const messages: { message: string; txHash: string }[] = []

    const collector = client.findCellsByLock(lockScript, null, true)

    for await (const cell of collector) {
      if (!cell.outputData || cell.outputData === "0x") continue

      try {
        const decoded = hexToText(cell.outputData)

        if (decoded.startsWith(MESSAGE_PREFIX)) {
          messages.push({
            message: decoded.slice(MESSAGE_PREFIX.length),
            txHash: cell.outPoint.txHash,
          })
        }
      } catch {
        // skip bad data
      }
    }

    return NextResponse.json({ messages })

  } catch (err: any) {
    console.error("GET ERROR:", err)

    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    )
  }
}


















// import { NextResponse } from "next/server"
// import { ccc } from "@ckb-ccc/core"
// import { createClient, PRIVATE_KEY } from "@/lib/ckb-client"

// const MESSAGE_PREFIX = "ckb-msg:"

// function hexToText(hex: string): string {
//   const bytes = new Uint8Array(
//     hex.slice(2).match(/.{1,2}/g)!
//       .map(b => parseInt(b, 16))
//   )
//   return new TextDecoder().decode(bytes)
// }

// export async function GET() {
//   try {
//     const client = createClient()
//     const signer = new ccc.SignerCkbPrivateKey(client, PRIVATE_KEY)
//     const address = await signer.getRecommendedAddress()
//     const { script: lockScript } = await ccc.Address.fromString(
//       address,
//       client
//     )

//     const messages: { message: string; txHash: string }[] = []
//     const collector = client.findCellsByLock(lockScript, null, true)

//     for await (const cell of collector) {
//       if (!cell.outputData || cell.outputData === "0x") continue
//       try {
//         const decoded = hexToText(cell.outputData)
//         if (decoded.startsWith(MESSAGE_PREFIX)) {
//           messages.push({
//             message: decoded.slice(MESSAGE_PREFIX.length),
//             txHash: cell.outPoint.txHash,
//           })
//         }
//       } catch {
//         // skip non-text cells
//       }
//     }

//     return NextResponse.json({ messages })

//   } catch (err: any) {
//     console.error("Messages error:", err.message)
//     return NextResponse.json(
//       { error: err.message },
//       { status: 500 }
//     )
//   }
// }

















// // import { NextResponse } from "next/server"
// // import { ccc } from "@ckb-ccc/core"

// // const CKB_RPC_URL =
// //   process.env.NEXT_PUBLIC_CKB_RPC_URL || "http://127.0.0.1:28114"

// // const PRIVATE_KEY = process.env.CKB_PRIVATE_KEY || ""
// // const MESSAGE_PREFIX = "ckb-msg:"

// // function hexToText(hex: string): string {
// //   const bytes = new Uint8Array(
// //     hex
// //       .slice(2)
// //       .match(/.{1,2}/g)!
// //       .map(b => parseInt(b, 16))
// //   )
// //   return new TextDecoder().decode(bytes)
// // }

// // export async function GET() {
// //   try {
// //     const client = new ccc.ClientPublicTestnet({ url: CKB_RPC_URL })
// //     const signer = new ccc.SignerCkbPrivateKey(client, PRIVATE_KEY)
// //     const address = await signer.getRecommendedAddress()
// //     const { script: lockScript } = await ccc.Address.fromString(
// //       address,
// //       client
// //     )

// //     const messages: { message: string; txHash: string }[] = []
// //     const collector = client.findCellsByLock(lockScript, null, true)

// //     for await (const cell of collector) {
// //       if (!cell.outputData || cell.outputData === "0x") continue
// //       try {
// //         const decoded = hexToText(cell.outputData)
// //         if (decoded.startsWith(MESSAGE_PREFIX)) {
// //           messages.push({
// //             message: decoded.slice(MESSAGE_PREFIX.length),
// //             txHash: cell.outPoint.txHash,
// //           })
// //         }
// //       } catch {
// //         // skip non-text cells
// //       }
// //     }

// //     return NextResponse.json({ messages })

// //   } catch (err: any) {
// //     return NextResponse.json(
// //       { error: err.message },
// //       { status: 500 }
// //     )
// //   }
// // }