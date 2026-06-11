-- Admin whitelist + ordem em depoimentos
-- Execute no SQL Editor ou reaplique schema.sql consolidado

-- 1. Whitelist de administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_site_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

REVOKE ALL ON FUNCTION public.is_site_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_site_admin() TO authenticated;

INSERT INTO admin_users (email)
SELECT lower(email) FROM site_settings LIMIT 1
ON CONFLICT (email) DO NOTHING;

INSERT INTO admin_users (email)
VALUES ('assembleiadedeussacra20@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 2. Ordem em depoimentos
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;

WITH ranked AS (
  SELECT id, row_number() OVER (ORDER BY created_at ASC) - 1 AS rn
  FROM testimonials
)
UPDATE testimonials t
SET "order" = r.rn
FROM ranked r
WHERE t.id = r.id;

CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials("order");

-- 3. Políticas admin (idempotente: remove antigas e recria)
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (
        policyname LIKE 'Authenticated users can%'
        OR policyname LIKE 'Admins can %'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Admins can manage banners" ON banners;
CREATE POLICY "Admins can manage banners" ON banners FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can manage verses" ON verses;
CREATE POLICY "Admins can manage verses" ON verses FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can manage leaders" ON leaders;
CREATE POLICY "Admins can manage leaders" ON leaders FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can manage posts" ON posts;
CREATE POLICY "Admins can manage posts" ON posts FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can manage events" ON events;
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can manage gallery links" ON gallery_links;
CREATE POLICY "Admins can manage gallery links" ON gallery_links FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can manage financials" ON financials;
CREATE POLICY "Admins can manage financials" ON financials FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can manage about page cover" ON about_page_cover;
CREATE POLICY "Admins can manage about page cover" ON about_page_cover FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can manage departments" ON departments;
CREATE POLICY "Admins can manage departments" ON departments FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can manage department members" ON department_members;
CREATE POLICY "Admins can manage department members" ON department_members FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can manage page banners" ON page_banners;
CREATE POLICY "Admins can manage page banners" ON page_banners FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can manage post relations" ON post_relations;
CREATE POLICY "Admins can manage post relations" ON post_relations FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Authenticated users can read page views" ON page_views;
DROP POLICY IF EXISTS "Admins can read page views" ON page_views;
CREATE POLICY "Admins can read page views" ON page_views FOR SELECT USING (is_site_admin());

-- 4. RPCs de analytics restritos a admins
CREATE OR REPLACE FUNCTION get_page_view_stats(days_back INTEGER DEFAULT 30)
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
    MAX(pv.page_title) as page_title,
    COUNT(*)::BIGINT as view_count,
    COUNT(DISTINCT pv.session_id)::BIGINT as unique_views,
    MAX(pv.created_at) as last_viewed
  FROM page_views pv
  WHERE pv.created_at >= NOW() - (days_back || ' days')::INTERVAL
  GROUP BY pv.page_path
  ORDER BY view_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION get_daily_page_views(days_back INTEGER DEFAULT 30)
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
    DATE(pv.created_at) as date,
    COUNT(*)::BIGINT as view_count,
    COUNT(DISTINCT pv.session_id)::BIGINT as unique_views
  FROM page_views pv
  WHERE pv.created_at >= NOW() - (days_back || ' days')::INTERVAL
  GROUP BY DATE(pv.created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
