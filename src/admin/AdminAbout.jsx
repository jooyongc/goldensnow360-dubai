import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { db } from '../lib/firebase'
import { demoAboutContent } from '../lib/firebase'
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore'

export default function AdminAbout() {
  const [content, setContent] = useState({
    title: demoAboutContent.title,
    subtitle: demoAboutContent.subtitle,
    description: demoAboutContent.description,
    mission: demoAboutContent.mission,
    vision: demoAboutContent.vision,
    image: demoAboutContent.image,
  })
  const [stats, setStats] = useState(demoAboutContent.stats)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [aboutSnap, statsSnap] = await Promise.all([
          getDoc(doc(db, 'about_content', 'main')),
          getDocs(query(collection(db, 'about_stats'), orderBy('sort_order')))
        ])
        if (aboutSnap.exists()) setContent(aboutSnap.data())
        if (!statsSnap.empty) setStats(statsSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'about_content', 'main'), {
        title: content.title,
        subtitle: content.subtitle,
        description: content.description,
        mission: content.mission,
        vision: content.vision,
        image: content.image,
        is_active: true,
        updated_at: serverTimestamp()
      }, { merge: true })

      // Save stats
      for (let i = 0; i < stats.length; i++) {
        const stat = stats[i]
        const statId = stat.id || `stat_${i}`
        await setDoc(doc(db, 'about_stats', statId), {
          label: stat.label,
          value: stat.value,
          sort_order: i,
        }, { merge: true })
      }
    } catch (e) { console.error(e) }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const updateStat = (idx, field, value) => {
    const updated = [...stats]
    updated[idx] = { ...updated[idx], [field]: value }
    setStats(updated)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-display text-3xl font-bold mb-2">About Page</h1>
          <p className="text-white/60">Edit about page content</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="admin-btn flex items-center gap-2 disabled:opacity-50">
          <Save size={18} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold text-lg mb-6">Main Content</h2>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/60 text-sm mb-2">Title</label>
                <input value={content.title || ''} onChange={e => setContent({ ...content, title: e.target.value })} className="admin-input" />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Subtitle</label>
                <input value={content.subtitle || ''} onChange={e => setContent({ ...content, subtitle: e.target.value })} className="admin-input" />
              </div>
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Description</label>
              <textarea rows={6} value={content.description || ''} onChange={e => setContent({ ...content, description: e.target.value })} className="admin-input resize-none" />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Image URL</label>
              <input value={content.image || ''} onChange={e => setContent({ ...content, image: e.target.value })} className="admin-input" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-white font-semibold text-lg mb-6">Mission & Vision</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-white/60 text-sm mb-2">Mission</label>
              <textarea rows={3} value={content.mission || ''} onChange={e => setContent({ ...content, mission: e.target.value })} className="admin-input resize-none" />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Vision</label>
              <textarea rows={3} value={content.vision || ''} onChange={e => setContent({ ...content, vision: e.target.value })} className="admin-input resize-none" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-white font-semibold text-lg mb-6">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input
                  value={stat.value}
                  onChange={e => updateStat(idx, 'value', e.target.value)}
                  className="admin-input w-24"
                  placeholder="500+"
                />
                <input
                  value={stat.label}
                  onChange={e => updateStat(idx, 'label', e.target.value)}
                  className="admin-input flex-1"
                  placeholder="Properties Listed"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
