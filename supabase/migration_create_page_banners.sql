-- Migration: Create table for page banners (estudos and blog)
-- Execute this script in the Supabase SQL Editor

-- Page Banners table
CREATE TABLE IF NOT EXISTS page_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_type TEXT NOT NULL CHECK (page_type IN ('estudos', 'blog')),
  image_url TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger
CREATE TRIGGER update_page_banners_updated_at 
  BEFORE UPDATE ON page_banners 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE page_banners ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read active page banners" 
  ON page_banners FOR SELECT 
  USING (active = true);

-- Admin policies (requires auth)
CREATE POLICY "Authenticated users can manage page banners" 
  ON page_banners FOR ALL 
  USING (auth.role() = 'authenticated');

