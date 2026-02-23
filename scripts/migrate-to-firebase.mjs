/**
 * Migration Script: Supabase → Firebase Firestore
 *
 * Prerequisites:
 *   1. npm install firebase-admin @supabase/supabase-js (dev dependencies, run locally)
 *   2. Place your Firebase service account key at ./serviceAccountKey.json
 *   3. Set environment variables:
 *      - SUPABASE_URL
 *      - SUPABASE_SERVICE_ROLE_KEY
 *      - FIREBASE_PROJECT_ID (or reads from serviceAccountKey.json)
 *
 * Usage:
 *   node scripts/migrate-to-firebase.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'

// --- Config ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://huaatxezbexldcbxmvdc.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: Set SUPABASE_SERVICE_ROLE_KEY environment variable')
  process.exit(1)
}

let serviceAccount
try {
  serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))
} catch {
  console.error('ERROR: Place serviceAccountKey.json in the project root')
  process.exit(1)
}

// --- Initialize ---
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

// --- Helper ---
function convertTimestamps(obj) {
  const result = { ...obj }
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      result[key] = new Date(value)
    }
  }
  return result
}

async function migrateCollection(tableName, collectionName, options = {}) {
  const { fixedId, idField, transform } = options

  console.log(`\nMigrating: ${tableName} → ${collectionName}`)

  let query = supabase.from(tableName).select('*')
  if (options.orderBy) query = query.order(options.orderBy)

  const { data, error } = await query
  if (error) {
    console.error(`  ERROR reading ${tableName}:`, error.message)
    return
  }

  if (!data || data.length === 0) {
    console.log(`  No data found in ${tableName}`)
    return
  }

  console.log(`  Found ${data.length} rows`)

  const batch = db.batch()

  for (const row of data) {
    const transformed = transform ? transform(row) : convertTimestamps(row)
    let docId

    if (fixedId) {
      docId = typeof fixedId === 'function' ? fixedId(row) : fixedId
    } else if (idField && row[idField]) {
      docId = String(row[idField])
    } else {
      docId = String(row.id)
    }

    // Remove the original id field from the data (it's now the document ID)
    const { id, ...docData } = transformed

    const docRef = db.collection(collectionName).doc(docId)
    batch.set(docRef, docData)
  }

  await batch.commit()
  console.log(`  Migrated ${data.length} documents to ${collectionName}`)
}

// --- Main ---
async function main() {
  console.log('=== Supabase → Firestore Migration ===\n')

  // 1. Properties (use existing UUID as document ID)
  await migrateCollection('properties', 'properties', {
    orderBy: 'created_at',
  })

  // 2. Hero sections → fixed ID 'home'
  await migrateCollection('hero_sections', 'hero_sections', {
    fixedId: (row) => row.page || 'home',
  })

  // 3. About content → fixed ID 'main'
  await migrateCollection('about_content', 'about_content', {
    fixedId: 'main',
  })

  // 4. About stats
  await migrateCollection('about_stats', 'about_stats', {
    orderBy: 'sort_order',
  })

  // 5. Contact info → fixed ID 'main'
  await migrateCollection('contact_info', 'contact_info', {
    fixedId: 'main',
  })

  // 6. Contact submissions
  await migrateCollection('contact_submissions', 'contact_submissions', {
    orderBy: 'created_at',
  })

  // 7. Site settings → single document 'config'
  console.log('\nMigrating: site_settings → site_settings/config')
  const { data: settings, error: settingsError } = await supabase
    .from('site_settings')
    .select('*')

  if (settingsError) {
    console.error('  ERROR reading site_settings:', settingsError.message)
  } else if (settings && settings.length > 0) {
    const configDoc = {}
    for (const row of settings) {
      configDoc[row.key] = row.value
    }
    configDoc.updated_at = new Date()
    await db.collection('site_settings').doc('config').set(configDoc)
    console.log(`  Migrated ${settings.length} settings to site_settings/config`)
  } else {
    console.log('  No site_settings found')
  }

  console.log('\n=== Migration Complete ===')
}

main().catch(console.error)
