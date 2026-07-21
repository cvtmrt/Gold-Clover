import { Routes, Route } from 'react-router-dom'
import PortalPage from './pages/PortalPage.jsx'
import OrganizasyonPage from './pages/OrganizasyonPage.jsx'
import KuaforPage from './pages/KuaforPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortalPage />} />
      <Route path="/organizasyon" element={<OrganizasyonPage />} />
      <Route path="/kuafor" element={<KuaforPage />} />
      {/* Bilinmeyen yollar portala */}
      <Route path="*" element={<PortalPage />} />
    </Routes>
  )
}
