import { NavLink, Outlet } from 'react-router-dom'
import { useWallet } from '../modules/wallet/WalletProvider'
import { walletKindLabel, type WalletKind } from '../modules/wallet/types'
import { chainName } from '../shared/chains'
import { studioContacts, studioUrl } from '../shared/studio'

function walletLabel(snapshot: ReturnType<typeof useWallet>['snapshot']) {
  if (snapshot.status === 'connected') {
    const address = snapshot.session.address
    const short = `${address.slice(0, 6)}…${address.slice(-4)}`
    return `${walletKindLabel[snapshot.session.kind]} · ${short} · ${chainName(snapshot.session.chainId)}`
  }
  if (snapshot.status === 'connecting') {
    return `Connecting ${walletKindLabel[snapshot.kind]}…`
  }
  if (snapshot.status === 'error') {
    return snapshot.message
  }
  return 'Not connected'
}

export function Shell() {
  const { snapshot, connect, disconnect } = useWallet()
  const busy = snapshot.status === 'connecting'
  const showConnect = snapshot.status === 'disconnected' || snapshot.status === 'error'

  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to="/" className="brand" end>
          <img src="/logo.jpg" alt="Metaverse Professional" />
          <span>
            <strong>Metaverse Professional</strong>
            <em>Vitrine</em>
          </span>
        </NavLink>
        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <a href="/#find-us">Find Us</a>
          <a href="/#contact">Contact</a>
        </nav>
        <div className="wallet-slot">
          {showConnect
            ? (['metamask', 'coinbase'] as WalletKind[]).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  className="wallet-button"
                  disabled={busy}
                  onClick={() => {
                    void connect(kind)
                  }}
                >
                  {walletKindLabel[kind]}
                </button>
              ))
            : null}
          <p className={`wallet-chip status-${snapshot.status}`}>{walletLabel(snapshot)}</p>
          {snapshot.status === 'connected' ? (
            <button
              type="button"
              className="wallet-button"
              onClick={() => {
                void disconnect()
              }}
            >
              Disconnect
            </button>
          ) : null}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <p>Smarter systems. Faster growth.</p>
        <ul>
          {studioContacts.map((contact) => (
            <li key={contact.name}>
              <a href={contact.href}>{contact.name}</a>
            </li>
          ))}
          <li>
            <a href={studioUrl}>Request Info / Book a Call</a>
          </li>
        </ul>
      </footer>
    </div>
  )
}
