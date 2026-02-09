import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Building2, Share2, Phone } from 'lucide-react'
import { supabase, DEMO_MODE, demoProperties } from '../lib/supabase'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (DEMO_MODE) {
        const found = demoProperties.find(p => String(p.id) === id)
        setProperty(found || demoProperties[0])
        setLoading(false)
        return
      }
      try {
        const { data } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single()
        if (data) setProperty(data)
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-gold-400">Loading...</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">Property not found</h2>
          <Link to="/vr-room" className="btn-primary">Back to VR Room</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in pt-20">
      {/* Breadcrumb */}
      <div className="bg-dubai-navy border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link to="/vr-room" className="flex items-center gap-2 text-white/60 hover:text-gold-400 transition-colors">
              <ArrowLeft size={18} />
              Back to VR Room
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-gold-400">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Matterport 3D Viewer */}
      <section className="bg-dubai-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={property.matterport_url}
              title={`${property.title} - 3D Virtual Tour`}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allowFullScreen
              allow="xr-spatial-tracking"
            />
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12 bg-dubai-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-gold-500 text-dubai-dark text-xs font-bold px-3 py-1 rounded-full">
                      {property.property_type}
                    </span>
                    {property.featured && (
                      <span className="bg-dubai-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-white font-display text-3xl md:text-4xl font-bold mb-2">
                    {property.title}
                  </h1>
                  {property.title_ar && (
                    <p className="text-white/40 text-lg font-light" dir="rtl">{property.title_ar}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/50 mb-6">
                <MapPin size={18} className="text-gold-400" />
                <span className="text-lg">{property.location}</span>
              </div>

              <p className="text-gold-400 font-display text-3xl font-bold mb-8">{property.price}</p>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {property.bedrooms > 0 && (
                  <div className="glass-card p-4 text-center">
                    <Bed className="text-gold-400 mx-auto mb-2" size={24} />
                    <div className="text-white font-bold text-xl">{property.bedrooms}</div>
                    <div className="text-white/50 text-sm">Bedrooms</div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="glass-card p-4 text-center">
                    <Bath className="text-gold-400 mx-auto mb-2" size={24} />
                    <div className="text-white font-bold text-xl">{property.bathrooms}</div>
                    <div className="text-white/50 text-sm">Bathrooms</div>
                  </div>
                )}
                {property.size_sqft > 0 && (
                  <div className="glass-card p-4 text-center">
                    <Maximize className="text-gold-400 mx-auto mb-2" size={24} />
                    <div className="text-white font-bold text-xl">{property.size_sqft.toLocaleString()}</div>
                    <div className="text-white/50 text-sm">Sq Ft</div>
                  </div>
                )}
                <div className="glass-card p-4 text-center">
                  <Building2 className="text-gold-400 mx-auto mb-2" size={24} />
                  <div className="text-white font-bold text-lg">{property.property_type}</div>
                  <div className="text-white/50 text-sm">Type</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-white font-semibold text-xl mb-4">Description</h2>
                <p className="text-white/70 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-28">
                <h3 className="text-white font-semibold text-lg mb-6">Interested in this property?</h3>
                <div className="space-y-4">
                  <Link
                    to={`/contact?property=${property.id}`}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Phone size={18} />
                    Contact Agent
                  </Link>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      alert('Link copied to clipboard!')
                    }}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <Share2 size={18} />
                    Share Property
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-gold-400 font-semibold text-sm mb-4">PROPERTY DETAILS</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Area</span>
                      <span className="text-white">{property.area}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Type</span>
                      <span className="text-white">{property.property_type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Status</span>
                      <span className="text-white capitalize">{property.status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Listed</span>
                      <span className="text-white">{new Date(property.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
