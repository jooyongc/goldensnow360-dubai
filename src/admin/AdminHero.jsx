import { useState, useEffect } from 'react'
import { Save, Image } from 'lucide-react'
import { supabase, DEMO_MODE, demoHeroContent } from '../lib/supabase'

export default function AdminHero() {
  const [hero, setHero] = useState({
    title: demoHeroContent.title,
    subtitle: demoHeroContent.subtitle,
    description: demoHeroContent.description,
    background_image: demoHeroContent.background_image,
    cta_text: 'Start Virtual Tour',
    cta_link: '/vr-room'
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function fetch() {
      if (DEMO_MODE) return
      try {
        const { data } = await supabase.from('hero_sections').select('*').eq('page', 'home').single()
        if (data) setHero(data)
      } catch (e) { console.error(e) }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    if (!DEMO_MODE) {
      try {
        if (hero.id) {
          await supabase.from('hero_sections').update({
            title: hero.title,
            subtitle: hero.subtitle,
            description: hero.description,
            background_image: hero.background_image,
            cta_text: hero.cta_text,
            cta_link: hero.cta_link,
            updated_at: new Date().toISOString()
          }).eq('id', hero.id)
        } else {
          await supabase.from('hero_sections').insert([{ ...hero, page: 'home' }])
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
          <h1 className="text-white font-display text-3xl font-bold mb-2">Hero Section</h1>
          <p className="text-white/60">Edit the homepage hero banner</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="admin-btn flex items-center gap-2 disabled:opacity-50">
          <Save size={18} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="block text-white/60 text-sm mb-2">Title</label>
            <input
              value={hero.title}
              onChange={e => setHero({ ...hero, title: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Subtitle</label>
            <input
              value={hero.subtitle}
              onChange={e => setHero({ ...hero, subtitle: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Description</label>
            <textarea
              rows={4}
              value={hero.description}
              onChange={e => setHero({ ...hero, description: e.target.value })}
              className="admin-input resize-none"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Background Image URL</label>
            <input
              value={hero.background_image}
              onChange={e => setHero({ ...hero, background_image: e.target.value })}
              className="admin-input"
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-sm mb-2">CTA Button Text</label>
              <input
                value={hero.cta_text || ''}
                onChange={e => setHero({ ...hero, cta_text: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">CTA Button Link</label>
              <input
                value={hero.cta_link || ''}
                onChange={e => setHero({ ...hero, cta_link: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Preview</label>
          <div className="glass-card overflow-hidden">
            <div className="relative h-64">
              {hero.background_image ? (
                <img src={hero.background_image} alt="Hero preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-dubai-navy flex items-center justify-center">
                  <Image className="text-white/20" size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-dubai-dark/90 to-transparent flex items-center p-6">
                <div>
                  <p className="text-gold-400 text-xs mb-1">{hero.subtitle}</p>
                  <h3 className="text-white font-display font-bold text-lg mb-2">{hero.title}</h3>
                  <p className="text-white/60 text-xs line-clamp-2">{hero.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
