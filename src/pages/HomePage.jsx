import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Building2, Globe, Headset, ChevronDown } from 'lucide-react'
import { db, demoProperties, demoHeroContent } from '../lib/firebase'
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore'
import DubaiMap from '../components/DubaiMap'
import PropertyCard from '../components/PropertyCard'

export default function HomePage() {
  const [hero, setHero] = useState(demoHeroContent)
  const [properties, setProperties] = useState(demoProperties)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [heroSnap, propSnap] = await Promise.all([
          getDoc(doc(db, 'hero_sections', 'home')),
          getDocs(query(collection(db, 'properties'), orderBy('created_at', 'desc')))
        ])
        if (heroSnap.exists()) setHero(heroSnap.data())
        if (!propSnap.empty) setProperties(propSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const featured = properties.filter(p => p.featured)

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.background_image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/90 via-bg-dark/70 to-bg-dark" />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-panel rounded-full px-5 py-2 mb-8">
              <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
              <span className="text-white/60 text-sm font-medium">
                {hero.subtitle || 'Immersive Virtual Reality Tours'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-8 tracking-tight">
              {hero.title || 'Experience Dubai Properties in 360°'}
            </h1>

            <p className="text-white/50 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              {hero.description || 'Explore luxury properties across Dubai through cutting-edge Matterport 3D virtual tours.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/vr-room" className="btn-primary text-center flex items-center justify-center gap-2 text-lg">
                <Play size={20} />
                Start 360° Tour
              </Link>
              <Link to="/about" className="btn-secondary text-center flex items-center justify-center gap-2 text-lg">
                Watch Trailer
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={20} className="text-white/30" />
        </div>
      </section>

      {/* Stats Section - overlapping */}
      <section className="relative z-10 -mt-16 sm:-mt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {[
                { icon: 'apartment', value: `${properties.length}+`, label: 'Properties' },
                { icon: 'view_in_ar', value: '360°', label: 'Virtual Tours' },
                { icon: 'location_on', value: '15+', label: 'Areas in Dubai' },
                { icon: 'verified', value: '100%', label: 'Trusted' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <span className="material-symbols-outlined text-primary text-2xl mb-2 block">{stat.icon}</span>
                  <div className="text-white font-bold text-2xl sm:text-3xl mb-1">{stat.value}</div>
                  <div className="text-white/40 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Experience Cards */}
      <section className="py-20 bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <span className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-4">
            <span className="material-symbols-outlined text-primary text-sm">explore</span>
            <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Experiences</span>
          </span>
          <h2 className="section-title mb-2">Discover <span className="text-gradient-gold">Dubai</span></h2>
          <p className="section-subtitle">Browse immersive property experiences</p>
        </div>
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-6 px-4 sm:px-8 lg:px-12 justify-center flex-wrap lg:flex-nowrap">
            {[
              { img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', title: 'Downtown Dubai', count: properties.filter(p => p.area === 'Downtown Dubai').length },
              { img: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600', title: 'Palm Jumeirah', count: properties.filter(p => p.area === 'Palm Jumeirah').length },
              { img: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600', title: 'Dubai Marina', count: properties.filter(p => p.area === 'Dubai Marina').length },
              { img: 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=600', title: 'Business Bay', count: properties.filter(p => p.area === 'Business Bay').length },
            ].map((card, i) => (
              <Link
                key={i}
                to={`/vr-room?area=${encodeURIComponent(card.title)}`}
                className="group relative w-72 h-96 rounded-[2rem] overflow-hidden flex-shrink-0"
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-bold text-xl mb-1">{card.title}</h3>
                  <p className="text-white/50 text-sm">{card.count} Properties</p>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={18} className="text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Spotlight - 2 column */}
      <section className="py-20 bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <div className="relative">
              <div className="rounded-[2rem] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                  alt="VR Experience"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              {/* Decorative circles */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full border border-primary/20 pointer-events-none" />
              <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            </div>

            {/* Content side */}
            <div>
              <span className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">view_in_ar</span>
                <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Why Choose Us</span>
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                Experience Properties <span className="text-gradient-gold">Like Never Before</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <Headset size={22} />,
                    title: 'Immersive 3D Tours',
                    desc: 'Walk through properties virtually with Matterport technology, as if you were physically there.'
                  },
                  {
                    icon: <Globe size={22} />,
                    title: 'Explore from Anywhere',
                    desc: 'Access Dubai properties from anywhere in the world. No travel required for initial viewing.'
                  },
                  {
                    icon: <Building2 size={22} />,
                    title: 'Premium Properties',
                    desc: 'Curated selection of Dubai\'s finest villas, apartments, penthouses, and commercial spaces.'
                  }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <span className="text-primary">{feature.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dubai Map Section */}
      <section className="py-20 bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-4">
              <span className="material-symbols-outlined text-primary text-sm">map</span>
              <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Explore</span>
            </span>
            <h2 className="section-title mb-4">Properties on <span className="text-gradient-gold">Map</span></h2>
            <p className="section-subtitle">Click on markers to discover properties across Dubai</p>
          </div>
          {!loading && properties.length > 0 && (
            <DubaiMap properties={properties} height="550px" />
          )}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-4">
                <span className="material-symbols-outlined text-primary text-sm">star</span>
                <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Featured</span>
              </span>
              <h2 className="section-title mb-2">Featured <span className="text-gradient-gold">Properties</span></h2>
              <p className="section-subtitle">Handpicked luxury properties with virtual tours</p>
            </div>
            <Link to="/vr-room" className="btn-secondary hidden md:flex items-center gap-2 text-sm">
              View All
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.slice(0, 3).map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Link to="/vr-room" className="btn-secondary inline-flex items-center gap-2">
              View All Properties
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Dot pattern */}
      <section className="py-24 bg-bg-dark relative overflow-hidden">
        {/* Dot pattern background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        {/* Gradient blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 glass-panel rounded-full px-5 py-2 mb-8">
            <span className="material-symbols-outlined text-primary text-sm">rocket_launch</span>
            <span className="text-white/60 text-sm font-medium">Get Started Today</span>
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Explore<br /><span className="text-gradient-gold">Dubai Properties?</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-2xl mx-auto">
            Start your journey today. Browse our collection of premium properties with immersive 3D virtual tours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/vr-room" className="btn-primary text-lg">
              Browse VR Tours
            </Link>
            <Link to="/contact" className="btn-secondary text-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
