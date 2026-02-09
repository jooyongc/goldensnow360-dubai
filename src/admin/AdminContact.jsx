import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { supabase, DEMO_MODE, demoContactInfo } from '../lib/supabase'

export default function AdminContact() {
  const [contact, setContact] = useState({
    address: demoContactInfo.address,
    phone: demoContactInfo.phone,
    email: demoContactInfo.email,
    whatsapp: demoContactInfo.whatsapp,
    working_hours: demoContactInfo.working_hours,
    map_lat: demoContactInfo.map_lat,
    map_lng: demoContactInfo.map_lng,
    social_instagram: demoContactInfo.social.instagram,
    social_facebook: demoContactInfo.social.facebook,
    social_linkedin: demoContactInfo.social.linkedin,
    social_youtube: demoContactInfo.social.youtube,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function fetch() {
      if (DEMO_MODE) return
      try {
        const { data } = await supabase.from('contact_info').select('*').eq('is_active', true).single()
        if (data) setContact(data)
      } catch (e) { console.error(e) }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    if (!DEMO_MODE) {
      try {
        if (contact.id) {
          await supabase.from('contact_info').update({
            ...contact, updated_at: new Date().toISOString()
          }).eq('id', contact.id)
        } else {
          await supabase.from('contact_info').insert([contact])
        }
      } catch (e) { console.error(e) }
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-display text-3xl font-bold mb-2">Contact Info</h1>
          <p className="text-white/60">Edit contact page information</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="admin-btn flex items-center gap-2 disabled:opacity-50">
          <Save size={18} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold text-lg mb-6">Basic Information</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-white/60 text-sm mb-2">Office Address</label>
              <textarea rows={2} value={contact.address || ''} onChange={e => setContact({ ...contact, address: e.target.value })} className="admin-input resize-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/60 text-sm mb-2">Phone</label>
                <input value={contact.phone || ''} onChange={e => setContact({ ...contact, phone: e.target.value })} className="admin-input" />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Email</label>
                <input value={contact.email || ''} onChange={e => setContact({ ...contact, email: e.target.value })} className="admin-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/60 text-sm mb-2">WhatsApp Number</label>
                <input value={contact.whatsapp || ''} onChange={e => setContact({ ...contact, whatsapp: e.target.value })} className="admin-input" placeholder="+971501234567" />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Working Hours</label>
                <input value={contact.working_hours || ''} onChange={e => setContact({ ...contact, working_hours: e.target.value })} className="admin-input" />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-white font-semibold text-lg mb-6">Map Location</h2>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-white/60 text-sm mb-2">Latitude</label>
              <input type="number" step="any" value={contact.map_lat || ''} onChange={e => setContact({ ...contact, map_lat: parseFloat(e.target.value) || 0 })} className="admin-input" />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Longitude</label>
              <input type="number" step="any" value={contact.map_lng || ''} onChange={e => setContact({ ...contact, map_lng: parseFloat(e.target.value) || 0 })} className="admin-input" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-white font-semibold text-lg mb-6">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-white/60 text-sm mb-2">Instagram</label>
              <input value={contact.social_instagram || ''} onChange={e => setContact({ ...contact, social_instagram: e.target.value })} className="admin-input" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Facebook</label>
              <input value={contact.social_facebook || ''} onChange={e => setContact({ ...contact, social_facebook: e.target.value })} className="admin-input" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">LinkedIn</label>
              <input value={contact.social_linkedin || ''} onChange={e => setContact({ ...contact, social_linkedin: e.target.value })} className="admin-input" placeholder="https://linkedin.com/..." />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">YouTube</label>
              <input value={contact.social_youtube || ''} onChange={e => setContact({ ...contact, social_youtube: e.target.value })} className="admin-input" placeholder="https://youtube.com/..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
