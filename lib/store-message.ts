import { ccc } from "@ckb-ccc/core"
import { ckbClient, PRIVATE_KEY } from "./ckb-client"

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
  const messageHex = textToHex(message)

  const { script: lockScript } = await ccc.Address.fromString(
    address,
    ckbClient
  )

  const tx = ccc.Transaction.from({
    outputs: [
      {
        lock: lockScript,
      },
    ],
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
  // Step 1: Create signer and get your address + lock script
  const signer = new ccc.SignerCkbPrivateKey(ckbClient, PRIVATE_KEY)
  const address = await signer.getRecommendedAddress()
  const { script: lockScript } = await ccc.Address.fromString(
    address,
    ckbClient
  )

  // Step 2: Create empty array to store results
  const messages: { message: string; txHash: string }[] = []

  // Step 3: Search the blockchain for ALL cells you own
  const collector = ckbClient.findCellsByLock(lockScript, null, true)

  // Step 4: Loop through every cell found
  for await (const cell of collector) {

    // Step 5: Skip cells with no data (empty boxes)
    if (!cell.outputData || cell.outputData === "0x") continue

    try {
      // Step 6: Convert hex data back to readable text
      const message = hexToText(cell.outputData)

      // Step 7: Only keep it if it looks like real text
      if (message.trim().length > 0) {
        messages.push({
          message,
          txHash: cell.outPoint.txHash,
        })
      }
    } catch {
        console.error("Failed to decode cell data, skipping...")
      // If decoding fails just skip that cell silently
    }
  }

  // Step 8: Return all messages found
  return messages
}