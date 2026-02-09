import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Target, Eye, Award, Users } from 'lucide-react'
import { supabase, demoAboutContent } from '../lib/supabase'

export default function AboutPage() {
  const [content, setContent] = useState(demoAboutContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [aboutRes, statsRes] = await Promise.all([
          supabase.from('about_content').select('*').eq('is_active', true).single(),
          supabase.from('about_stats').select('*').order('sort_order')
        ])
        if (aboutRes.data) {
          setContent(prev => ({
            ...prev,
            ...aboutRes.data,
            stats: statsRes.data || prev.stats
          }))
        }
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-dubai-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-12 h-[2px] bg-gold-500"></div>
            <span className="text-gold-400 text-sm font-medium tracking-widest uppercase">About Us</span>
          </div>
          <h1 className="section-title mb-4">{content.title}</h1>
          <p className="section-subtitle max-w-2xl">{content.subtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-dubai-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="whitespace-pre-line text-white/70 text-lg leading-relaxed">
                {content.description}
              </div>
            </div>
            <div className="relative">
              <img
                src={content.image}
                alt="Golden Snow 360 Office"
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gold-500/10 rounded-2xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gold-500/5 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-dubai-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(content.stats || []).map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-gold-400 font-display text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-dubai-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 hover:border-gold-500/30 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center">
                  <Target className="text-gold-400" size={24} />
                </div>
                <h3 className="text-white font-display text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="text-white/70 leading-relaxed">{content.mission}</p>
            </div>
            <div className="glass-card p-8 hover:border-gold-500/30 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center">
                  <Eye className="text-gold-400" size={24} />
                </div>
                <h3 className="text-white font-display text-2xl font-bold">Our Vision</h3>
              </div>
              <p className="text-white/70 leading-relaxed">{content.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-dubai-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Award size={36} />, title: 'Excellence', desc: 'We deliver premium service and the highest quality virtual experiences for every property.' },
              { icon: <Users size={36} />, title: 'Client First', desc: 'Every decision we make is guided by what\'s best for our clients and their property goals.' },
              { icon: <Target size={36} />, title: 'Innovation', desc: 'We leverage cutting-edge technology to transform how people experience real estate.' },
            ].map((val, i) => (
              <div key={i} className="text-center">
                <div className="text-gold-400 mb-4 flex justify-center">{val.icon}</div>
                <h3 className="text-white font-semibold text-xl mb-3">{val.title}</h3>
                <p className="text-white/60">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-dubai-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="section-title mb-6">Want to Work with Us?</h2>
          <p className="text-white/60 text-lg mb-10">
            Whether you're buying, selling, or investing in Dubai real estate, we're here to help.
          </p>
          <Link to="/contact" className="btn-primary text-lg">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}
