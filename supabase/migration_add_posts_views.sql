-- Migration: Add views tracking to posts table
-- Execute this script in the Supabase SQL Editor

-- Add views count column
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;

-- Create index for better performance on views queries
CREATE INDEX IF NOT EXISTS idx_posts_views ON posts(views DESC);

-- Create index for better performance on type and published queries
CREATE INDEX IF NOT EXISTS idx_posts_type_published ON posts(type, published);

