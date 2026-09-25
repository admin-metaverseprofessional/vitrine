import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { asEip1193, findMetaMask, getCoinbaseProvider, type Eip1193Provider } from './providers'
import type { WalletKind, WalletSession, WalletSnapshot } from './types'

type WalletContextValue = {
  snapshot: WalletSnapshot
  connect: (kind: WalletKind) => Promise<void>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextValue | null>(null)

function isAddress(value: string): value is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(value)
}

function parseChainId(value: unknown): number {
  if (typeof value === 'number' && Number.isInteger(value)) return value
  if (typeof value === 'string') {
    return Number.parseInt(value, value.startsWith('0x') ? 16 : 10)
  }
  throw new Error('Wallet did not return a chain id')
}

function sessionFrom(kind: WalletKind, accounts: unknown, chainValue: unknown): WalletSession {
  const address = Array.isArray(accounts) ? accounts[0] : null
  if (typeof address !== 'string' || !isAddress(address)) {
    throw new Error('The wallet did not return an address.')
  }
  return { kind, address, chainId: parseChainId(chainValue) }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<WalletSnapshot>({ status: 'disconnected' })
  const providerRef = useRef<Eip1193Provider | null>(null)
  const accountsListener = useRef<((...args: unknown[]) => void) | null>(null)
  const chainListener = useRef<((...args: unknown[]) => void) | null>(null)

  const clearListeners = useCallback(() => {
    const provider = providerRef.current
    if (provider?.removeListener && accountsListener.current) {
      provider.removeListener('accountsChanged', accountsListener.current)
    }
    if (provider?.removeListener && chainListener.current) {
      provider.removeListener('chainChanged', chainListener.current)
    }
    accountsListener.current = null
    chainListener.current = null
  }, [])

  const disconnect = useCallback(async () => {
    const provider = providerRef.current
    clearListeners()
    providerRef.current = null
    try {
      await provider?.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
      })
    } catch {
      // Some wallets have no revoke method. The app session still ends.
    }
    try {
      await provider?.disconnect?.()
    } catch {
      // Coinbase can reject disconnect after revoke. The app session still ends.
    }
    setSnapshot({ status: 'disconnected' })
  }, [clearListeners])

  const connect = useCallback(
    async (kind: WalletKind) => {
      setSnapshot({ status: 'connecting', kind })
      clearListeners()
      providerRef.current = null

      try {
        const found = kind === 'metamask' ? await findMetaMask() : getCoinbaseProvider()
        const provider: Eip1193Provider | null = found ? asEip1193(found) : null
        if (!provider) {
          setSnapshot({
            status: 'error',
            message: 'MetaMask is not available in this browser.',
          })
          return
        }

        const accounts = await provider.request({ method: 'eth_requestAccounts' })
        const chainValue = await provider.request({ method: 'eth_chainId' })
        const session = sessionFrom(kind, accounts, chainValue)

        const onAccounts = (next: unknown) => {
          const list = Array.isArray(next) ? next : []
          const nextAddress = list[0]
          if (typeof nextAddress !== 'string' || !isAddress(nextAddress)) {
            void disconnect()
            return
          }
          setSnapshot((current) =>
            current.status === 'connected'
              ? { status: 'connected', session: { ...current.session, address: nextAddress } }
              : current,
          )
        }
        const onChain = (next: unknown) => {
          setSnapshot((current) => {
            if (current.status !== 'connected') return current
            try {
              return {
                status: 'connected',
                session: { ...current.session, chainId: parseChainId(next) },
              }
            } catch {
              return current
            }
          })
        }

        provider.on?.('accountsChanged', onAccounts)
        provider.on?.('chainChanged', onChain)
        accountsListener.current = onAccounts
        chainListener.current = onChain
        providerRef.current = provider
        setSnapshot({ status: 'connected', session })
      } catch (error) {
        const rejected =
          typeof error === 'object' && error !== null && 'code' in error && error.code === 4001
        setSnapshot({
          status: 'error',
          message: rejected
            ? 'Connection cancelled.'
            : error instanceof Error
              ? error.message
              : 'Could not connect the wallet.',
        })
      }
    },
    [clearListeners, disconnect],
  )

  const value = useMemo(
    () => ({ snapshot, connect, disconnect }),
    [snapshot, connect, disconnect],
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
