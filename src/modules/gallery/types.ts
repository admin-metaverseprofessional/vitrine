export type NftHolding = {
  id: string
  contract: `0x${string}`
  tokenId: string
  name: string
  collection: string
  imageUrl: string | null
  chainId: number
}
