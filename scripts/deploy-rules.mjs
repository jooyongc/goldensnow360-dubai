import { readFileSync } from 'fs'

const TOKEN = process.env.FIREBASE_TOKEN
const PROJECT = 'goldensnow360-dubai'

const rules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf-8')

// Step 1: Create ruleset
const rulesetRes = await fetch(`https://firebaserules.googleapis.com/v1/projects/${PROJECT}/rulesets`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ source: { files: [{ name: 'firestore.rules', content: rules }] } }),
})
const ruleset = await rulesetRes.json()
if (!rulesetRes.ok) { console.error('Ruleset creation failed:', ruleset); process.exit(1) }
console.log('Ruleset created:', ruleset.name)

// Step 2: Create/update release
const releaseRes = await fetch(`https://firebaserules.googleapis.com/v1/projects/${PROJECT}/releases`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: `projects/${PROJECT}/releases/cloud.firestore`, rulesetName: ruleset.name }),
})

if (releaseRes.status === 409) {
  // Release exists, update it
  const updateRes = await fetch(`https://firebaserules.googleapis.com/v1/projects/${PROJECT}/releases/cloud.firestore`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ release: { name: `projects/${PROJECT}/releases/cloud.firestore`, rulesetName: ruleset.name } }),
  })
  const updateData = await updateRes.json()
  if (!updateRes.ok) { console.error('Release update failed:', updateData); process.exit(1) }
  console.log('Release updated:', updateData.name)
} else {
  const release = await releaseRes.json()
  if (!releaseRes.ok) { console.error('Release creation failed:', release); process.exit(1) }
  console.log('Release created:', release.name)
}

console.log('Firestore rules deployed successfully!')
