import { ccc } from "@ckb-ccc/core"
import { ckbClient, PRIVATE_KEY } from "./ckb-client"

// ─── Helper: turn plain text into hex ───────────────────
// CKB can't store "Hello" directly — it stores bytes
// This converts "Hello" → "0x48656c6c6f"
function textToHex(text: string): string {
  const bytes = new TextEncoder().encode(text)
  // TextEncoder converts each character to its byte value
  // e.g. "H" → 72, "e" → 101, "l" → 108 etc

  return ( 
    "0x" +
    Array.from(bytes)
      .map(b => b.toString(16).padStart(2, "0"))
      // toString(16) converts number to hex: 72 → "48"
      // padStart(2,"0") ensures 2 digits: "8" → "08"
      .join("")
  )
}

// ─── Helper: turn hex back into plain text ───────────────
// This is the reverse: "0x48656c6c6f" → "Hello"
export function hexToText(hex: string): string {
  const bytes = new Uint8Array(
    hex
      .slice(2) // remove the "0x" prefix
      .match(/.{1,2}/g)! // split into pairs: ["48","65","6c","6c","6f"]
      .map(b => parseInt(b, 16)) // convert each pair to number: 72,101,108...
  )
  return new TextDecoder().decode(bytes)
  // TextDecoder converts bytes back to readable text
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

