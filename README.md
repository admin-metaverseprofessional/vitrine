# Vitrine

Vitrine shows the NFTs held by a wallet connected through MetaMask or Coinbase Wallet.

This repository is the foundation. Wallet connection, NFT loading, and the gallery presentation are separate modules so each one can be scoped as its own issue.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## What the foundation includes

- App shell, home page, and gallery route
- Chain list the later holdings module will read: Ethereum, Base, Polygon, Arbitrum, Optimism
- Wallet contract: `useWallet()` returns a disconnected session until the wallet module replaces the provider
- Gallery contract: `useNftHoldings()` returns an empty list until a wallet is connected and the holdings module fills it

## Modules

See [docs/modules.md](docs/modules.md) for the module map and the acceptance criteria for the first bounty.

Winner check for issue 4.

