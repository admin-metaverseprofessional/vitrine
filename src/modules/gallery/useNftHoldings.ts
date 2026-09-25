import { useEffect, useState } from 'react'
import { useWallet } from '../wallet/WalletProvider'
import { loadNftHoldings } from './loadNftHoldings'
import type { NftHolding } from './types'

export type NftHoldingsResult = {
  holdings: NftHolding[]
  ready: boolean
  error: string | null
  partial: boolean
}

export function useNftHoldings(): NftHoldingsResult {
  const { snapshot } = useWallet()
  const address = snapshot.status === 'connected' ? snapshot.session.address : null
  const [holdings, setHoldings] = useState<NftHolding[]>([])
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [partial, setPartial] = useState(false)

  useEffect(() => {
    if (!address) {
      setHoldings([])
      setReady(false)
      setError(null)
      setPartial(false)
      return
    }

    let cancelled = false
    setReady(false)
    setError(null)
    setPartial(false)

    loadNftHoldings(address)
      .then((loaded) => {
        if (cancelled) return
        setHoldings(loaded.holdings)
        setPartial(loaded.partial)
        setReady(true)
      })
      .catch((cause: unknown) => {
        if (cancelled) return
        setHoldings([])
        setError(cause instanceof Error ? cause.message : 'NFTs could not be loaded.')
        setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [address])

  return { holdings, ready, error, partial }
}
