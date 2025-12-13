-- Migration: Add SEO fields to posts table
-- This migration adds comprehensive SEO fields to support SEO-first architecture

-- Add SEO fields to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS noindex BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS nofollow BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS og_title TEXT,
ADD COLUMN IF NOT EXISTS og_description TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS schema_type TEXT DEFAULT 'Article' CHECK (schema_type IN ('Article', 'BlogPosting', 'Study'));

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug) WHERE slug IS NOT NULL;

-- Create index for published posts (performance optimization)
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, type) WHERE published = true;

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug_lookup ON posts(slug, published) WHERE slug IS NOT NULL AND published = true;

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    -- Convert to lowercase
    result := LOWER(input_text);
    
    -- Remove accents (basic approach - can be enhanced)
    result := translate(result, 'áàâãäéèêëíìîïóòôõöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn');
    
    -- Replace spaces and special characters with hyphens
    result := regexp_replace(result, '[^a-z0-9]+', '-', 'g');
    
    -- Remove leading/trailing hyphens
    result := trim(both '-' from result);
    
    -- Limit length to 100 characters
    IF length(result) > 100 THEN
        result := left(result, 100);
        result := rtrim(result, '-');
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to ensure unique slug
CREATE OR REPLACE FUNCTION ensure_unique_slug(base_slug TEXT, post_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    final_slug := base_slug;
    
    -- Check if slug exists (excluding current post if updating)
    WHILE EXISTS (
        SELECT 1 FROM posts 
        WHERE slug = final_slug 
        AND (post_id IS NULL OR id != post_id)
    ) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
        
        -- Safety check to prevent infinite loop
        IF counter > 1000 THEN
            RAISE EXCEPTION 'Unable to generate unique slug after 1000 attempts';
        END IF;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Update existing posts to generate slugs from titles (if slug is NULL)
UPDATE posts
SET slug = ensure_unique_slug(generate_slug(title))
WHERE slug IS NULL AND title IS NOT NULL;

-- Add constraint to ensure slug is not empty if provided
ALTER TABLE posts
ADD CONSTRAINT posts_slug_not_empty CHECK (slug IS NULL OR length(trim(slug)) > 0);
