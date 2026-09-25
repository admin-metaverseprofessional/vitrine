import { NavLink, Outlet } from 'react-router-dom'
import { useWallet } from '../modules/wallet/WalletProvider'
import { walletKindLabel } from '../modules/wallet/types'

function walletLabel(snapshot: ReturnType<typeof useWallet>['snapshot']) {
  if (snapshot.status === 'connected') {
    const address = snapshot.session.address
    const short = `${address.slice(0, 6)}…${address.slice(-4)}`
    return `${walletKindLabel[snapshot.session.kind]} · ${short}`
  }
  if (snapshot.status === 'connecting') {
    return `Connecting ${walletKindLabel[snapshot.kind]}…`
  }
  if (snapshot.status === 'error') {
    return 'Wallet error'
  }
  return 'Not connected'
}

export function Shell() {
  const { snapshot } = useWallet()

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
        <p className={`wallet-chip status-${snapshot.status}`}>{walletLabel(snapshot)}</p>
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
