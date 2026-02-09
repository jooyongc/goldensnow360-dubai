import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, MapPin, Phone, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [footer, setFooter] = useState({
    description: 'Premier Dubai real estate brokerage with immersive Matterport 3D virtual tours.',
    areas: ['Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'Business Bay', 'JBR'],
    copyright: 'Golden Snow 360. All rights reserved.',
    privacy_url: '',
    terms_url: '',
  })
  const [contact, setContact] = useState({
    address: 'Downtown Dubai, UAE',
    phone: '+971 4 123 4567',
    email: 'info@goldensnow360.com',
  })
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location])

  useEffect(() => {
    async function fetchFooter() {
      try {
        const [settingsRes, contactRes] = await Promise.all([
          supabase.from('site_settings').select('*'),
          supabase.from('contact_info').select('address, phone, email').eq('is_active', true).single()
        ])

        if (settingsRes.data) {
          const map = {}
          settingsRes.data.forEach(s => { map[s.key] = s.value })
          setFooter(prev => ({
            description: map.footer_description || prev.description,
            areas: map.footer_areas ? map.footer_areas.split(',').map(a => a.trim()).filter(Boolean) : prev.areas,
            copyright: map.footer_copyright || prev.copyright,
            privacy_url: map.footer_privacy_url || '',
            terms_url: map.footer_terms_url || '',
          }))
        }

        if (contactRes.data) {
          setContact({
            address: contactRes.data.address || contact.address,
            phone: contactRes.data.phone || contact.phone,
            email: contactRes.data.email || contact.email,
          })
        }
      } catch (e) { console.error(e) }
    }
    fetchFooter()
  }, [])

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/vr-room', label: 'VR Room' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dubai-dark/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                <span className="text-dubai-dark font-bold text-lg">G</span>
              </div>
              <div>
                <div className="text-white font-display font-bold text-lg leading-tight">Golden Snow 360</div>
                <div className="text-gold-400 text-xs tracking-wider">DUBAI REAL ESTATE</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    location.pathname === item.to
                      ? 'text-gold-400'
                      : 'text-white/80 hover:text-gold-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/vr-room" className="btn-primary text-sm py-2 px-5">
                Explore VR Tours
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden bg-dubai-dark/98 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block text-lg font-medium ${
                    location.pathname === item.to ? 'text-gold-400' : 'text-white/80'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/vr-room" className="btn-primary block text-center mt-4">
                Explore VR Tours
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dubai-navy border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                  <span className="text-dubai-dark font-bold text-lg">G</span>
                </div>
                <div>
                  <div className="text-white font-display font-bold text-lg">Golden Snow 360</div>
                </div>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed">
                {footer.description}
              </p>
            </div>

            <div>
              <h4 className="text-gold-400 font-semibold mb-4 text-sm tracking-wider">NAVIGATION</h4>
              <div className="space-y-3">
                {navItems.map(item => (
                  <Link key={item.to} to={item.to} className="block text-white/60 hover:text-gold-400 text-sm transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-gold-400 font-semibold mb-4 text-sm tracking-wider">AREAS</h4>
              <div className="space-y-3">
                {footer.areas.map(area => (
                  <Link key={area} to={`/vr-room?area=${encodeURIComponent(area)}`} className="block text-white/60 hover:text-gold-400 text-sm transition-colors">
                    {area}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-gold-400 font-semibold mb-4 text-sm tracking-wider">CONTACT</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <MapPin size={14} className="text-gold-400 flex-shrink-0" />
                  {contact.address}
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Phone size={14} className="text-gold-400 flex-shrink-0" />
                  {contact.phone}
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Mail size={14} className="text-gold-400 flex-shrink-0" />
                  {contact.email}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} {footer.copyright}
            </p>
            <div className="flex gap-6">
              <a href={footer.privacy_url || '#'} className="text-white/40 hover:text-gold-400 text-sm transition-colors">Privacy Policy</a>
              <a href={footer.terms_url || '#'} className="text-white/40 hover:text-gold-400 text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
