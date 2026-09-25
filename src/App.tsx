import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { WalletProvider } from './modules/wallet/WalletProvider'
import { GalleryPage } from './pages/GalleryPage'
import { HomePage } from './pages/HomePage'

export function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<HomePage />} />
            <Route path="gallery" element={<GalleryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  )
}
