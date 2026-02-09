import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Building2, Globe, Headset } from 'lucide-react'
import { supabase, DEMO_MODE, demoProperties, demoHeroContent } from '../lib/supabase'
import DubaiMap from '../components/DubaiMap'
import PropertyCard from '../components/PropertyCard'

export default function HomePage() {
  const [hero, setHero] = useState(demoHeroContent)
  const [properties, setProperties] = useState(demoProperties)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (DEMO_MODE) {
        setLoading(false)
        return
      }
      try {
        const [heroRes, propRes] = await Promise.all([
          supabase.from('hero_sections').select('*').eq('page', 'home').eq('is_active', true).single(),
          supabase.from('properties').select('*').order('created_at', { ascending: false })
        ])
        if (heroRes.data) setHero(heroRes.data)
        if (propRes.data) setProperties(propRes.data)
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
      <section className="relative min-h-screen flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.background_image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dubai-dark/95 via-dubai-dark/80 to-dubai-dark/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-[2px] bg-gold-500"></div>
              <span className="text-gold-400 text-sm font-medium tracking-widest uppercase">
                {hero.subtitle || 'Immersive Virtual Reality Tours'}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              {hero.title || 'Experience Dubai Properties in 360°'}
            </h1>
            <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl">
              {hero.description || 'Explore luxury properties across Dubai through cutting-edge Matterport 3D virtual tours.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/vr-room" className="btn-primary text-center flex items-center justify-center gap-2 text-lg">
                <Play size={20} />
                Start Virtual Tour
              </Link>
              <Link to="/about" className="btn-secondary text-center flex items-center justify-center gap-2 text-lg">
                Learn More
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dubai-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Why Choose Golden Snow 360</h2>
            <p className="section-subtitle">Experience the future of real estate</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Headset size={40} />,
                title: 'Immersive 3D Tours',
                desc: 'Walk through properties virtually with Matterport technology, as if you were physically there.'
              },
              {
                icon: <Globe size={40} />,
                title: 'Explore from Anywhere',
                desc: 'Access Dubai properties from anywhere in the world. No travel required for initial property viewing.'
              },
              {
                icon: <Building2 size={40} />,
                title: 'Premium Properties',
                desc: 'Curated selection of Dubai\'s finest villas, apartments, penthouses, and commercial spaces.'
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 text-center hover:border-gold-500/30 transition-all duration-300 group">
                <div className="text-gold-400 mb-6 flex justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dubai Map Section */}
      <section className="py-20 bg-dubai-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Explore Properties on Map</h2>
            <p className="section-subtitle">Click on markers to discover properties across Dubai</p>
          </div>
          {!loading && properties.length > 0 && (
            <DubaiMap properties={properties} height="550px" />
          )}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-dubai-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-title mb-4">Featured Properties</h2>
              <p className="section-subtitle">Handpicked luxury properties with virtual tours</p>
            </div>
            <Link to="/vr-room" className="btn-secondary hidden md:flex items-center gap-2">
              View All
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.slice(0, 3).map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/vr-room" className="btn-secondary inline-flex items-center gap-2">
              View All Properties
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dubai-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-6">Ready to Explore Dubai Properties?</h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
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
