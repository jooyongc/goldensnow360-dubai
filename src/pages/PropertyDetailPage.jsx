import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Building2, Share2, Phone } from 'lucide-react'
import { db, demoProperties } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const snap = await getDoc(doc(db, 'properties', id))
        if (snap.exists()) {
          setProperty({ id: snap.id, ...snap.data() })
        } else {
          const found = demoProperties.find(p => String(p.id) === id)
          setProperty(found || null)
        }
      } catch (e) {
        console.error(e)
        const found = demoProperties.find(p => String(p.id) === id)
        setProperty(found || null)
      }
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-bg-dark">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-bg-dark">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">Property not found</h2>
          <Link to="/vr-room" className="btn-primary">Back to VR Room</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in pt-24 bg-bg-dark min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="glass-panel rounded-full px-5 py-3 inline-flex items-center gap-3">
          <Link to="/vr-room" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} />
            VR Room
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-primary text-sm font-medium">{property.title}</span>
        </div>
      </div>

      {/* Matterport 3D Viewer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/5" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={property.matterport_url}
            title={`${property.title} - 3D Virtual Tour`}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="xr-spatial-tracking"
          />
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="glass-panel text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                      {property.property_type}
                    </span>
                    {property.featured && (
                      <span className="bg-primary/80 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-white font-bold text-3xl md:text-4xl mb-2">
                    {property.title}
                  </h1>
                  {property.title_ar && (
                    <p className="text-white/30 text-lg font-light" dir="rtl">{property.title_ar}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/40 mb-6">
                <MapPin size={18} className="text-primary" />
                <span className="text-lg">{property.location}</span>
              </div>

              <p className="text-gradient-gold font-bold text-3xl mb-8">{property.price}</p>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {property.bedrooms > 0 && (
                  <div className="glass-panel rounded-2xl p-4 text-center">
                    <Bed className="text-primary mx-auto mb-2" size={24} />
                    <div className="text-white font-bold text-xl">{property.bedrooms}</div>
                    <div className="text-white/40 text-sm">Bedrooms</div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="glass-panel rounded-2xl p-4 text-center">
                    <Bath className="text-primary mx-auto mb-2" size={24} />
                    <div className="text-white font-bold text-xl">{property.bathrooms}</div>
                    <div className="text-white/40 text-sm">Bathrooms</div>
                  </div>
                )}
                {property.size_sqft > 0 && (
                  <div className="glass-panel rounded-2xl p-4 text-center">
                    <Maximize className="text-primary mx-auto mb-2" size={24} />
                    <div className="text-white font-bold text-xl">{property.size_sqft.toLocaleString()}</div>
                    <div className="text-white/40 text-sm">Sq Ft</div>
                  </div>
                )}
                <div className="glass-panel rounded-2xl p-4 text-center">
                  <Building2 className="text-primary mx-auto mb-2" size={24} />
                  <div className="text-white font-bold text-lg">{property.property_type}</div>
                  <div className="text-white/40 text-sm">Type</div>
                </div>
              </div>

              {/* Description */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8">
                <h2 className="text-white font-bold text-xl mb-4">Description</h2>
                <p className="text-white/50 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-panel rounded-3xl p-6 sticky top-28">
                <h3 className="text-white font-bold text-lg mb-6">Interested in this property?</h3>
                <div className="space-y-3">
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

                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <h4 className="text-white/30 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Property Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Area</span>
                      <span className="text-white font-medium">{property.area}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Type</span>
                      <span className="text-white font-medium">{property.property_type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Status</span>
                      <span className="text-white font-medium capitalize">{property.status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Listed</span>
                      <span className="text-white font-medium">
                        {property.created_at?.toDate ? property.created_at.toDate().toLocaleDateString() : new Date(property.created_at).toLocaleDateString()}
                      </span>
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
