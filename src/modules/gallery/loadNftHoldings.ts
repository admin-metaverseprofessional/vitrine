import { supportedChains } from '../../shared/chains'
import type { NftHolding } from './types'

const PAGE_LIMIT = 6

const nftApiHost: Record<number, string> = {
  1: 'eth.blockscout.com',
  8453: 'base.blockscout.com',
  137: 'polygon.blockscout.com',
  42161: 'arbitrum.blockscout.com',
  10: 'optimism.blockscout.com',
}

type PageParams = Record<string, string | number>

type BlockscoutItem = {
  id?: string
  image_url?: string | null
  metadata?: { name?: string; image?: string } | null
  token?: {
    address_hash?: string
    name?: string | null
    symbol?: string | null
  } | null
}

type BlockscoutPage = {
  items?: BlockscoutItem[]
  next_page_params?: PageParams | null
}

export type LoadedHoldings = {
  holdings: NftHolding[]
  partial: boolean
}

function isAddress(value: string): value is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(value)
}

function imageUrl(item: BlockscoutItem): string | null {
  const raw = item.image_url || item.metadata?.image || null
  if (!raw) return null
  if (raw.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${raw.slice('ipfs://'.length)}`
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  return null
}

export function toHolding(chainId: number, item: BlockscoutItem): NftHolding | null {
  const contract = item.token?.address_hash
  const tokenId = item.id
  if (!contract || !isAddress(contract) || !tokenId) return null

  const collection = item.token?.name || item.token?.symbol || 'Unknown collection'
  const name = item.metadata?.name || `${collection} #${tokenId}`

  return {
    id: `${chainId}:${contract.toLowerCase()}:${tokenId}`,
    contract,
    tokenId,
    name,
    collection,
    imageUrl: imageUrl(item),
    chainId,
  }
}

async function loadChain(chainId: number, address: string): Promise<{ holdings: NftHolding[]; partial: boolean }> {
  const host = nftApiHost[chainId]
  if (!host) return { holdings: [], partial: true }

  const holdings: NftHolding[] = []
  let next: PageParams | null = null
  let pages = 0

  do {
    const url = new URL(`https://${host}/api/v2/addresses/${address}/nft`)
    url.searchParams.set('type', 'ERC-721,ERC-1155')
    if (next) {
      for (const [key, value] of Object.entries(next)) {
        url.searchParams.set(key, String(value))
      }
    }

    const response = await fetch(url)
    if (!response.ok) throw new Error(`${host} returned ${response.status}`)
    const page = (await response.json()) as BlockscoutPage
    for (const item of page.items ?? []) {
      const holding = toHolding(chainId, item)
      if (holding) holdings.push(holding)
    }
    next = page.next_page_params ?? null
    pages += 1
  } while (next && pages < PAGE_LIMIT)

  return { holdings, partial: Boolean(next) }
}

export async function loadNftHoldings(address: string): Promise<LoadedHoldings> {
  const results = await Promise.all(
    supportedChains.map(async (chain) => {
      try {
        return await loadChain(chain.id, address)
      } catch {
        return { holdings: [] as NftHolding[], partial: true, failed: true }
      }
    }),
  )

  const failedEveryChain = results.every((result) => 'failed' in result && result.failed)
  if (failedEveryChain) {
    throw new Error('NFT indexes could not be reached.')
  }

  return {
    holdings: results.flatMap((result) => result.holdings),
    partial: results.some((result) => result.partial),
  }
}
