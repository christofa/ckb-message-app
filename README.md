# CKB Message App

A full-stack web app that lets you store messages permanently on the CKB blockchain. Built with Next.js, TypeScript, Tailwind CSS, and the CCC SDK as part of the CKBuilder developer program on Nervos Network.

🔗 **Live demo:** [cellnotes.netlify.app](https://cellnotes.netlify.app)

---

## What it does

- Type any message in the UI
- Click **Store Message** — the message is written into a CKB Cell on-chain
- Every message is permanently stored in the `data` field of a Cell
- Click **Refresh** to fetch and display all your stored messages from the blockchain

---

## How it works

CKB stores data in **Cells**. Each Cell has a `data` field that can hold anything — text, images, JSON. This app converts your message to hex, stores it in a Cell's data field, and reads it back by scanning your address's live Cells.

```
User types message
       ↓
Text converted to hex  ("Hello" → "0x48656c6c6f")
       ↓
CKB transaction built  (output Cell with your message in data field)
       ↓
Transaction signed with private key + broadcast to CKB testnet
       ↓
Message lives on-chain forever — retrievable by TX hash
```

---

## Tech stack

| Tool | Purpose |
|---|---|
| Next.js 14 | Frontend framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| @ckb-ccc/core | CKB transaction building + signing |
| CKB Testnet | Blockchain network |

---

## Project structure

```
src/
├── app/
│   └── page.tsx              # Main UI — renders MessageForm and MessageList
├── components/
│   ├── MessageForm.tsx        # Input form — handles storing messages
│   └── MessageList.tsx        # Displays all stored messages from chain
└── lib/
    ├── ckb-client.ts          # CKB client configuration
    └── store-message.ts       # Core blockchain logic (store + fetch)
```

---

## Getting started

### Prerequisites

- Node.js 20+
- A CKB testnet private key
- Testnet CKB from the [faucet](https://faucet.nervos.org)

### Installation

```bash
# Clone the repo
git clone https://github.com/christofa/ckb-message-app.git
cd ckb-message-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment variables

Create a `.env.local` file in the root:

```bash
NEXT_PUBLIC_PRIVATE_KEY=your_ckb_testnet_private_key_here
NEXT_PUBLIC_CKB_RPC_URL=http://127.0.0.1:28114
```

> ⚠️ **Security note:** The `NEXT_PUBLIC_` prefix makes this variable available in the browser bundle. This is acceptable for a learning project on testnet. For a production app with real funds, move transaction signing to a server-side API route so the private key never reaches the browser.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Key concepts learned

**Cell model** — Unlike Ethereum where data lives inside smart contracts, CKB stores everything in Cells. Your message is physically stored in a Cell you own.

**Capacity** — Every Cell requires CKB to cover its byte size. Storing data costs CKB (you get it back when the Cell is consumed).

**Lock Script** — Controls who can spend a Cell. This app uses the default `secp256k1_blake160` lock — only your private key can spend your Cells.

**Hex encoding** — CKB stores data as raw bytes. Text is encoded to hex before storing and decoded back when reading.

---

## Part of

Built during the **CKBuilder track** — a 3-month developer education program by the [Nervos Community Catalyst](https://talk.nervos.org). This project is the Month 1 capstone demonstrating on-chain data storage using the CKB Cell model.

---

## License

MIT
