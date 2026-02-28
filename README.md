# Stacks Token Swap

A decentralized token swap AMM built on Stacks blockchain using `@stacks/connect` and `@stacks/transactions`.

## Features

- ⚡ Token swapping with constant product formula
- 💧 Add liquidity to earn fees
- 📊 Real-time swap calculations
- 🔐 Secure Clarity smart contract

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Blockchain**: Stacks Mainnet
- **Smart Contract**: Clarity
- **Libraries**: @stacks/connect, @stacks/transactions, @stacks/network

## Contract Functions

- `add-liquidity` - Add STX liquidity to the pool
- `swap-stx` - Swap STX for tokens
- `get-swap-count` - Get total swap count
- `get-total-volume` - Get total trading volume
- `calculate-output` - Calculate swap output amount

## Getting Started

```bash
npm install
npm run dev
```

## Contract Address

Deployed on Stacks Mainnet: `SP3E0DQAHTXJHH5YT9TZCSBW013YXZB25QFDVXXWY.token-swap`

## License

MIT
