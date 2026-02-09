import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, MapPin, ExternalLink } from 'lucide-react'
import { supabase, DEMO_MODE, demoProperties } from '../lib/supabase'

const emptyProperty = {
  title: '', title_ar: '', description: '', location: '', area: '',
  lat: 25.2048, lng: 55.2708, price: '', bedrooms: 0, bathrooms: 0,
  size_sqft: 0, matterport_url: '', thumbnail: '', property_type: 'Apartment',
  status: 'available', featured: false
}

export default function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [editing, setEditing] = useState(null)
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    async function fetch() {
      if (DEMO_MODE) { setProperties(demoProperties); return }
      try {
        const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
        if (data) setProperties(data)
      } catch (e) { console.error(e) }
    }
    fetch()
  }, [])

  const handleNew = () => {
    setEditing({ ...emptyProperty })
    setIsNew(true)
  }

  const handleEdit = (prop) => {
    setEditing({ ...prop })
    setIsNew(false)
  }

  const handleSave = async () => {
    if (DEMO_MODE) {
      if (isNew) {
        const newProp = { ...editing, id: Date.now(), created_at: new Date().toISOString() }
        setProperties([newProp, ...properties])
      } else {
        setProperties(properties.map(p => p.id === editing.id ? editing : p))
      }
      setEditing(null)
      return
    }

    try {
      if (isNew) {
        const { data } = await supabase.from('properties').insert([editing]).select().single()
        if (data) setProperties([data, ...properties])
      } else {
        const { data } = await supabase.from('properties')
          .update({ ...editing, updated_at: new Date().toISOString() })
          .eq('id', editing.id).select().single()
        if (data) setProperties(properties.map(p => p.id === data.id ? data : p))
      }
    } catch (e) { console.error(e) }
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    if (DEMO_MODE) {
      setProperties(properties.filter(p => p.id !== id))
      return
    }
    try {
      await supabase.from('properties').delete().eq('id', id)
      setProperties(properties.filter(p => p.id !== id))
    } catch (e) { console.error(e) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-display text-3xl font-bold mb-2">Properties</h1>
          <p className="text-white/60">Manage property listings and Matterport tours</p>
        </div>
        <button onClick={handleNew} className="admin-btn flex items-center gap-2">
          <Plus size={18} />
          Add Property
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-8">
          <div className="bg-dubai-navy border border-white/10 rounded-xl w-full max-w-3xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-white font-semibold text-lg">
                {isNew ? 'Add New Property' : 'Edit Property'}
              </h2>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Title *</label>
                  <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="admin-input" />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Title (Arabic)</label>
                  <input value={editing.title_ar || ''} onChange={e => setEditing({ ...editing, title_ar: e.target.value })} className="admin-input" dir="rtl" />
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Description</label>
                <textarea rows={3} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} className="admin-input resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Location</label>
                  <input value={editing.location || ''} onChange={e => setEditing({ ...editing, location: e.target.value })} className="admin-input" placeholder="e.g., Downtown Dubai" />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Area</label>
                  <input value={editing.area || ''} onChange={e => setEditing({ ...editing, area: e.target.value })} className="admin-input" placeholder="e.g., Downtown Dubai" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Latitude</label>
                  <input type="number" step="any" value={editing.lat} onChange={e => setEditing({ ...editing, lat: parseFloat(e.target.value) || 0 })} className="admin-input" />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Longitude</label>
                  <input type="number" step="any" value={editing.lng} onChange={e => setEditing({ ...editing, lng: parseFloat(e.target.value) || 0 })} className="admin-input" />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Price</label>
                  <input value={editing.price || ''} onChange={e => setEditing({ ...editing, price: e.target.value })} className="admin-input" placeholder="AED 1,000,000" />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Size (sqft)</label>
                  <input type="number" value={editing.size_sqft || 0} onChange={e => setEditing({ ...editing, size_sqft: parseInt(e.target.value) || 0 })} className="admin-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Bedrooms</label>
                  <input type="number" value={editing.bedrooms || 0} onChange={e => setEditing({ ...editing, bedrooms: parseInt(e.target.value) || 0 })} className="admin-input" />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Bathrooms</label>
                  <input type="number" value={editing.bathrooms || 0} onChange={e => setEditing({ ...editing, bathrooms: parseInt(e.target.value) || 0 })} className="admin-input" />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Type</label>
                  <select value={editing.property_type} onChange={e => setEditing({ ...editing, property_type: e.target.value })} className="admin-input">
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Office">Office</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Status</label>
                  <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })} className="admin-input">
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Matterport URL *</label>
                <input value={editing.matterport_url || ''} onChange={e => setEditing({ ...editing, matterport_url: e.target.value })} className="admin-input" placeholder="https://my.matterport.com/show/?m=..." />
                <p className="text-white/30 text-xs mt-1">Paste the Matterport embed URL here. This will be displayed as the 3D tour.</p>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Thumbnail Image URL</label>
                <input value={editing.thumbnail || ''} onChange={e => setEditing({ ...editing, thumbnail: e.target.value })} className="admin-input" placeholder="https://..." />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.featured || false}
                    onChange={e => setEditing({ ...editing, featured: e.target.checked })}
                    className="w-4 h-4 accent-gold-500"
                  />
                  <span className="text-white/60 text-sm">Featured Property</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-white/10">
              <button onClick={() => setEditing(null)} className="px-6 py-2 rounded-lg text-white/60 hover:text-white border border-white/20 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="admin-btn flex items-center gap-2">
                <Save size={18} />
                {isNew ? 'Create Property' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property List */}
      <div className="space-y-4">
        {properties.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <MapPin className="text-white/20 mx-auto mb-4" size={48} />
            <h3 className="text-white/60 text-lg mb-2">No properties yet</h3>
            <p className="text-white/40 mb-6">Add your first property with a Matterport link</p>
            <button onClick={handleNew} className="admin-btn">Add Property</button>
          </div>
        ) : (
          properties.map(prop => (
            <div key={prop.id} className="glass-card p-4 flex flex-col md:flex-row items-start gap-4 hover:border-gold-500/20 transition-all">
              <img
                src={prop.thumbnail || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200'}
                alt={prop.title}
                className="w-full md:w-32 h-24 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold truncate">{prop.title}</h3>
                  {prop.featured && <span className="bg-gold-500/20 text-gold-400 text-xs px-2 py-0.5 rounded">Featured</span>}
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    prop.status === 'available' ? 'bg-green-500/20 text-green-400' :
                    prop.status === 'sold' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>{prop.status}</span>
                </div>
                <div className="flex items-center gap-1 text-white/40 text-sm mb-1">
                  <MapPin size={12} /> {prop.location}
                </div>
                <p className="text-gold-400 font-semibold text-sm">{prop.price}</p>
                {prop.matterport_url && (
                  <a href={prop.matterport_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs flex items-center gap-1 mt-1 hover:underline">
                    <ExternalLink size={10} /> Matterport Link
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(prop)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(prop.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
