import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { WalletSnapshot } from './types'

type WalletContextValue = {
  snapshot: WalletSnapshot
}

const WalletContext = createContext<WalletContextValue | null>(null)

/**
 * Foundation stub. The wallet-connect module replaces this provider.
 * Callers should keep using useWallet() so the shell does not change.
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  const value = useMemo<WalletContextValue>(
    () => ({ snapshot: { status: 'disconnected' } }),
    [],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const value = useContext(WalletContext)
  if (!value) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return value
}
