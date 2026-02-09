# Golden Snow 360 - Dubai Real Estate Virtual Tours

Dubai real estate platform with immersive Matterport 3D virtual tours.

## Tech Stack
- React + Vite
- Tailwind CSS
- React Router (multi-page)
- Leaflet Maps (Dubai interactive map)
- Supabase (database)
- Matterport 3D Viewer (embedded)

## Pages
- **Home** - Hero section, Dubai map with property markers, featured properties
- **About** - Company introduction, mission, vision, stats
- **VR Room** - Property search/filter with grid and map views
- **Property Detail** - Matterport 3D virtual tour viewer
- **Contact** - Contact form, info, social links

## Admin Panel
- Access: `/admin`
- Manage hero sections, properties (with Matterport links), about content, contact info
- New properties automatically appear on the Dubai map

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase anon key
npm run dev
```

## Supabase Setup
Run `supabase/schema.sql` in the Supabase SQL Editor to create tables and seed data.

## Build
```bash
npm run build
```
