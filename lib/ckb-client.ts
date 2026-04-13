import { ClientPublicTestnet } from "@ckb-ccc/core";

export const CKB_DEVNET_RPC =
  process.env.NEXT_PUBLIC_CKB_DEVNET_RPC ?? "http://127.0.0.1:8114";

export const ckbClient = new ClientPublicTestnet({
  url: CKB_DEVNET_RPC,
});

export const createCkbClient = (rpcUrl = CKB_DEVNET_RPC) =>
  new ClientPublicTestnet({ url: rpcUrl });
