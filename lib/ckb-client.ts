import { ccc } from "@ckb-\ccc/core";

// We use the Testnet (ckt1) for learning
const client = ccc.clientTestnet;

export async function sendMessage(privKey: string, message: string) {
  // 1. Initialize the Signer
  const signer = new ccc.SignerCkbPrivateKey(client, privKey);
  const [{ script: lockScript }] = await signer.getAddressObjs();

  // 2. Convert Message to Hex
  // CKB data field must be in hex format
  const data = ccc.bytesFrom(Buffer.from(message, "utf-8"));

  // 3. Create a Transaction Skeleton
  // We are creating a new cell with our message in the 'data' field
  const tx = ccc.Transaction.from({
    outputs: [{
      lock: lockScript,
    }],
    outputsData: [data],
  });

  // 4. Complete, Sign, and Send
  // CCC automatically handles "Change" cells and Fee calculation
  await tx.completeInputsAndChange(signer);
  const txHash = await signer.sendTransaction(tx);

  return txHash;
}