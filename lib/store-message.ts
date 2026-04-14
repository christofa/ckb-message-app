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