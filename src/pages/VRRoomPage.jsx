import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, Grid3X3, Map as MapIcon, X } from 'lucide-react'
import { supabase, DEMO_MODE, demoProperties } from '../lib/supabase'
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
      if (DEMO_MODE) { setLoading(false); return }
      try {
        const { data } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })
        if (data) setProperties(data)
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
      <section className="relative pt-32 pb-12 bg-dubai-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-12 h-[2px] bg-gold-500"></div>
            <span className="text-gold-400 text-sm font-medium tracking-widest uppercase">VR Room</span>
          </div>
          <h1 className="section-title mb-4">360° Virtual Tours</h1>
          <p className="section-subtitle max-w-2xl">
            Explore Dubai properties with immersive Matterport 3D virtual tours
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-dubai-dark border-b border-white/10 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search properties..."
                className="admin-input pl-12"
              />
            </div>

            {/* Area Filter */}
            <select
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
              className="admin-input md:w-48"
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
              className="admin-input md:w-48"
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
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-gold-500 text-dubai-dark' : 'bg-white/10 text-white/60'
                }`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'map' ? 'bg-gold-500 text-dubai-dark' : 'bg-white/10 text-white/60'
                }`}
              >
                <MapIcon size={18} />
              </button>
            </div>
          </div>

          {hasFilters && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-white/40 text-sm">Filters:</span>
              {search && (
                <span className="bg-gold-500/20 text-gold-400 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  "{search}" <X size={12} className="cursor-pointer" onClick={() => setSearch('')} />
                </span>
              )}
              {selectedArea && (
                <span className="bg-gold-500/20 text-gold-400 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  {selectedArea} <X size={12} className="cursor-pointer" onClick={() => setSelectedArea('')} />
                </span>
              )}
              {selectedType && (
                <span className="bg-gold-500/20 text-gold-400 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  {selectedType} <X size={12} className="cursor-pointer" onClick={() => setSelectedType('')} />
                </span>
              )}
              <button onClick={clearFilters} className="text-white/40 text-xs hover:text-white ml-2">
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-dubai-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <p className="text-white/60">
              <span className="text-gold-400 font-semibold">{filtered.length}</span> properties found
            </p>
          </div>

          {viewMode === 'map' ? (
            <DubaiMap properties={filtered} height="600px" />
          ) : (
            <>
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <Filter className="text-white/20 mx-auto mb-4" size={48} />
                  <h3 className="text-white/60 text-xl mb-2">No properties found</h3>
                  <p className="text-white/40">Try adjusting your filters</p>
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
