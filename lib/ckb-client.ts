import { ccc } from "@ckb-ccc/core";

export type Network = "devnet" | "testnet";

// Change to "testnet" when you want to use the public CKB testnet.
const NETWORK: Network = "devnet";

export function createCkbClient(network: Network = NETWORK) {
  return network === "testnet"
    ? new ccc.ClientPublicTestnet()
    : new ccc.ClientPublicTestnet({
        url: "http://localhost:28114",
      });
}

export const ckbClient = createCkbClient();

export async function checkCkbConnection(network: Network = NETWORK) {
  const client = createCkbClient(network);
  const tip = await client.getTip();

  return {
    network,
    url: client.url,
    tip: tip.toString(),
  };
}

export const PRIVATE_KEY =
  "0x6109170b275a09ad54877b82f7d9930f88cab5717d484fb4741ae9d1dd078cd6";
