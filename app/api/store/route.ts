import { NextRequest, NextResponse } from "next/server"
import { ccc } from "@ckb-ccc/core"
import { createClient, PRIVATE_KEY } from "@/lib/ckb-client"

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

    // ✅ Use your shared client (offckb devnet)
    const client = createClient()

    const signer = new ccc.SignerCkbPrivateKey(client, PRIVATE_KEY)

    const address = await signer.getRecommendedAddress()

    const { script: lockScript } = await ccc.Address.fromString(
      address,
      client
    )

    // ✅ Encode message
    const MESSAGE_PREFIX = "ckb-msg:"
    const tagged = MESSAGE_PREFIX + message

    const bytes = new TextEncoder().encode(tagged)
    const messageHex =
      "0x" +
      Array.from(bytes)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")

    // ✅ IMPORTANT: include capacity
    const tx = ccc.Transaction.from({
      outputs: [
        {
          lock: lockScript,
          capacity: ccc.fixedPointFrom(61), // minimum required
        },
      ],
      outputsData: [messageHex],
    })

    // 🧠 Debug logs (super useful)
    // console.log("Address:", address)
    // console.log("Message Hex:", messageHex)

    await tx.completeInputsByCapacity(signer)
    await tx.completeFeeBy(signer, 1000)

    const txHash = await signer.sendTransaction(tx)

    return NextResponse.json({ txHash })

  } catch (err: any) {
    console.error("FULL ERROR:", err)

    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    )
  }
}