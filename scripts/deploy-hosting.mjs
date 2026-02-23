import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'
import { createHash } from 'crypto'
import { gzipSync } from 'zlib'

const TOKEN = process.env.FIREBASE_TOKEN
const PROJECT = 'goldensnow360-dubai'
const SITE = 'goldensnow360-dubai'
const DIST = new URL('../dist', import.meta.url).pathname

function getAllFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...getAllFiles(full))
    } else {
      files.push(full)
    }
  }
  return files
}

async function api(path, opts = {}) {
  const url = path.startsWith('http') ? path : `https://firebasehosting.googleapis.com/v1beta1/${path}`
  const res = await fetch(url, {
    ...opts,
    headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json', ...opts.headers },
  })
  if (!res.ok && opts.method !== 'GET') {
    const err = await res.text()
    throw new Error(`API error ${res.status}: ${err}`)
  }
  return res.json()
}

async function deploy() {
  console.log('Starting Firebase Hosting deployment...\n')

  // Step 1: Create new version
  const version = await api(`sites/${SITE}/versions`, {
    method: 'POST',
    body: JSON.stringify({
      config: {
        rewrites: [{ glob: '**', path: '/index.html' }],
      },
    }),
  })
  const versionName = version.name
  console.log('Version created:', versionName)

  // Step 2: Collect files and their hashes
  const allFiles = getAllFiles(DIST)
  const fileMap = {} // path -> gzipped hash
  const fileData = {} // hash -> gzipped content

  for (const filePath of allFiles) {
    const relPath = '/' + relative(DIST, filePath)
    const content = readFileSync(filePath)
    const gzipped = gzipSync(content)
    const hash = createHash('sha256').update(gzipped).digest('hex')
    fileMap[relPath] = hash
    fileData[hash] = gzipped
  }

  console.log(`Files to deploy: ${Object.keys(fileMap).length}`)

  // Step 3: Populate files
  const populateRes = await api(`${versionName}:populateFiles`, {
    method: 'POST',
    body: JSON.stringify({ files: fileMap }),
  })

  const uploadUrl = populateRes.uploadUrl
  const requiredHashes = populateRes.uploadRequiredHashes || []
  console.log(`Files to upload: ${requiredHashes.length} (${Object.keys(fileMap).length - requiredHashes.length} cached)`)

  // Step 4: Upload required files
  for (const hash of requiredHashes) {
    const data = fileData[hash]
    const res = await fetch(`${uploadUrl}/${hash}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/octet-stream',
      },
      body: data,
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Upload failed for ${hash}: ${err}`)
    }
  }
  if (requiredHashes.length > 0) console.log('Files uploaded successfully')

  // Step 5: Finalize version
  await api(`${versionName}?update_mask=status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'FINALIZED' }),
  })
  console.log('Version finalized')

  // Step 6: Release
  await api(`sites/${SITE}/releases?versionName=${versionName}`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
  console.log('\n=== Deployment complete! ===')
  console.log(`Live at: https://${SITE}.web.app`)
  console.log(`Also at: https://${SITE}.firebaseapp.com`)
}

deploy().catch(err => {
  console.error('Deployment failed:', err)
  process.exit(1)
})
