import { NavLink, Outlet } from 'react-router-dom'
import { useWallet } from '../modules/wallet/WalletProvider'
import { walletKindLabel, type WalletKind } from '../modules/wallet/types'
import { chainName } from '../shared/chains'

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
        <NavLink to="/" className="wordmark" end>
          Vitrine
        </NavLink>
        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
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
        <p>MetaMask and Coinbase Wallet. One cabinet for the NFTs they hold.</p>
      </footer>
    </div>
  )
}
