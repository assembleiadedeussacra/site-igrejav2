-- Migration: Create page_views table for analytics
-- This table tracks page views for analytics purposes

CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path_created_at ON page_views(page_path, created_at DESC);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Public can insert (for tracking)
CREATE POLICY "Public can insert page views" ON page_views FOR INSERT WITH CHECK (true);

-- Authenticated users can read all (for admin analytics)
CREATE POLICY "Authenticated users can read page views" ON page_views FOR SELECT USING (auth.role() = 'authenticated');

-- Function to get page view statistics
CREATE OR REPLACE FUNCTION get_page_view_stats(
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  page_path TEXT,
  page_title TEXT,
  view_count BIGINT,
  unique_views BIGINT,
  last_viewed TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pv.page_path,
    MAX(pv.page_title) as page_title,
    COUNT(*)::BIGINT as view_count,
    COUNT(DISTINCT pv.session_id)::BIGINT as unique_views,
    MAX(pv.created_at) as last_viewed
  FROM page_views pv
  WHERE pv.created_at >= NOW() - (days_back || ' days')::INTERVAL
  GROUP BY pv.page_path
  ORDER BY view_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get daily page views
CREATE OR REPLACE FUNCTION get_daily_page_views(
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  date DATE,
  view_count BIGINT,
  unique_views BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(pv.created_at) as date,
    COUNT(*)::BIGINT as view_count,
    COUNT(DISTINCT pv.session_id)::BIGINT as unique_views
  FROM page_views pv
  WHERE pv.created_at >= NOW() - (days_back || ' days')::INTERVAL
  GROUP BY DATE(pv.created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
