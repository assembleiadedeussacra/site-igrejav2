-- Migration: Create post_relations table for related posts
-- Date: 2024

-- Create post_relations table
CREATE TABLE IF NOT EXISTS post_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  related_post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, related_post_id)
);

-- Enable RLS
ALTER TABLE post_relations ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public can read post relations" ON post_relations FOR SELECT USING (true);

-- Admin policy
CREATE POLICY "Authenticated users can manage post relations" ON post_relations FOR ALL USING (auth.role() = 'authenticated');

