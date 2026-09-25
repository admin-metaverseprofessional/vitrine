# Modules

Work lands one module at a time. The foundation stays in place. Later modules replace the stubs without rewriting the shell.

| Module | Status | Seam |
| --- | --- | --- |
| Foundation | This repository | Shell, routes, `supportedChains`, wallet and gallery contracts |
| `wallet-connect` | In this repo | `useWallet().connect()` and `disconnect()` for MetaMask and Coinbase Wallet |
| `nft-holdings` | In this repo | Fill `useNftHoldings()` for the connected address |
| `gallery` | In this repo | Render `NftHolding` cards on `/gallery` |

## wallet-connect

First module after the foundation.

Acceptance:

- A visitor can connect MetaMask.
- A visitor can connect Coinbase Wallet.
- The header shows the wallet kind, a shortened address, and the chain.
- A visitor can disconnect and return to `status: 'disconnected'`.
- `useWallet()` is the only wallet API the shell uses.
- This module does not fetch NFTs.

Suggested issue title: `Connect MetaMask and Coinbase Wallet`

## nft-holdings

Acceptance:

- Given a connected session, load NFTs held by that address.
- Cover the chains in `src/shared/chains.ts`.
- Return `NftHolding` values from `useNftHoldings()`.
- Leave the gallery layout to the gallery module. An empty or plain list is enough here if the gallery module has not landed.

## gallery

Acceptance:

- `/gallery` renders one card per holding: image, name, collection, and chain.
- With no wallet session, keep the empty state already in the foundation.
- With a session and zero holdings, say that the cabinet is empty.
