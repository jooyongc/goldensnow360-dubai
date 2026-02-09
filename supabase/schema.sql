-- Golden Snow 360 Dubai - Supabase Database Schema
-- Run this SQL in the Supabase SQL Editor to set up the database

-- 1. Admin Users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name VARCHAR(200),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hero Section content
CREATE TABLE IF NOT EXISTS hero_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page VARCHAR(50) NOT NULL DEFAULT 'home',
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  background_image TEXT,
  cta_text VARCHAR(200),
  cta_link VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Properties with Matterport links
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  title_ar VARCHAR(500),
  description TEXT,
  location VARCHAR(500),
  area VARCHAR(200),
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  price VARCHAR(100),
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  size_sqft INTEGER,
  matterport_url TEXT,
  thumbnail TEXT,
  images TEXT[] DEFAULT '{}',
  property_type VARCHAR(100) DEFAULT 'Apartment',
  status VARCHAR(50) DEFAULT 'available',
  featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. About page content
CREATE TABLE IF NOT EXISTS about_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  mission TEXT,
  vision TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. About page stats
CREATE TABLE IF NOT EXISTS about_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label VARCHAR(200) NOT NULL,
  value VARCHAR(100) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Contact information
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT,
  phone VARCHAR(100),
  email VARCHAR(200),
  whatsapp VARCHAR(100),
  working_hours TEXT,
  map_lat DECIMAL(10, 7),
  map_lng DECIMAL(10, 7),
  social_instagram TEXT,
  social_facebook TEXT,
  social_linkedin TEXT,
  social_youtube TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(100),
  subject VARCHAR(500),
  message TEXT NOT NULL,
  property_id UUID REFERENCES properties(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Site settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(200) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin authentication is handled via Supabase Auth
-- Admin user: bruno@goldensnow.ae (created in Supabase Auth dashboard)

-- Insert default hero section
INSERT INTO hero_sections (page, title, subtitle, description, background_image)
VALUES (
  'home',
  'Experience Dubai Properties in 360°',
  'Immersive Virtual Reality Tours of Premium Real Estate',
  'Explore luxury properties across Dubai through cutting-edge Matterport 3D virtual tours. Walk through your dream home from anywhere in the world.',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920'
);

-- Insert default about content
INSERT INTO about_content (title, subtitle, description, mission, vision, image)
VALUES (
  'About Golden Snow 360',
  'Your Trusted Partner in Dubai Real Estate',
  'Golden Snow 360 is a premier real estate brokerage firm based in Dubai, UAE. We specialize in connecting global investors and homebuyers with the finest properties across Dubai''s most prestigious locations.',
  'To revolutionize the Dubai real estate experience through immersive 3D technology, making property exploration accessible to anyone, anywhere in the world.',
  'To become the leading virtual real estate platform in the Middle East, setting new standards for property presentation and client engagement.',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800'
);

-- Insert default about stats
INSERT INTO about_stats (label, value, sort_order) VALUES
('Properties Listed', '500+', 1),
('Virtual Tours', '200+', 2),
('Happy Clients', '1,000+', 3),
('Years Experience', '10+', 4);

-- Insert default contact info
INSERT INTO contact_info (address, phone, email, whatsapp, working_hours, map_lat, map_lng, social_instagram)
VALUES (
  'Office 1205, Burj Khalifa Tower, Downtown Dubai, UAE',
  '+971 4 123 4567',
  'info@goldensnow360.com',
  '+971501234567',
  'Sunday - Thursday: 9:00 AM - 6:00 PM',
  25.1972,
  55.2744,
  'https://instagram.com/goldensnow360'
);

-- Insert default site settings
INSERT INTO site_settings (key, value, type) VALUES
('site_name', 'Golden Snow 360', 'text'),
('site_tagline', 'Dubai Real Estate Virtual Tours', 'text'),
('logo_url', '', 'image'),
('primary_color', '#c9a01e', 'color')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read hero_sections" ON hero_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Public read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public read about_content" ON about_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public read about_stats" ON about_stats FOR SELECT USING (true);
CREATE POLICY "Public read contact_info" ON contact_info FOR SELECT USING (is_active = true);
CREATE POLICY "Public insert contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_hero_sections_page ON hero_sections(page);
