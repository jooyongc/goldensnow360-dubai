import { Link } from 'react-router-dom'
import { Eye, Bed, Bath, Maximize, MapPin } from 'lucide-react'

export default function PropertyCard({ property }) {
  return (
    <div className="group relative rounded-[2rem] overflow-hidden bg-surface-dark border border-white/[0.06] hover:-translate-y-2 transition-all duration-500">
      {/* Image */}
      <div className="relative overflow-hidden h-64">
        <img
          src={property.thumbnail || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="glass-panel text-white text-xs font-semibold px-3.5 py-1.5 rounded-full">
            {property.property_type}
          </span>
          {property.featured && (
            <span className="bg-primary/80 backdrop-blur-sm text-white text-xs font-semibold px-3.5 py-1.5 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Hover action */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <Link
            to={`/property/${property.id}`}
            className="flex items-center gap-2 bg-primary text-white font-semibold text-sm px-6 py-3 rounded-full transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-primary-light"
          >
            <Eye size={16} />
            View 360° Tour
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        {/* Icon circle */}
        <div className="absolute -top-5 right-6 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
          <span className="material-symbols-outlined text-white text-lg">360</span>
        </div>

        <h3 className="text-white font-bold text-lg mb-1 group-hover:text-gradient-gold transition-colors pr-12">
          {property.title}
        </h3>
        <div className="flex items-center gap-1.5 text-white/40 text-sm mb-3">
          <MapPin size={13} />
          {property.location}
        </div>
        <p className="text-primary font-bold text-xl mb-4">{property.price}</p>

        {/* Description on hover */}
        {property.description && (
          <p className="text-white/40 text-sm leading-relaxed mb-4 line-clamp-2 max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-500">
            {property.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-white/40 text-sm border-t border-white/[0.06] pt-4">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bed size={14} className="text-primary" /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath size={14} className="text-primary" /> {property.bathrooms}
            </span>
          )}
          {property.size_sqft > 0 && (
            <span className="flex items-center gap-1.5">
              <Maximize size={14} className="text-primary" /> {property.size_sqft.toLocaleString()} sqft
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
