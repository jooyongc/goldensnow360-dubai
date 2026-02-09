import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { Eye, Bed, Bath, Maximize } from 'lucide-react'

const goldIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div class="marker-pin"></div>',
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -42]
})

function MapBounds({ properties }) {
  const map = useMap()
  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.lat, p.lng]))
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 })
    }
  }, [properties, map])
  return null
}

function HoverMarker({ children, ...props }) {
  const markerRef = useRef(null)

  useEffect(() => {
    const marker = markerRef.current
    if (!marker) return
    const open = () => marker.openPopup()
    const close = () => marker.closePopup()
    marker.on('mouseover', open)
    marker.on('mouseout', close)
    return () => {
      marker.off('mouseover', open)
      marker.off('mouseout', close)
    }
  }, [])

  return <Marker ref={markerRef} {...props}>{children}</Marker>
}

export default function DubaiMap({ properties, height = '500px' }) {
  const center = [25.2048, 55.2708]

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height, width: '100%', borderRadius: '12px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapBounds properties={properties} />
      {properties.map(property => (
        <HoverMarker
          key={property.id}
          position={[property.lat, property.lng]}
          icon={goldIcon}
        >
          <Popup>
            <div className="min-w-[250px]">
              {property.thumbnail && (
                <img
                  src={property.thumbnail}
                  alt={property.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="text-gold-400 font-bold text-base mb-1">{property.title}</h3>
              <p className="text-white/60 text-xs mb-2">{property.location}</p>
              <p className="text-gold-300 font-semibold text-sm mb-3">{property.price}</p>
              <div className="flex gap-3 text-white/50 text-xs mb-3">
                {property.bedrooms > 0 && (
                  <span className="flex items-center gap-1"><Bed size={12} /> {property.bedrooms} Beds</span>
                )}
                {property.bathrooms > 0 && (
                  <span className="flex items-center gap-1"><Bath size={12} /> {property.bathrooms} Baths</span>
                )}
                {property.size_sqft > 0 && (
                  <span className="flex items-center gap-1"><Maximize size={12} /> {property.size_sqft} sqft</span>
                )}
              </div>
              <Link
                to={`/property/${property.id}`}
                className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-dubai-dark font-semibold text-xs px-4 py-2 rounded-lg transition-colors w-full"
              >
                <Eye size={14} />
                View 360° Tour
              </Link>
            </div>
          </Popup>
        </HoverMarker>
      ))}
    </MapContainer>
  )
}
