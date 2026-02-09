import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Eye, EyeOff } from 'lucide-react'
import { supabase, DEMO_MODE } from '../lib/supabase'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (DEMO_MODE) {
      if (username === 'goldensnow360' && password === 'dubai360@!!') {
        localStorage.setItem('admin_token', 'demo_admin_session')
        localStorage.setItem('admin_user', JSON.stringify({ username, display_name: 'Admin' }))
        navigate('/admin/dashboard')
      } else {
        setError('Invalid username or password')
      }
      setLoading(false)
      return
    }

    try {
      const { data, error: dbError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password_hash', password)
        .single()

      if (dbError || !data) {
        setError('Invalid username or password')
      } else {
        localStorage.setItem('admin_token', data.id)
        localStorage.setItem('admin_user', JSON.stringify(data))
        navigate('/admin/dashboard')
      }
    } catch (e) {
      setError('Login failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dubai-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-dubai-dark font-bold text-2xl">G</span>
          </div>
          <h1 className="text-white font-display text-2xl font-bold">Admin Panel</h1>
          <p className="text-white/50 mt-2">Golden Snow 360 Management</p>
        </div>

        <form onSubmit={handleLogin} className="glass-card p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-5">
            <label className="block text-white/60 text-sm mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="admin-input pl-12"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-white/60 text-sm mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="admin-input pl-12 pr-12"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-white/30 text-sm mt-6">
          <a href="/" className="hover:text-gold-400 transition-colors">Back to Website</a>
        </p>
      </div>
    </div>
  )
}
