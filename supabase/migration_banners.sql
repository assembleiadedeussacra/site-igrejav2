-- Migration: Add new fields to banners table
-- Run this migration if the banners table already exists

-- Add new columns to banners table
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS button1_text TEXT,
ADD COLUMN IF NOT EXISTS button1_link TEXT,
ADD COLUMN IF NOT EXISTS button2_text TEXT,
ADD COLUMN IF NOT EXISTS button2_link TEXT;

