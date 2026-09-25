import { supportedChains } from '../shared/chains'
import { useNftHoldings } from '../modules/gallery/useNftHoldings'
import { useWallet } from '../modules/wallet/WalletProvider'

export function GalleryPage() {
  const { snapshot } = useWallet()
  const { holdings, ready } = useNftHoldings()

  return (
    <div className="page">
      <section className="hero hero-compact">
        <p className="eyebrow">Gallery</p>
        <h1>The cabinet is empty.</h1>
        <p className="lede">
          {snapshot.status === 'connected'
            ? 'A wallet is connected. Holdings will appear here once the NFT module loads them.'
            : 'Connect MetaMask or Coinbase Wallet to show the NFTs that address holds. Connection is the next module.'}
        </p>
      </section>

      {ready && holdings.length === 0 ? (
        <section className="empty-cabinet">
          <p>No NFTs loaded for this session yet.</p>
        </section>
      ) : (
        <section className="empty-cabinet">
          <p>Waiting for a wallet session.</p>
          <ul className="chain-list">
            {supportedChains.map((chain) => (
              <li key={chain.id}>
                <span>{chain.shortName}</span>
                <strong>{chain.name}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
