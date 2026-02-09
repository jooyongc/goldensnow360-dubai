import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import VRRoomPage from './pages/VRRoomPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import ContactPage from './pages/ContactPage'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="vr-room" element={<VRRoomPage />} />
        <Route path="property/:id" element={<PropertyDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App
