import { useState, useEffect } from 'react'
import { Save, Plus, X, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminFooter() {
  const [footer, setFooter] = useState({
    description: '',
    areas: '',
    copyright: '',
    privacy_url: '',
    terms_url: '',
  })
  const [contact, setContact] = useState({
    address: '',
    phone: '',
    email: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch footer settings
        const { data: settings } = await supabase.from('site_settings').select('*')
        if (settings) {
          const map = {}
          settings.forEach(s => { map[s.key] = s.value })
          setFooter({
            description: map.footer_description || 'Premier Dubai real estate brokerage with immersive Matterport 3D virtual tours.',
            areas: map.footer_areas || 'Palm Jumeirah, Downtown Dubai, Dubai Marina, Business Bay, JBR',
            copyright: map.footer_copyright || 'Golden Snow 360. All rights reserved.',
            privacy_url: map.footer_privacy_url || '',
            terms_url: map.footer_terms_url || '',
          })
        }

        // Fetch contact info for footer
        const { data: contactData } = await supabase
          .from('contact_info').select('address, phone, email')
          .eq('is_active', true).single()
        if (contactData) {
          setContact({
            address: contactData.address || '',
            phone: contactData.phone || '',
            email: contactData.email || '',
          })
        }
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const entries = [
        { key: 'footer_description', value: footer.description, type: 'text' },
        { key: 'footer_areas', value: footer.areas, type: 'text' },
        { key: 'footer_copyright', value: footer.copyright, type: 'text' },
        { key: 'footer_privacy_url', value: footer.privacy_url, type: 'text' },
        { key: 'footer_terms_url', value: footer.terms_url, type: 'text' },
      ]

      for (const entry of entries) {
        await supabase.from('site_settings')
          .upsert({ key: entry.key, value: entry.value, type: entry.type, updated_at: new Date().toISOString() },
            { onConflict: 'key' })
      }

      // Update contact info
      const { data: existing } = await supabase.from('contact_info').select('id').eq('is_active', true).single()
      if (existing) {
        await supabase.from('contact_info')
          .update({ address: contact.address, phone: contact.phone, email: contact.email, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const areasList = footer.areas.split(',').map(a => a.trim()).filter(Boolean)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-display text-3xl font-bold mb-2">Footer</h1>
          <p className="text-white/60">Manage footer content displayed on all pages</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="admin-btn flex items-center gap-2">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saved && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-6">
          <p className="text-green-400 text-sm">Footer updated successfully!</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Company Description */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Company Description</h2>
          <textarea
            rows={3}
            value={footer.description}
            onChange={e => setFooter({ ...footer, description: e.target.value })}
            className="admin-input resize-none"
            placeholder="Short description about the company..."
          />
        </div>

        {/* Contact Info in Footer */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-white/60 text-sm mb-2">Address</label>
              <input
                value={contact.address}
                onChange={e => setContact({ ...contact, address: e.target.value })}
                className="admin-input"
                placeholder="Office address..."
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Phone</label>
              <input
                value={contact.phone}
                onChange={e => setContact({ ...contact, phone: e.target.value })}
                className="admin-input"
                placeholder="+971 4 123 4567"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Email</label>
              <input
                value={contact.email}
                onChange={e => setContact({ ...contact, email: e.target.value })}
                className="admin-input"
                placeholder="info@company.com"
              />
            </div>
          </div>
        </div>

        {/* Areas */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Areas</h2>
          <p className="text-white/40 text-sm mb-3">Comma-separated list of areas shown in the footer</p>
          <input
            value={footer.areas}
            onChange={e => setFooter({ ...footer, areas: e.target.value })}
            className="admin-input"
            placeholder="Palm Jumeirah, Downtown Dubai, Dubai Marina..."
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {areasList.map((area, i) => (
              <span key={i} className="bg-gold-500/10 text-gold-400 text-xs px-3 py-1 rounded-full">{area}</span>
            ))}
          </div>
        </div>

        {/* Copyright & Links */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Copyright & Links</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-white/60 text-sm mb-2">Copyright Text</label>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-sm">&copy; {new Date().getFullYear()}</span>
                <input
                  value={footer.copyright}
                  onChange={e => setFooter({ ...footer, copyright: e.target.value })}
                  className="admin-input flex-1"
                  placeholder="Company Name. All rights reserved."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/60 text-sm mb-2">Privacy Policy URL</label>
                <input
                  value={footer.privacy_url}
                  onChange={e => setFooter({ ...footer, privacy_url: e.target.value })}
                  className="admin-input"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Terms of Service URL</label>
                <input
                  value={footer.terms_url}
                  onChange={e => setFooter({ ...footer, terms_url: e.target.value })}
                  className="admin-input"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
