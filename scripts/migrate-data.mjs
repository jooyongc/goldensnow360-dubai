// Migration script: Write Supabase data to Firestore
// Uses Firebase client SDK (no service account needed)
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, collection, Timestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyA4fDBW-P53vp0szQqr1kf7_y6ErcXR-GY',
  authDomain: 'goldensnow360-dubai.firebaseapp.com',
  projectId: 'goldensnow360-dubai',
  storageBucket: 'goldensnow360-dubai.firebasestorage.app',
  messagingSenderId: '1062601862015',
  appId: '1:1062601862015:web:cf8ed8568baa1c6e54484a',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

function toTimestamp(isoStr) {
  return isoStr ? Timestamp.fromDate(new Date(isoStr)) : Timestamp.now()
}

async function migrate() {
  console.log('Starting Firestore data migration...\n')

  // 1. Properties (use original UUIDs as doc IDs)
  const properties = [
    {
      id: 'e2b5a3f1-ca72-4b9f-8ec3-fe62791f526a',
      title: 'Dubai Office',
      title_ar: '',
      description: '',
      location: '두바이 몰, Financial Center Street, Downtown Dubai',
      area: 'Downtown Dubai',
      lat: 25.197044,
      lng: 55.2789516,
      price: '',
      bedrooms: 0,
      bathrooms: 0,
      size_sqft: 0,
      matterport_url: 'https://my.matterport.com/show/?m=WwDs47XEEWr',
      thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmIyd2gcBLzz261RVYlLz0TREc2ghC7x0w3A&s',
      images: [],
      property_type: 'Office',
      status: 'available',
      featured: true,
      tags: [],
      created_at: '2026-02-09T13:53:57.13007+00:00',
      updated_at: '2026-02-09T13:56:33.004+00:00',
    },
    {
      id: 'c21467a0-e790-441d-85d2-4b19b0aa5333',
      title: 'DAMAC Hills Villa',
      title_ar: '',
      description: '',
      location: 'Damac Hills, Al Hebiah 3, 두바이',
      area: 'Al Hebiah 3',
      lat: 25.0281276,
      lng: 55.2645275,
      price: '',
      bedrooms: 0,
      bathrooms: 0,
      size_sqft: 0,
      matterport_url: 'https://my.matterport.com/show/?m=WwDs47XEEWr',
      thumbnail: '',
      images: [],
      property_type: 'Villa',
      status: 'available',
      featured: true,
      tags: [],
      created_at: '2026-02-09T13:53:03.128181+00:00',
      updated_at: '2026-02-09T13:56:36.538+00:00',
    },
    {
      id: 'a5c796eb-92af-4b5f-9930-4ddb1cbf1bc1',
      title: 'Palm Jumeira Office',
      title_ar: '',
      description: '',
      location: 'Palm Strip Center, Jumeira Street, Jumeirah',
      area: 'Jumeirah',
      lat: 25.2342992,
      lng: 55.2653434,
      price: '2000000',
      bedrooms: 4,
      bathrooms: 3,
      size_sqft: 500,
      matterport_url: 'https://my.matterport.com/show/?m=WwDs47XEEWr',
      thumbnail: 'https://img1.daumcdn.net/thumb/R1280x0.fwebp/?fname=http://t1.daumcdn.net/brunch/service/user/9JDV/image/8nINsjujMf6T6wFgSp2YDNK2NyE.JPG',
      images: [],
      property_type: 'Office',
      status: 'available',
      featured: true,
      tags: [],
      created_at: '2026-02-09T14:10:49.666806+00:00',
      updated_at: '2026-02-09T14:11:30.013+00:00',
    },
  ]

  for (const prop of properties) {
    const { id, ...data } = prop
    data.created_at = toTimestamp(data.created_at)
    data.updated_at = toTimestamp(data.updated_at)
    await setDoc(doc(db, 'properties', id), data)
    console.log(`  ✓ properties/${id} (${data.title})`)
  }
  console.log(`\n✓ Properties: ${properties.length} docs written\n`)

  // 2. Hero Sections (fixed ID: 'home')
  const heroData = {
    page: 'home',
    title: 'Experience Dubai Properties in 360°',
    subtitle: 'Immersive Virtual Reality Tours of Premium Real Estate',
    description: 'Explore luxury properties across Dubai through cutting-edge Matterport 3D virtual tours. Walk through your dream home from anywhere in the world.',
    background_image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920',
    cta_text: null,
    cta_link: null,
    is_active: true,
    sort_order: 0,
    created_at: toTimestamp('2026-02-09T12:36:23.700107+00:00'),
    updated_at: toTimestamp('2026-02-09T12:36:23.700107+00:00'),
  }
  await setDoc(doc(db, 'hero_sections', 'home'), heroData)
  console.log('✓ hero_sections/home written\n')

  // 3. About Content (fixed ID: 'main')
  const aboutData = {
    title: 'About Golden Snow 360',
    subtitle: 'Your Trusted Partner in Dubai Real Estate',
    description: 'Golden Snow 360 is a premier real estate brokerage firm based in Dubai, UAE. We specialize in connecting global investors and homebuyers with the finest properties across Dubai\'s most prestigious locations.',
    mission: 'To revolutionize the Dubai real estate experience through immersive 3D technology, making property exploration accessible to anyone, anywhere in the world.',
    vision: 'To become the leading virtual real estate platform in the Middle East, setting new standards for property presentation and client engagement.',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
    is_active: true,
    created_at: toTimestamp('2026-02-09T12:36:23.700107+00:00'),
    updated_at: toTimestamp('2026-02-09T12:36:23.700107+00:00'),
  }
  await setDoc(doc(db, 'about_content', 'main'), aboutData)
  console.log('✓ about_content/main written\n')

  // 4. About Stats (use original UUIDs)
  const stats = [
    { id: '7a1d8556-11b9-465f-95b2-063bf218d221', label: 'Properties Listed', value: '500+', sort_order: 1 },
    { id: '603a7a04-7dcf-4267-bad3-46364d1eaa9e', label: 'Virtual Tours', value: '200+', sort_order: 2 },
    { id: 'c3daaf4d-28c6-4478-ac38-5e27a2d28860', label: 'Happy Clients', value: '1,000+', sort_order: 3 },
    { id: '3af91cb2-e0e6-4d6c-a01a-13d0b5cdd696', label: 'Years Experience', value: '10+', sort_order: 4 },
  ]
  for (const stat of stats) {
    const { id, ...data } = stat
    data.created_at = toTimestamp('2026-02-09T12:36:23.700107+00:00')
    await setDoc(doc(db, 'about_stats', id), data)
    console.log(`  ✓ about_stats/${id} (${data.label})`)
  }
  console.log(`\n✓ About Stats: ${stats.length} docs written\n`)

  // 5. Contact Info (fixed ID: 'main')
  const contactData = {
    address: 'Office 1205, Burj Khalifa Tower, Downtown Dubai, UAE',
    phone: '+971 50 865 4634',
    email: 'bruno@goldensnow.ae',
    whatsapp: '+971 50 865 4634',
    working_hours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
    map_lat: 25.1972,
    map_lng: 55.2744,
    social_instagram: 'https://instagram.com/goldensnow360',
    social_facebook: null,
    social_linkedin: null,
    social_youtube: null,
    is_active: true,
    created_at: toTimestamp('2026-02-09T12:36:23.700107+00:00'),
    updated_at: toTimestamp('2026-02-09T13:58:02.613+00:00'),
  }
  await setDoc(doc(db, 'contact_info', 'main'), contactData)
  console.log('✓ contact_info/main written\n')

  // 6. Site Settings (key-value → single doc with fixed ID: 'config')
  const settingsData = {
    site_name: 'Golden Snow 360',
    site_tagline: 'Dubai Real Estate Virtual Tours',
    logo_url: '',
    primary_color: '#c9a01e',
    created_at: toTimestamp('2026-02-09T12:36:23.700107+00:00'),
    updated_at: toTimestamp('2026-02-09T12:36:23.700107+00:00'),
  }
  await setDoc(doc(db, 'site_settings', 'config'), settingsData)
  console.log('✓ site_settings/config written\n')

  // 7. Contact Submissions - empty, nothing to migrate
  console.log('✓ contact_submissions: 0 docs (table was empty)\n')

  console.log('=== Migration complete! ===')
  console.log('Total: 3 properties + 1 hero + 1 about + 4 stats + 1 contact + 1 settings = 11 documents')

  process.exit(0)
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
