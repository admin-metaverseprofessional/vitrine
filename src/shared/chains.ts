export type Chain = {
  id: number
  name: string
  shortName: string
}

/** Chains the holdings module will read. The foundation owns this list. */
export const supportedChains: Chain[] = [
  { id: 1, name: 'Ethereum', shortName: 'ETH' },
  { id: 8453, name: 'Base', shortName: 'BASE' },
  { id: 137, name: 'Polygon', shortName: 'POL' },
  { id: 42161, name: 'Arbitrum', shortName: 'ARB' },
  { id: 10, name: 'Optimism', shortName: 'OP' },
]
