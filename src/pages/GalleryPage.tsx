import { chainName, supportedChains } from '../shared/chains'
import { useNftHoldings } from '../modules/gallery/useNftHoldings'
import { useWallet } from '../modules/wallet/WalletProvider'

export function GalleryPage() {
  const { snapshot } = useWallet()
  const { holdings, ready, error, partial } = useNftHoldings()
  const connected = snapshot.status === 'connected'

  return (
    <div className="page">
      <section className="hero hero-compact">
        <p className="eyebrow">Gallery</p>
        <h1>{connected && ready && holdings.length === 0 && !error ? 'The cabinet is empty.' : 'The cabinet.'}</h1>
        <p className="lede">
          {connected
            ? 'NFTs held by the connected address on Ethereum, Base, Polygon, Arbitrum, and Optimism.'
            : 'Connect MetaMask or Coinbase Wallet to show the NFTs that address holds.'}
        </p>
      </section>

      {!connected ? (
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
      ) : null}

      {connected && !ready ? (
        <section className="empty-cabinet">
          <p>Loading NFTs…</p>
        </section>
      ) : null}

      {connected && ready && error ? (
        <section className="empty-cabinet">
          <p>{error}</p>
        </section>
      ) : null}

      {connected && ready && !error && holdings.length === 0 ? (
        <section className="empty-cabinet">
          <p>The cabinet is empty.</p>
        </section>
      ) : null}

      {connected && ready && holdings.length > 0 ? (
        <section>
          {partial ? <p className="lede">Showing the first pages from each chain.</p> : null}
          <ul className="nft-grid">
            {holdings.map((holding) => (
              <li key={holding.id} className="nft-card">
                {holding.imageUrl ? (
                  <img src={holding.imageUrl} alt="" />
                ) : (
                  <div className="nft-fallback" aria-hidden="true" />
                )}
                <div>
                  <span>{chainName(holding.chainId)}</span>
                  <strong>{holding.name}</strong>
                  <em>{holding.collection}</em>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
