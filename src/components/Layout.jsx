import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Youtube, Send } from 'lucide-react'
import { db } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

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
        const [settingsSnap, contactSnap] = await Promise.all([
          getDoc(doc(db, 'site_settings', 'config')),
          getDoc(doc(db, 'contact_info', 'main'))
        ])

        if (settingsSnap.exists()) {
          const data = settingsSnap.data()
          setFooter(prev => ({
            description: data.footer_description || prev.description,
            areas: data.footer_areas ? data.footer_areas.split(',').map(a => a.trim()).filter(Boolean) : prev.areas,
            copyright: data.footer_copyright || prev.copyright,
            privacy_url: data.footer_privacy_url || '',
            terms_url: data.footer_terms_url || '',
          }))
        }

        if (contactSnap.exists()) {
          const data = contactSnap.data()
          setContact(prev => ({
            address: data.address || prev.address,
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
          }))
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
    <div className="min-h-screen flex flex-col bg-bg-dark">
      {/* Floating Pill Navigation */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
        <div className={`glass-panel rounded-full px-4 sm:px-6 py-3 transition-all duration-500 ${
          scrolled ? 'shadow-2xl shadow-primary/10' : ''
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-bg-dark text-lg">ac_unit</span>
              </div>
              <span className="text-white font-bold text-sm sm:text-base tracking-tight hidden sm:block">
                Golden Snow <span className="text-gradient-gold">360</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 ${
                    location.pathname === item.to
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/vr-room" className="bg-primary hover:bg-primary-light text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/25">
                Explore VR
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white/70 p-2 hover:text-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden glass-panel rounded-3xl mt-2 p-5 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`block text-base font-medium px-4 py-3 rounded-2xl transition-all ${
                  location.pathname === item.to
                    ? 'text-white bg-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/vr-room" className="btn-primary block text-center mt-3 text-sm">
              Explore VR
            </Link>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#050507] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand + Social */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-bg-dark text-lg">ac_unit</span>
                </div>
                <span className="text-white font-bold tracking-tight">
                  Golden Snow <span className="text-gradient-gold">360</span>
                </span>
              </Link>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                {footer.description}
              </p>
              <div className="flex gap-3">
                {[
                  { icon: <Instagram size={16} />, href: '#' },
                  { icon: <Facebook size={16} />, href: '#' },
                  { icon: <Linkedin size={16} />, href: '#' },
                  { icon: <Youtube size={16} />, href: '#' },
                ].map((s, i) => (
                  <a key={i} href={s.href} className="w-9 h-9 rounded-full bg-white/5 border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-white/30 font-semibold mb-5 text-xs tracking-[0.2em] uppercase">Navigation</h4>
              <div className="space-y-3">
                {navItems.map(item => (
                  <Link key={item.to} to={item.to} className="block text-white/50 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Areas */}
            <div>
              <h4 className="text-white/30 font-semibold mb-5 text-xs tracking-[0.2em] uppercase">Areas</h4>
              <div className="space-y-3">
                {footer.areas.map(area => (
                  <Link key={area} to={`/vr-room?area=${encodeURIComponent(area)}`} className="block text-white/50 hover:text-white text-sm transition-colors">
                    {area}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white/30 font-semibold mb-5 text-xs tracking-[0.2em] uppercase">Newsletter</h4>
              <p className="text-white/40 text-sm mb-4">Stay updated with the latest properties and VR tours.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/5 border border-white/[0.06] rounded-full px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button className="bg-primary hover:bg-primary-light text-white p-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-primary/25">
                  <Send size={16} />
                </button>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <MapPin size={12} className="flex-shrink-0" />
                  {contact.address}
                </div>
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Phone size={12} className="flex-shrink-0" />
                  {contact.phone}
                </div>
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Mail size={12} className="flex-shrink-0" />
                  {contact.email}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.04] mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/25 text-xs">
              &copy; {new Date().getFullYear()} {footer.copyright}
            </p>
            <div className="flex gap-6">
              <a href={footer.privacy_url || '#'} className="text-white/25 hover:text-white/50 text-xs transition-colors">Privacy Policy</a>
              <a href={footer.terms_url || '#'} className="text-white/25 hover:text-white/50 text-xs transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
