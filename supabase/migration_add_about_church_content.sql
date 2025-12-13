-- Migration: Add church content fields to about_page_cover table
-- Execute this script in the Supabase SQL Editor

-- Add fields for church content
ALTER TABLE about_page_cover 
ADD COLUMN IF NOT EXISTS church_text_part1 TEXT,
ADD COLUMN IF NOT EXISTS church_image_url TEXT,
ADD COLUMN IF NOT EXISTS church_text_part2 TEXT;

