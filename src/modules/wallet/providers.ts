import { createCoinbaseWalletSDK, type ProviderInterface } from '@coinbase/wallet-sdk'
import { supportedChains } from '../../shared/chains'

export type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>
  on?: (event: string, listener: (...args: unknown[]) => void) => void
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void
  disconnect?: () => Promise<void>
  isMetaMask?: boolean
  isCoinbaseWallet?: boolean
  providers?: Eip1193Provider[]
}

type AnnouncedProvider = {
  info: { rdns?: string }
  provider: Eip1193Provider
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider
  }
}

let coinbaseProvider: ProviderInterface | null = null

export function asEip1193(provider: {
  request: (args: { method: string; params?: readonly unknown[] | object }) => Promise<unknown>
  disconnect?: () => Promise<void>
}): Eip1193Provider {
  const source = provider as Eip1193Provider
  return {
    request: (args) => source.request(args),
    on: source.on?.bind(source),
    removeListener: source.removeListener?.bind(source),
    disconnect: source.disconnect?.bind(source),
  }
}

export function getCoinbaseProvider(): ProviderInterface {
  if (!coinbaseProvider) {
    const sdk = createCoinbaseWalletSDK({
      appName: 'Vitrine',
      appLogoUrl: null,
      appChainIds: supportedChains.map((chain) => chain.id),
    })
    coinbaseProvider = sdk.getProvider()
  }
  return coinbaseProvider
}

export function findMetaMask(): Promise<Eip1193Provider | null> {
  return new Promise((resolve) => {
    const announced: AnnouncedProvider[] = []
    const onAnnounce = (event: Event) => {
      const detail = (event as CustomEvent<AnnouncedProvider>).detail
      if (detail?.provider) announced.push(detail)
    }

    window.addEventListener('eip6963:announceProvider', onAnnounce)
    window.dispatchEvent(new Event('eip6963:requestProvider'))

    window.setTimeout(() => {
      window.removeEventListener('eip6963:announceProvider', onAnnounce)
      const discovered = announced.find((item) => item.info.rdns === 'io.metamask')?.provider
      if (discovered) {
        resolve(discovered)
        return
      }

      const injected = window.ethereum
      if (!injected) {
        resolve(null)
        return
      }

      const candidates = injected.providers ?? [injected]
      resolve(candidates.find((provider) => provider.isMetaMask && !provider.isCoinbaseWallet) ?? null)
    }, 150)
  })
}
