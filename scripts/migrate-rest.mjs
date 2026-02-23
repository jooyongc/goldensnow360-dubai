// Migration script: Write Supabase data to Firestore via REST API
// No authentication needed - Firestore rules allow public write for now

const PROJECT_ID = 'goldensnow360-dubai'
const TOKEN = process.env.FIREBASE_TOKEN
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null }
  if (typeof val === 'boolean') return { booleanValue: val }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: String(val) }
    return { doubleValue: val }
  }
  if (typeof val === 'string') {
    // Check if it's an ISO date string
    if (/^\d{4}-\d{2}-\d{2}T/.test(val)) {
      return { timestampValue: new Date(val).toISOString() }
    }
    return { stringValue: val }
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } }
  }
  if (typeof val === 'object') {
    const fields = {}
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v)
    }
    return { mapValue: { fields } }
  }
  return { stringValue: String(val) }
}

function toFirestoreDoc(data) {
  const fields = {}
  for (const [key, val] of Object.entries(data)) {
    fields[key] = toFirestoreValue(val)
  }
  return { fields }
}

async function writeDoc(collectionId, docId, data) {
  const url = `${BASE}/${collectionId}/${docId}`
  const body = toFirestoreDoc(data)

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to write ${collectionId}/${docId}: ${res.status} ${err}`)
  }
  return true
}

async function migrate() {
  console.log('Starting Firestore data migration via REST API...\n')

  // 1. Properties
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
      created_at: '2026-02-09T13:53:57.130070+00:00',
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
    await writeDoc('properties', id, data)
    console.log(`  ✓ properties/${id} (${data.title})`)
  }
  console.log(`\n✓ Properties: ${properties.length} docs\n`)

  // 2. Hero Sections
  await writeDoc('hero_sections', 'home', {
    page: 'home',
    title: 'Experience Dubai Properties in 360°',
    subtitle: 'Immersive Virtual Reality Tours of Premium Real Estate',
    description: 'Explore luxury properties across Dubai through cutting-edge Matterport 3D virtual tours. Walk through your dream home from anywhere in the world.',
    background_image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920',
    cta_text: null,
    cta_link: null,
    is_active: true,
    sort_order: 0,
    created_at: '2026-02-09T12:36:23.700107+00:00',
    updated_at: '2026-02-09T12:36:23.700107+00:00',
  })
  console.log('✓ hero_sections/home\n')

  // 3. About Content
  await writeDoc('about_content', 'main', {
    title: 'About Golden Snow 360',
    subtitle: 'Your Trusted Partner in Dubai Real Estate',
    description: "Golden Snow 360 is a premier real estate brokerage firm based in Dubai, UAE. We specialize in connecting global investors and homebuyers with the finest properties across Dubai's most prestigious locations.",
    mission: 'To revolutionize the Dubai real estate experience through immersive 3D technology, making property exploration accessible to anyone, anywhere in the world.',
    vision: 'To become the leading virtual real estate platform in the Middle East, setting new standards for property presentation and client engagement.',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
    is_active: true,
    created_at: '2026-02-09T12:36:23.700107+00:00',
    updated_at: '2026-02-09T12:36:23.700107+00:00',
  })
  console.log('✓ about_content/main\n')

  // 4. About Stats
  const stats = [
    { id: '7a1d8556-11b9-465f-95b2-063bf218d221', label: 'Properties Listed', value: '500+', sort_order: 1, created_at: '2026-02-09T12:36:23.700107+00:00' },
    { id: '603a7a04-7dcf-4267-bad3-46364d1eaa9e', label: 'Virtual Tours', value: '200+', sort_order: 2, created_at: '2026-02-09T12:36:23.700107+00:00' },
    { id: 'c3daaf4d-28c6-4478-ac38-5e27a2d28860', label: 'Happy Clients', value: '1,000+', sort_order: 3, created_at: '2026-02-09T12:36:23.700107+00:00' },
    { id: '3af91cb2-e0e6-4d6c-a01a-13d0b5cdd696', label: 'Years Experience', value: '10+', sort_order: 4, created_at: '2026-02-09T12:36:23.700107+00:00' },
  ]
  for (const stat of stats) {
    const { id, ...data } = stat
    await writeDoc('about_stats', id, data)
    console.log(`  ✓ about_stats/${id} (${data.label})`)
  }
  console.log(`\n✓ About Stats: ${stats.length} docs\n`)

  // 5. Contact Info
  await writeDoc('contact_info', 'main', {
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
    created_at: '2026-02-09T12:36:23.700107+00:00',
    updated_at: '2026-02-09T13:58:02.613+00:00',
  })
  console.log('✓ contact_info/main\n')

  // 6. Site Settings (key-value → single doc)
  await writeDoc('site_settings', 'config', {
    site_name: 'Golden Snow 360',
    site_tagline: 'Dubai Real Estate Virtual Tours',
    logo_url: '',
    primary_color: '#c9a01e',
    created_at: '2026-02-09T12:36:23.700107+00:00',
    updated_at: '2026-02-09T12:36:23.700107+00:00',
  })
  console.log('✓ site_settings/config\n')

  console.log('=== Migration complete! ===')
  console.log('11 documents written across 6 collections')
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
