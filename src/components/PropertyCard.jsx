import { Link } from 'react-router-dom'
import { Eye, Bed, Bath, Maximize, MapPin } from 'lucide-react'

export default function PropertyCard({ property }) {
  return (
    <div className="glass-card overflow-hidden group hover:border-gold-500/30 transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={property.thumbnail || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
          alt={property.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-gold-500 text-dubai-dark text-xs font-bold px-3 py-1 rounded-full">
            {property.property_type}
          </span>
          {property.featured && (
            <span className="bg-dubai-accent text-white text-xs font-bold px-3 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dubai-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Link
            to={`/property/${property.id}`}
            className="flex items-center gap-2 bg-gold-500 text-dubai-dark font-semibold text-sm px-5 py-2 rounded-lg"
          >
            <Eye size={16} />
            View 360° Tour
          </Link>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-gold-400 transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-white/50 text-sm mb-3">
          <MapPin size={14} />
          {property.location}
        </div>
        <p className="text-gold-400 font-bold text-xl mb-4">{property.price}</p>

        <div className="flex items-center gap-4 text-white/50 text-sm border-t border-white/10 pt-4">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bed size={14} className="text-gold-500" /> {property.bedrooms} Beds
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath size={14} className="text-gold-500" /> {property.bathrooms} Baths
            </span>
          )}
          {property.size_sqft > 0 && (
            <span className="flex items-center gap-1.5">
              <Maximize size={14} className="text-gold-500" /> {property.size_sqft.toLocaleString()} sqft
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
