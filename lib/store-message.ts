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

// ─── Store a message on CKB ──────────────────────────────
export async function storeMessage(message: string): Promise<string> {

  // Step 1: Create a "signer" — this is like your wallet
  // It uses your private key to prove you own the cells
  const signer = new ccc.SignerCkbPrivateKey(ckbClient, PRIVATE_KEY)

  // Step 2: Get your CKB address from the signer
  // This is like your bank account number
  const address = await signer.getRecommendedAddress()

  // Step 3: Convert message to hex so CKB can store it
  const messageHex = textToHex(message)

  // Step 4: Get your lock script from your address
  // Lock script = the "owner label" on your cell
  const { script: lockScript } = await ccc.Address.fromString(
    address,
    ckbClient
  )

  // Step 5: Build the transaction
  // Think of this like filling out a bank transfer form
  const tx = ccc.Transaction.from({
    outputs: [
      {
        lock: lockScript,
        // This cell belongs to YOU (same address)
        // We're storing data on chain but keeping ownership
      },
    ],
    outputsData: [messageHex],
    // This is where the message actually lives in the cell
  })

  // Step 6: Automatically find which of your cells to spend
  // Like the bank picking which account to debit from
  await tx.completeInputsByCapacity(signer)

  // Step 7: Automatically calculate and add the transaction fee
  // 1000 = fee rate (very small amount)
  await tx.completeFeeBy(signer, 1000)

  // Step 8: Sign the transaction with your private key
  // and broadcast it to the CKB network
  const txHash = await signer.sendTransaction(tx)

  // Step 9: Return the transaction hash as proof
  // This is like your bank receipt number
  return txHash
}

// ─── Fetch all messages stored on chain ──────────────────
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
      // If decoding fails just skip that cell silently
    }
  }

  // Step 8: Return all messages found
  return messages
}