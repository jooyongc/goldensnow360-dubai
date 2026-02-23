import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, Grid3X3, Map as MapIcon, X } from 'lucide-react'
import { db, demoProperties } from '../lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import DubaiMap from '../components/DubaiMap'
import PropertyCard from '../components/PropertyCard'

export default function VRRoomPage() {
  const [searchParams] = useSearchParams()
  const [properties, setProperties] = useState(demoProperties)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('keyword') || '')
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || '')
  const [selectedType, setSelectedType] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(collection(db, 'properties'), orderBy('created_at', 'desc'))
        const snap = await getDocs(q)
        if (!snap.empty) setProperties(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    fetchData()
  }, [])

  const areas = [...new Set(properties.map(p => p.area))].sort()
  const types = [...new Set(properties.map(p => p.property_type))].sort()

  const filtered = properties.filter(p => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    const matchArea = !selectedArea || p.area === selectedArea
    const matchType = !selectedType || p.property_type === selectedType
    return matchSearch && matchArea && matchType
  })

  const clearFilters = () => {
    setSearch('')
    setSelectedArea('')
    setSelectedType('')
  }

  const hasFilters = search || selectedArea || selectedType

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative pt-32 pb-12 bg-surface-dark overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-5 py-2 mb-6">
            <span className="material-symbols-outlined text-primary text-sm">view_in_ar</span>
            <span className="text-white/60 text-sm font-medium">VR Room</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            360° Virtual <span className="text-gradient-gold">Tours</span>
          </h1>
          <p className="section-subtitle max-w-2xl">
            Explore Dubai properties with immersive Matterport 3D virtual tours
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-bg-dark border-b border-white/[0.04] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="glass-panel rounded-2xl p-3 sm:p-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search properties..."
                  className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-5 py-3 pl-12 text-white text-sm placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Area Filter */}
              <select
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                className="bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors md:w-44"
              >
                <option value="">All Areas</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors md:w-44"
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white/5 text-white/40 hover:text-white'
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === 'map' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white/5 text-white/40 hover:text-white'
                  }`}
                >
                  <MapIcon size={18} />
                </button>
              </div>
            </div>
          </div>

          {hasFilters && (
            <div className="flex items-center gap-2 mt-3 px-1">
              <span className="text-white/30 text-sm">Filters:</span>
              {search && (
                <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                  "{search}" <X size={12} className="cursor-pointer" onClick={() => setSearch('')} />
                </span>
              )}
              {selectedArea && (
                <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                  {selectedArea} <X size={12} className="cursor-pointer" onClick={() => setSelectedArea('')} />
                </span>
              )}
              {selectedType && (
                <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                  {selectedType} <X size={12} className="cursor-pointer" onClick={() => setSelectedType('')} />
                </span>
              )}
              <button onClick={clearFilters} className="text-white/30 text-xs hover:text-white ml-2 transition-colors">
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <p className="text-white/40">
              <span className="text-primary font-semibold">{filtered.length}</span> properties found
            </p>
          </div>

          {viewMode === 'map' ? (
            <DubaiMap properties={filtered} height="600px" />
          ) : (
            <>
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Filter className="text-white/20" size={32} />
                  </div>
                  <h3 className="text-white/50 text-xl mb-2">No properties found</h3>
                  <p className="text-white/30">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filtered.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
