import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://huaatxezbexldcbxmvdc.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export const DEMO_MODE = !supabaseAnonKey

export const demoProperties = [
  {
    id: 1,
    title: 'Palm Jumeirah Villa',
    title_ar: 'فيلا نخلة جميرا',
    description: 'Luxury 5-bedroom villa with private beach access and stunning sea views. Experience the epitome of Dubai luxury living.',
    location: 'Palm Jumeirah',
    area: 'Palm Jumeirah',
    lat: 25.1124,
    lng: 55.1390,
    price: 'AED 25,000,000',
    bedrooms: 5,
    bathrooms: 6,
    size_sqft: 8500,
    matterport_url: 'https://my.matterport.com/show/?m=SxQL3iGyvft',
    thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    property_type: 'Villa',
    status: 'available',
    featured: true,
    created_at: '2026-01-15'
  },
  {
    id: 2,
    title: 'Downtown Dubai Penthouse',
    title_ar: 'بنتهاوس وسط مدينة دبي',
    description: 'Exclusive penthouse with panoramic Burj Khalifa views. Modern design with premium finishes throughout.',
    location: 'Downtown Dubai',
    area: 'Downtown Dubai',
    lat: 25.1972,
    lng: 55.2744,
    price: 'AED 18,500,000',
    bedrooms: 4,
    bathrooms: 5,
    size_sqft: 6200,
    matterport_url: 'https://my.matterport.com/show/?m=SxQL3iGyvft',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    property_type: 'Penthouse',
    status: 'available',
    featured: true,
    created_at: '2026-01-20'
  },
  {
    id: 3,
    title: 'Dubai Marina Apartment',
    title_ar: 'شقة دبي مارينا',
    description: 'Stunning 3-bedroom apartment in the heart of Dubai Marina with marina and sea views.',
    location: 'Dubai Marina',
    area: 'Dubai Marina',
    lat: 25.0805,
    lng: 55.1403,
    price: 'AED 5,200,000',
    bedrooms: 3,
    bathrooms: 4,
    size_sqft: 2800,
    matterport_url: 'https://my.matterport.com/show/?m=SxQL3iGyvft',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    property_type: 'Apartment',
    status: 'available',
    featured: true,
    created_at: '2026-02-01'
  },
  {
    id: 4,
    title: 'Business Bay Office',
    title_ar: 'مكتب خليج الأعمال',
    description: 'Premium office space with canal views. Fully fitted and ready for immediate occupation.',
    location: 'Business Bay',
    area: 'Business Bay',
    lat: 25.1851,
    lng: 55.2628,
    price: 'AED 3,800,000',
    bedrooms: 0,
    bathrooms: 2,
    size_sqft: 3500,
    matterport_url: 'https://my.matterport.com/show/?m=SxQL3iGyvft',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    property_type: 'Office',
    status: 'available',
    featured: false,
    created_at: '2026-02-05'
  },
  {
    id: 5,
    title: 'JBR Beachfront Residence',
    title_ar: 'سكن جي بي آر على الشاطئ',
    description: 'Beachfront 2-bedroom apartment with direct beach access and stunning views of the Arabian Gulf.',
    location: 'Jumeirah Beach Residence',
    area: 'JBR',
    lat: 25.0780,
    lng: 55.1340,
    price: 'AED 4,500,000',
    bedrooms: 2,
    bathrooms: 3,
    size_sqft: 2100,
    matterport_url: 'https://my.matterport.com/show/?m=SxQL3iGyvft',
    thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    property_type: 'Apartment',
    status: 'available',
    featured: false,
    created_at: '2026-02-07'
  }
]

export const demoHeroContent = {
  title: 'Experience Dubai Properties in 360°',
  subtitle: 'Immersive Virtual Reality Tours of Premium Real Estate',
  description: 'Explore luxury properties across Dubai through cutting-edge Matterport 3D virtual tours. Walk through your dream home from anywhere in the world.',
  background_image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920'
}

export const demoAboutContent = {
  title: 'About Golden Snow 360',
  subtitle: 'Your Trusted Partner in Dubai Real Estate',
  description: `Golden Snow 360 is a premier real estate brokerage firm based in Dubai, UAE. We specialize in connecting global investors and homebuyers with the finest properties across Dubai's most prestigious locations.

Our innovative approach combines traditional real estate expertise with cutting-edge Matterport 3D virtual tour technology, allowing clients worldwide to experience properties as if they were physically present.

With deep knowledge of the Dubai property market and a commitment to excellence, we provide end-to-end service from property discovery through to final handover.`,
  mission: 'To revolutionize the Dubai real estate experience through immersive 3D technology, making property exploration accessible to anyone, anywhere in the world.',
  vision: 'To become the leading virtual real estate platform in the Middle East, setting new standards for property presentation and client engagement.',
  image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
  stats: [
    { label: 'Properties Listed', value: '500+' },
    { label: 'Virtual Tours', value: '200+' },
    { label: 'Happy Clients', value: '1,000+' },
    { label: 'Years Experience', value: '10+' }
  ]
}

export const demoContactInfo = {
  address: 'Office 1205, Burj Khalifa Tower, Downtown Dubai, UAE',
  phone: '+971 4 123 4567',
  email: 'info@goldensnow360.com',
  whatsapp: '+971501234567',
  working_hours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
  map_lat: 25.1972,
  map_lng: 55.2744,
  social: {
    instagram: 'https://instagram.com/goldensnow360',
    facebook: 'https://facebook.com/goldensnow360',
    linkedin: 'https://linkedin.com/company/goldensnow360',
    youtube: 'https://youtube.com/@goldensnow360'
  }
}
