import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Image, Building2, FileText, Phone, MessageSquare,
  Settings, LogOut, Menu, X, ChevronRight, Home
} from 'lucide-react'
import AdminHero from './AdminHero'
import AdminProperties from './AdminProperties'
import AdminAbout from './AdminAbout'
import AdminContact from './AdminContact'
import AdminMessages from './AdminMessages'

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}')

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) {
      navigate('/admin')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/admin')
  }

  const menuItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/dashboard/hero', icon: <Image size={20} />, label: 'Hero Sections' },
    { path: '/admin/dashboard/properties', icon: <Building2 size={20} />, label: 'Properties' },
    { path: '/admin/dashboard/about', icon: <FileText size={20} />, label: 'About Page' },
    { path: '/admin/dashboard/contact', icon: <Phone size={20} />, label: 'Contact Info' },
    { path: '/admin/dashboard/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
  ]

  return (
    <div className="min-h-screen bg-dubai-dark flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dubai-navy border-r border-white/10 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                <span className="text-dubai-dark font-bold">G</span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Admin Panel</div>
                <div className="text-gold-400 text-xs">{adminUser.display_name || 'Admin'}</div>
              </div>
            </div>
            <button className="lg:hidden text-white/60" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-gold-500/20 text-gold-400'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Home size={20} />
            View Website
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="bg-dubai-navy/50 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <button
            className="lg:hidden text-white/60"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>
          <div className="text-white/60 text-sm flex items-center gap-2">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span className="text-gold-400">
              {menuItems.find(m => m.path === location.pathname)?.label || 'Dashboard'}
            </span>
          </div>
          <div />
        </div>

        {/* Page content */}
        <div className="p-6">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="hero" element={<AdminHero />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="messages" element={<AdminMessages />} />
          </Routes>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

function DashboardOverview() {
  return (
    <div>
      <h1 className="text-white font-display text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-white/60 mb-8">Welcome to the Golden Snow 360 admin panel</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Properties', value: '5', icon: <Building2 size={24} />, color: 'text-blue-400' },
          { label: 'VR Tours', value: '5', icon: <Image size={24} />, color: 'text-green-400' },
          { label: 'Messages', value: '0', icon: <MessageSquare size={24} />, color: 'text-yellow-400' },
          { label: 'Page Views', value: '-', icon: <LayoutDashboard size={24} />, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <div className={`${stat.color} mb-3`}>{stat.icon}</div>
            <div className="text-white font-bold text-2xl mb-1">{stat.value}</div>
            <div className="text-white/50 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h2 className="text-white font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/dashboard/properties" className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4 hover:bg-gold-500/20 transition-colors">
            <Building2 className="text-gold-400 mb-2" size={20} />
            <div className="text-white font-medium text-sm">Add Property</div>
            <div className="text-white/40 text-xs">Add a new property with Matterport link</div>
          </Link>
          <Link to="/admin/dashboard/hero" className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4 hover:bg-gold-500/20 transition-colors">
            <Image className="text-gold-400 mb-2" size={20} />
            <div className="text-white font-medium text-sm">Edit Hero</div>
            <div className="text-white/40 text-xs">Update homepage hero section</div>
          </Link>
          <Link to="/admin/dashboard/messages" className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4 hover:bg-gold-500/20 transition-colors">
            <MessageSquare className="text-gold-400 mb-2" size={20} />
            <div className="text-white font-medium text-sm">View Messages</div>
            <div className="text-white/40 text-xs">Check contact form submissions</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
