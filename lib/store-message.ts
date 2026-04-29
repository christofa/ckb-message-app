import { ccc } from "@ckb-ccc/core";
import { ckbClient, PRIVATE_KEY } from "./ckb-client";

const MESSAGE_PREFIX = "ckb-msg:";

// Convert plain text to hex for storing on chain
function textToHex(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

// Convert hex back to plain text for reading
function hexToText(hex: string): string {
  if (!hex || hex === "0x") return "";
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const pairs = clean.match(/.{1,2}/g);
  if (!pairs) return "";
  const bytes = new Uint8Array(pairs.map((b) => parseInt(b, 16)));
  return new TextDecoder().decode(bytes);
}

export async function storeMessage(message: string): Promise<string> {
  const signer = new ccc.SignerCkbPrivateKey(ckbClient, PRIVATE_KEY);
  const address = await signer.getRecommendedAddress();
  const messageHex = textToHex(MESSAGE_PREFIX + message);

  const { script: lockScript } = await ccc.Address.fromString(
    address,
    ckbClient,
  );

  const tx = ccc.Transaction.from({
    outputs: [{ lock: lockScript }],
    outputsData: [messageHex],
  });

  await tx.completeInputsByCapacity(signer);
  await tx.completeFeeBy(signer, 1000);
  const txHash = await signer.sendTransaction(tx);
  return txHash;
}

export async function fetchMessages(): Promise<
  { message: string; txHash: string }[]
> {
  const signer = new ccc.SignerCkbPrivateKey(ckbClient, PRIVATE_KEY);
  const address = await signer.getRecommendedAddress();
  const { script: lockScript } = await ccc.Address.fromString(
    address,
    ckbClient,
  );

  const messages: { message: string; txHash: string }[] = [];
  const collector = ckbClient.findCellsByLock(lockScript, null, true);

  for await (const cell of collector) {
    if (!cell.outputData || cell.outputData === "0x") continue;
    try {
      const decoded = hexToText(cell.outputData);
      if (decoded.startsWith(MESSAGE_PREFIX)) {
        messages.push({
          message: decoded.slice(MESSAGE_PREFIX.length),
          txHash: cell.outPoint.txHash,
        });
      }
    } catch {
      // skip bad cells
    }
  }

  return messages;
}
