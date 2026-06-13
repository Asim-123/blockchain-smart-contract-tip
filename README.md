# Tip Jar dApp

Minimal end-to-end Tip Jar application — Part D of the Blockchain Full-Stack Developer assessment.

## Stack

| Layer | Tech |
|-------|------|
| Contract | Solidity 0.8.20, Hardhat |
| Backend | Node.js, Express, viem, JSON file persistence |
| Frontend | React, Vite, wagmi, RainbowKit |

## Quick Start

### 1. Install dependencies

```bash
cd tip-jar && npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Compile & test contract

```bash
cd tip-jar
npm run compile
npm test
```

### 3. Start local chain & deploy

Terminal 1 — keep running:

```bash
cd tip-jar
npx hardhat node
```

Terminal 2:

```bash
cd tip-jar
npm run deploy:local
```

Copy the printed contract address.

### 4. Configure backend

```bash
cd tip-jar/backend
cp .env.example .env
```

Edit `.env`:

```
CONTRACT_ADDRESS=<deployed address>
DEPLOYMENT_BLOCK=1
```

```bash
npm run dev
```

Backend runs at `http://localhost:3001` — `GET /tips` returns confirmed tips.

### 5. Configure & start frontend

```bash
cd tip-jar/frontend
cp .env.example .env
```

Edit `.env`:

```
VITE_CONTRACT_ADDRESS=<deployed address>
```

```bash
npm run dev
```

Open `http://localhost:5173`. Connect wallet (add Hardhat network: `http://127.0.0.1:8545`, chainId `31337`, use a Hardhat test account private key).

> **Note:** With `CONFIRMATIONS=1`, tips appear in `/tips` only after one additional block is mined. Send a second tip or any tx to advance the chain if the list stays empty on a quiet local node.

## API

### `GET /tips`

```json
[
  {
    "from": "0x…",
    "amount": "10000000000000000",
    "message": "Great work!",
    "txHash": "0x…",
    "block": 3
  }
]
```

Only tips with ≥ `CONFIRMATIONS` blocks are returned (default: 1).

### `GET /health`

```json
{ "status": "ok" }
```

## Contract

- `tip(string message)` — payable; emits `NewTip(address indexed from, uint256 amount, string message)`
- `withdraw()` — owner only; drains contract balance
- CEI pattern and custom errors for gas-efficient reverts

## Production deployment (free)

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step free deployment to:
- **Sepolia testnet** (contract)
- **Vercel** (frontend)
- **Render** (backend)


Written answers for Parts A–C are in [`../ASSESSMENT_ANSWERS.md`](../ASSESSMENT_ANSWERS.md).

## Productionization — Next Steps

1. **Deploy to testnet/mainnet** — use a multisig or timelock as contract owner; verify on Etherscan.
2. **Backend hardening** — move from SQLite to Postgres; add reorg detection (compare parent hashes, roll back and re-index); run indexer as a separate worker process with health checks.
3. **Frontend** — add `simulateContract` pre-flight to surface revert reasons; private RPC for MEV protection; chain-aware config via env.
4. **Auth & ops** — rate-limit `/tips`, structured logging, metrics on indexer lag (latest block − last processed block).
5. **Stretch** — EIP-2612 permit for gasless tipping via a relayer, or SIWE for tipper identity.
