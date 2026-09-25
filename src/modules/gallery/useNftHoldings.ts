import { useWallet } from '../wallet/WalletProvider'
import type { NftHolding } from './types'

export type NftHoldingsResult = {
  holdings: NftHolding[]
  ready: boolean
}

/**
 * Foundation stub. Returns an empty cabinet until a wallet session exists.
 * The nft-holdings module fills `holdings` for the connected address.
 */
export function useNftHoldings(): NftHoldingsResult {
  const { snapshot } = useWallet()

  if (snapshot.status !== 'connected') {
    return { holdings: [], ready: false }
  }

  return { holdings: [], ready: true }
}
