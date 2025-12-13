-- Migration: Add button style customization fields to banners table
-- Execute this script in the Supabase SQL Editor

-- Add button style fields for button 1
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS button1_bg_color TEXT DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS button1_text_color TEXT DEFAULT '#1a1a1a',
ADD COLUMN IF NOT EXISTS button1_hover_bg_color TEXT DEFAULT '#f0f0f0',
ADD COLUMN IF NOT EXISTS button1_hover_text_color TEXT DEFAULT '#1a1a1a',
ADD COLUMN IF NOT EXISTS button1_size TEXT DEFAULT 'md' CHECK (button1_size IN ('sm', 'md', 'lg')),
ADD COLUMN IF NOT EXISTS button1_style TEXT DEFAULT 'solid' CHECK (button1_style IN ('solid', 'outline', 'ghost'));

-- Add button style fields for button 2
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS button2_bg_color TEXT DEFAULT 'rgba(255, 255, 255, 0.1)',
ADD COLUMN IF NOT EXISTS button2_text_color TEXT DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS button2_hover_bg_color TEXT DEFAULT 'rgba(255, 255, 255, 0.2)',
ADD COLUMN IF NOT EXISTS button2_hover_text_color TEXT DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS button2_size TEXT DEFAULT 'md' CHECK (button2_size IN ('sm', 'md', 'lg')),
ADD COLUMN IF NOT EXISTS button2_style TEXT DEFAULT 'outline' CHECK (button2_style IN ('solid', 'outline', 'ghost'));

-- Add open in new tab fields
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS button1_open_new_tab BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS button2_open_new_tab BOOLEAN DEFAULT false;

-- Add border radius fields for each button
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS button1_border_radius INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS button2_border_radius INTEGER DEFAULT 10;

-- Add global button style (applies to all buttons)
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS buttons_global_style TEXT DEFAULT 'individual' CHECK (buttons_global_style IN ('individual', 'unified'));

-- Add overlay darkness control (0-100, where 0 is transparent and 100 is fully dark)
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS overlay_opacity INTEGER DEFAULT 50 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 100);

-- Add overlay color (hex color code for the overlay)
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS overlay_color TEXT DEFAULT '#232d82';

-- Verify the columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'banners'
AND column_name LIKE 'button%'
ORDER BY column_name;

