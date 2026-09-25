export type WalletKind = 'metamask' | 'coinbase'

export type WalletSession = {
  kind: WalletKind
  address: `0x${string}`
  chainId: number
}

export type WalletSnapshot =
  | { status: 'disconnected' }
  | { status: 'connecting'; kind: WalletKind }
  | { status: 'connected'; session: WalletSession }
  | { status: 'error'; message: string }

export const walletKindLabel: Record<WalletKind, string> = {
  metamask: 'MetaMask',
  coinbase: 'Coinbase Wallet',
}
