import { NextRequest, NextResponse } from "next/server"
import { ccc } from "@ckb-ccc/core"

const CKB_RPC_URL =
  process.env.NEXT_PUBLIC_CKB_RPC_URL || "http://127.0.0.1:28114"

const PRIVATE_KEY = process.env.CKB_PRIVATE_KEY || ""

// This runs on the SERVER — private key is safe here
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    if (!PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Private key not configured" },
        { status: 500 }
      )
    }

    // Connect to CKB node
    const client = new ccc.ClientPublicTestnet({ url: CKB_RPC_URL })
    const signer = new ccc.SignerCkbPrivateKey(client, PRIVATE_KEY)
    const address = await signer.getRecommendedAddress()
    const { script: lockScript } = await ccc.Address.fromString(
      address,
      client
    )

    // Convert message to hex
    const MESSAGE_PREFIX = "ckb-msg:"
    const tagged = MESSAGE_PREFIX + message
    const bytes = new TextEncoder().encode(tagged)
    const messageHex =
      "0x" +
      Array.from(bytes)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")

    // Build and send transaction
    const tx = ccc.Transaction.from({
      outputs: [{ lock: lockScript }],
      outputsData: [messageHex],
    })

    await tx.completeInputsByCapacity(signer)
    await tx.completeFeeBy(signer, 1000)
    const txHash = await signer.sendTransaction(tx)

    return NextResponse.json({ txHash })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    )
  }
}