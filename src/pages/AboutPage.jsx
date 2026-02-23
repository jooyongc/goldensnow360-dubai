import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Target, Eye, Award, Users } from 'lucide-react'
import { db, demoAboutContent } from '../lib/firebase'
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore'

export default function AboutPage() {
  const [content, setContent] = useState(demoAboutContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [aboutSnap, statsSnap] = await Promise.all([
          getDoc(doc(db, 'about_content', 'main')),
          getDocs(query(collection(db, 'about_stats'), orderBy('sort_order')))
        ])
        if (aboutSnap.exists()) {
          setContent(prev => ({
            ...prev,
            ...aboutSnap.data(),
            stats: !statsSnap.empty ? statsSnap.docs.map(d => d.data()) : prev.stats
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
      <section className="relative pt-32 pb-20 bg-surface-dark overflow-hidden">
        {/* Glowing orb */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-5 py-2 mb-6">
            <span className="material-symbols-outlined text-primary text-sm">info</span>
            <span className="text-white/60 text-sm font-medium">About Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {content.title?.split(' ').slice(0, -1).join(' ')} <span className="text-gradient-gold">{content.title?.split(' ').slice(-1)}</span>
          </h1>
          <p className="section-subtitle max-w-2xl">{content.subtitle}</p>
        </div>
      </section>

      {/* Stats - overlapping */}
      <section className="relative z-10 -mt-8 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {(content.stats || []).map((stat, i) => {
                const icons = ['apartment', 'groups', 'view_in_ar', 'emoji_events']
                return (
                  <div key={i} className="text-center">
                    <span className="material-symbols-outlined text-primary text-2xl mb-2 block">{icons[i] || 'check_circle'}</span>
                    <div className="text-white font-bold text-2xl sm:text-3xl mb-1">
                      {stat.value}
                    </div>
                    <div className="text-white/40 text-sm">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">history</span>
                <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Our Story</span>
              </span>
              <div className="whitespace-pre-line text-white/50 text-lg leading-relaxed">
                {content.description}
              </div>
            </div>
            <div className="relative">
              <img
                src={content.image}
                alt="Golden Snow 360 Office"
                className="w-full rounded-[2rem] shadow-2xl"
              />
              {/* Decorative circles */}
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full border border-primary/20 pointer-events-none" />
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                  <Target className="text-primary" size={26} />
                </div>
                <h3 className="text-white font-bold text-2xl">Our Mission</h3>
              </div>
              <p className="text-white/50 leading-relaxed text-lg">{content.mission}</p>
            </div>
            <div className="glass-card p-8 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                  <Eye className="text-primary" size={26} />
                </div>
                <h3 className="text-white font-bold text-2xl">Our Vision</h3>
              </div>
              <p className="text-white/50 leading-relaxed text-lg">{content.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-4">
              <span className="material-symbols-outlined text-primary text-sm">psychology</span>
              <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Core Values</span>
            </span>
            <h2 className="section-title">Our <span className="text-gradient-gold">Values</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Award size={32} />, title: 'Excellence', desc: 'We deliver premium service and the highest quality virtual experiences for every property.' },
              { icon: <Users size={32} />, title: 'Client First', desc: 'Every decision we make is guided by what\'s best for our clients and their property goals.' },
              { icon: <Target size={32} />, title: 'Innovation', desc: 'We leverage cutting-edge technology to transform how people experience real estate.' },
            ].map((val, i) => (
              <div key={i} className="glass-card p-8 text-center hover:border-primary/20 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="text-primary">{val.icon}</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{val.title}</h3>
                <p className="text-white/40 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-surface-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 glass-panel rounded-full px-5 py-2 mb-8">
            <span className="material-symbols-outlined text-primary text-sm">handshake</span>
            <span className="text-white/60 text-sm font-medium">Partner With Us</span>
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Want to <span className="text-gradient-gold">Work with Us?</span>
          </h2>
          <p className="text-white/40 text-lg mb-10">
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
