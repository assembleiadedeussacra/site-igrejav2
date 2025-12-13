-- Migration: Add button fields to banners table
-- Run this migration if the banners table already exists but is missing button columns
-- Execute this script in the Supabase SQL Editor

-- Add new columns to banners table (if they don't exist)
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS button1_text TEXT,
ADD COLUMN IF NOT EXISTS button1_link TEXT,
ADD COLUMN IF NOT EXISTS button2_text TEXT,
ADD COLUMN IF NOT EXISTS button2_link TEXT;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'banners'
AND column_name IN ('logo_url', 'title', 'description', 'button1_text', 'button1_link', 'button2_text', 'button2_link')
ORDER BY column_name;

