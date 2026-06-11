-- Enriquecimento de analytics: dispositivo, localização e RPCs filtradas

ALTER TABLE page_views ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS os TEXT;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS country TEXT;

CREATE INDEX IF NOT EXISTS idx_page_views_device ON page_views(device_type);
CREATE INDEX IF NOT EXISTS idx_page_views_city ON page_views(city);

CREATE OR REPLACE FUNCTION public.analytics_matches_page_category(
  path TEXT,
  category TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF category IS NULL OR category = '' OR category = 'all' THEN
    RETURN TRUE;
  END IF;

  CASE category
    WHEN 'home' THEN RETURN path = '/';
    WHEN 'blog' THEN RETURN path = '/blog' OR path LIKE '/blog/%';
    WHEN 'estudos' THEN RETURN path = '/estudos' OR path LIKE '/estudos/%';
    WHEN 'sobre' THEN RETURN path = '/sobre-nos';
    WHEN 'other' THEN
      RETURN path <> '/'
        AND path <> '/blog' AND path NOT LIKE '/blog/%'
        AND path <> '/estudos' AND path NOT LIKE '/estudos/%'
        AND path <> '/sobre-nos';
    ELSE RETURN TRUE;
  END CASE;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_filtered_views(
  days_back INTEGER,
  page_category TEXT DEFAULT NULL,
  device_filter TEXT DEFAULT NULL,
  city_filter TEXT DEFAULT NULL
)
RETURNS SETOF page_views
LANGUAGE sql
STABLE
AS $$
  SELECT pv.*
  FROM page_views pv
  WHERE pv.created_at >= NOW() - (days_back || ' days')::INTERVAL
    AND analytics_matches_page_category(pv.page_path, page_category)
    AND (
      device_filter IS NULL OR device_filter = '' OR device_filter = 'all'
      OR pv.device_type = device_filter
    )
    AND (
      city_filter IS NULL OR city_filter = ''
      OR lower(coalesce(pv.city, '')) = lower(city_filter)
    );
$$;

CREATE OR REPLACE FUNCTION get_page_view_stats(
  days_back INTEGER DEFAULT 30,
  page_category TEXT DEFAULT NULL,
  device_filter TEXT DEFAULT NULL,
  city_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  page_path TEXT,
  page_title TEXT,
  view_count BIGINT,
  unique_views BIGINT,
  last_viewed TIMESTAMPTZ
) AS $$
BEGIN
  IF NOT is_site_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT
    pv.page_path,
    MAX(pv.page_title) AS page_title,
    COUNT(*)::BIGINT AS view_count,
    COUNT(DISTINCT pv.session_id)::BIGINT AS unique_views,
    MAX(pv.created_at) AS last_viewed
  FROM analytics_filtered_views(days_back, page_category, device_filter, city_filter) pv
  GROUP BY pv.page_path
  ORDER BY view_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION get_daily_page_views(
  days_back INTEGER DEFAULT 30,
  page_category TEXT DEFAULT NULL,
  device_filter TEXT DEFAULT NULL,
  city_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  date DATE,
  view_count BIGINT,
  unique_views BIGINT
) AS $$
BEGIN
  IF NOT is_site_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT
    DATE(pv.created_at) AS date,
    COUNT(*)::BIGINT AS view_count,
    COUNT(DISTINCT pv.session_id)::BIGINT AS unique_views
  FROM analytics_filtered_views(days_back, page_category, device_filter, city_filter) pv
  GROUP BY DATE(pv.created_at)
  ORDER BY date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION get_analytics_summary(
  days_back INTEGER DEFAULT 30,
  page_category TEXT DEFAULT NULL,
  device_filter TEXT DEFAULT NULL,
  city_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  period_views BIGINT,
  unique_visitors BIGINT,
  unique_pages BIGINT,
  avg_daily_views NUMERIC
) AS $$
BEGIN
  IF NOT is_site_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  WITH filtered AS (
    SELECT * FROM analytics_filtered_views(days_back, page_category, device_filter, city_filter)
  ),
  daily AS (
    SELECT DATE(created_at) AS d, COUNT(*)::BIGINT AS c
    FROM filtered
    GROUP BY DATE(created_at)
  )
  SELECT
    (SELECT COUNT(*)::BIGINT FROM filtered) AS period_views,
    (SELECT COUNT(DISTINCT session_id)::BIGINT FROM filtered) AS unique_visitors,
    (SELECT COUNT(DISTINCT page_path)::BIGINT FROM filtered) AS unique_pages,
    COALESCE((SELECT ROUND(AVG(c), 1) FROM daily), 0) AS avg_daily_views;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION get_device_breakdown(
  days_back INTEGER DEFAULT 30,
  page_category TEXT DEFAULT NULL,
  device_filter TEXT DEFAULT NULL,
  city_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  device_type TEXT,
  browser TEXT,
  os TEXT,
  view_count BIGINT,
  unique_views BIGINT
) AS $$
BEGIN
  IF NOT is_site_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT
    COALESCE(pv.device_type, 'unknown') AS device_type,
    COALESCE(pv.browser, 'Desconhecido') AS browser,
    COALESCE(pv.os, 'Desconhecido') AS os,
    COUNT(*)::BIGINT AS view_count,
    COUNT(DISTINCT pv.session_id)::BIGINT AS unique_views
  FROM analytics_filtered_views(days_back, page_category, device_filter, city_filter) pv
  GROUP BY COALESCE(pv.device_type, 'unknown'), COALESCE(pv.browser, 'Desconhecido'), COALESCE(pv.os, 'Desconhecido')
  ORDER BY view_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION get_location_breakdown(
  days_back INTEGER DEFAULT 30,
  page_category TEXT DEFAULT NULL,
  device_filter TEXT DEFAULT NULL,
  city_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  city TEXT,
  region TEXT,
  country TEXT,
  view_count BIGINT,
  unique_views BIGINT
) AS $$
BEGIN
  IF NOT is_site_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT
    COALESCE(NULLIF(pv.city, ''), 'Desconhecida') AS city,
    COALESCE(NULLIF(pv.region, ''), '—') AS region,
    COALESCE(NULLIF(pv.country, ''), '—') AS country,
    COUNT(*)::BIGINT AS view_count,
    COUNT(DISTINCT pv.session_id)::BIGINT AS unique_views
  FROM analytics_filtered_views(days_back, page_category, device_filter, city_filter) pv
  GROUP BY COALESCE(NULLIF(pv.city, ''), 'Desconhecida'), COALESCE(NULLIF(pv.region, ''), '—'), COALESCE(NULLIF(pv.country, ''), '—')
  ORDER BY view_count DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION get_analytics_cities(
  days_back INTEGER DEFAULT 30,
  page_category TEXT DEFAULT NULL,
  device_filter TEXT DEFAULT NULL
)
RETURNS TABLE (city TEXT) AS $$
BEGIN
  IF NOT is_site_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT DISTINCT pv.city
  FROM analytics_filtered_views(days_back, page_category, device_filter, NULL) pv
  WHERE pv.city IS NOT NULL AND pv.city <> ''
  ORDER BY pv.city;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
