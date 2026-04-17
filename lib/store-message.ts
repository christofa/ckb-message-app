import { ccc } from "@ckb-ccc/core"
import { ckbClient, PRIVATE_KEY } from "./ckb-client"

const MESSAGE_PREFIX = "ckb-msg:"

// ─── Step1: Turn plain text into hex ─────
function textToHex(text: string): string {
  const bytes = new TextEncoder().encode(text)

  return ( 
    "0x" +
    Array.from(bytes)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
  )
}

// ───- Step2: Turn hex back into plain text ─────
export function hexToText(hex: string): string {
  const bytes = new Uint8Array(
    hex
      .slice(2) 
      .match(/.{1,2}/g)!
      .map(b => parseInt(b, 16)) 
  )
  return new TextDecoder().decode(bytes)
}

// ─── Step3: Store a message on CKB ──────────
export async function storeMessage(message: string): Promise<string> {
  const signer = new ccc.SignerCkbPrivateKey(ckbClient, PRIVATE_KEY)
  const address = await signer.getRecommendedAddress()
  const { script: lockScript } = await ccc.Address.fromString(
    address,
    ckbClient
  )

  // Add prefix so we can identify our messages later
  const taggedMessage = MESSAGE_PREFIX + message
  const messageHex = textToHex(taggedMessage)

  const tx = ccc.Transaction.from({
    outputs: [{ lock: lockScript }],
    outputsData: [messageHex],
  })

  await tx.completeInputsByCapacity(signer)
  await tx.completeFeeBy(signer, 1000)
  const txHash = await signer.sendTransaction(tx)
  return txHash
}

// ─── Step4: Fetch all messages stored on chain ───────────
export async function fetchMessages(): Promise<
  { message: string; txHash: string }[]
> {
  const signer = new ccc.SignerCkbPrivateKey(ckbClient, PRIVATE_KEY)
  const address = await signer.getRecommendedAddress()
  const { script: lockScript } = await ccc.Address.fromString(
    address,
    ckbClient
  )

  const messages: { message: string; txHash: string }[] = []
  const collector = ckbClient.findCellsByLock(lockScript, null, true)

  for await (const cell of collector) {
    if (!cell.outputData || cell.outputData === "0x") continue

    try {
      const decoded = hexToText(cell.outputData)


      if (decoded.startsWith(MESSAGE_PREFIX)) {
        messages.push({
          // Remove the prefix before showing to user
          message: decoded.slice(MESSAGE_PREFIX.length),
          txHash: cell.outPoint.txHash,
        })
      }
    } catch {
        console.error("Failed to decode cell data:", cell.outputData)
    }
  }

  // Step 8: Return all messages found
  return messages
}