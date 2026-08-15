import { Routes, Route } from 'react-router-dom'
import PortalPage from './pages/PortalPage.jsx'
import OrganizasyonPage from './pages/OrganizasyonPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import KuaforPage from './pages/KuaforPage.jsx'
import BolgelerPage from './pages/BolgelerPage.jsx'
import BolgePage from './pages/BolgePage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortalPage />} />
      <Route path="/organizasyon" element={<OrganizasyonPage />} />
      {/* Bölge listesi, /:slug'tan ÖNCE tanımlı olmalı. */}
      <Route path="/organizasyon/bolgeler" element={<BolgelerPage />} />
      <Route path="/organizasyon/:slug" element={<BolgePage />} />
      <Route path="/urunler" element={<ProductsPage />} />
      <Route path="/kuafor" element={<KuaforPage />} />
      {/* Bilinmeyen yollar portala */}
      <Route path="*" element={<PortalPage />} />
    </Routes>
  )
}
