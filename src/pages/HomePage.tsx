import { Link } from 'react-router-dom'
import { supportedChains } from '../shared/chains'
import { studioContacts, studioUrl } from '../shared/studio'

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
    status: 'In this repo',
    summary: 'Load the NFTs held by the connected address on the supported chains.',
  },
  {
    id: 'gallery',
    name: 'Gallery',
    status: 'In this repo',
    summary: 'Present those holdings: image, name, collection, and chain.',
  },
]

export function HomePage() {
  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">Metaverse Professional</p>
        <h1>Smarter systems. Faster growth.</h1>
        <p className="lede">
          Vitrine is the studio portfolio for the NFTs Metaverse Professional holds.
          Connect MetaMask or Coinbase Wallet and open the cabinet.
        </p>
        <div className="hero-actions">
          <Link className="button" to="/gallery">
            Open the gallery
          </Link>
          <a className="text-link" href={studioUrl}>
            Request Info / Book a Call
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

      <section className="panel" id="find-us">
        <div className="section-head">
          <h2>Find Us</h2>
          <p>Same places as the Metaverse Professional site.</p>
        </div>
        <ul className="chain-list">
          {studioContacts.map((contact) => (
            <li key={contact.name}>
              <span>{contact.detail}</span>
              <a href={contact.href}>
                <strong>{contact.name}</strong>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel" id="contact">
        <div className="section-head">
          <h2>Contact</h2>
          <p>Tell the studio about the work. The call books on the Metaverse Professional site.</p>
        </div>
        <a className="button" href={studioUrl}>
          Request Info / Book a Call
        </a>
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
