import { Link } from 'react-router-dom'
import { supportedChains } from '../shared/chains'

const modules = [
  {
    id: 'foundation',
    name: 'Foundation',
    status: 'In this repo',
    summary: 'App shell, routes, chain list, and the contracts later modules implement.',
  },
  {
    id: 'wallet-connect',
    name: 'Wallet connect',
    status: 'In this repo',
    summary: 'Connect MetaMask or Coinbase Wallet, show the address, and disconnect.',
  },
  {
    id: 'nft-holdings',
    name: 'NFT holdings',
    status: 'Later',
    summary: 'Load the NFTs held by the connected address on the supported chains.',
  },
  {
    id: 'gallery',
    name: 'Gallery',
    status: 'Later',
    summary: 'Present those holdings: image, name, collection, and chain.',
  },
]

export function HomePage() {
  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">Wallet NFT cabinet</p>
        <h1>Every NFT you hold, in one vitrine.</h1>
        <p className="lede">
          Connect MetaMask or Coinbase Wallet and see the tokens that wallet holds.
          This repository is the foundation. Connection, loading, and the gallery
          each land as their own module.
        </p>
        <div className="hero-actions">
          <Link className="button" to="/gallery">
            Open the gallery
          </Link>
          <a className="text-link" href="https://github.com/admin-metaverseprofessional">
            Project owner
          </a>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Modules</h2>
          <p>Each module after the foundation is sized for one issue and one bounty.</p>
        </div>
        <ol className="module-list">
          {modules.map((module, index) => (
            <li key={module.id}>
              <span className="module-index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <div className="module-title">
                  <h3>{module.name}</h3>
                  <span className={`badge badge-${module.id}`}>{module.status}</span>
                </div>
                <p>{module.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Chains</h2>
          <p>The holdings module will read these networks. The list lives in the foundation.</p>
        </div>
        <ul className="chain-list">
          {supportedChains.map((chain) => (
            <li key={chain.id}>
              <span>{chain.shortName}</span>
              <strong>{chain.name}</strong>
              <em>{chain.id}</em>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
