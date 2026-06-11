-- Supabase Schema for Assembleia de Deus Missão - Sacramento/MG
-- Idempotente: pode ser reexecutado em banco existente (atualiza estrutura sem duplicar dados).

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_desktop_url TEXT NOT NULL,
  image_mobile_url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  link TEXT,
  alt_text TEXT NOT NULL,
  logo_url TEXT,
  title TEXT,
  description TEXT,
  button1_text TEXT,
  button1_link TEXT,
  button2_text TEXT,
  button2_link TEXT,
  button1_bg_color TEXT DEFAULT '#ffffff',
  button1_text_color TEXT DEFAULT '#1a1a1a',
  button1_hover_bg_color TEXT DEFAULT '#f0f0f0',
  button1_hover_text_color TEXT DEFAULT '#1a1a1a',
  button1_size TEXT DEFAULT 'md' CHECK (button1_size IN ('sm', 'md', 'lg')),
  button1_style TEXT DEFAULT 'solid' CHECK (button1_style IN ('solid', 'outline', 'ghost')),
  button1_open_new_tab BOOLEAN DEFAULT false,
  button1_border_radius INTEGER DEFAULT 10,
  button2_bg_color TEXT DEFAULT 'rgba(255, 255, 255, 0.1)',
  button2_text_color TEXT DEFAULT '#ffffff',
  button2_hover_bg_color TEXT DEFAULT 'rgba(255, 255, 255, 0.2)',
  button2_hover_text_color TEXT DEFAULT '#ffffff',
  button2_size TEXT DEFAULT 'md' CHECK (button2_size IN ('sm', 'md', 'lg')),
  button2_style TEXT DEFAULT 'outline' CHECK (button2_style IN ('solid', 'outline', 'ghost')),
  button2_open_new_tab BOOLEAN DEFAULT false,
  button2_border_radius INTEGER DEFAULT 10,
  buttons_global_style TEXT DEFAULT 'individual' CHECK (buttons_global_style IN ('individual', 'unified')),
  overlay_opacity INTEGER DEFAULT 50 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 100),
  overlay_color TEXT DEFAULT '#232d82',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verses table (Versículo do Dia)
CREATE TABLE IF NOT EXISTS verses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  reference TEXT NOT NULL,
  bible_link TEXT,
  active_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaders table (Liderança)
CREATE TABLE IF NOT EXISTS leaders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  department TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table (Blog & Estudos)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT,
  type TEXT NOT NULL CHECK (type IN ('blog', 'study')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  content TEXT NOT NULL,
  author TEXT,
  slug TEXT,
  excerpt TEXT,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  canonical_url TEXT,
  noindex BOOLEAN DEFAULT false,
  nofollow BOOLEAN DEFAULT false,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  schema_type TEXT DEFAULT 'Article' CHECK (schema_type IN ('Article', 'BlogPosting', 'Study')),
  published BOOLEAN NOT NULL DEFAULT false,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table (Agenda Fixa)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  time_start TEXT NOT NULL,
  time_end TEXT,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('culto', 'estudo', 'oracao', 'ebd', 'ensaio')),
  "order" INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Links table
CREATE TABLE IF NOT EXISTS gallery_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  drive_link TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financials table (PIX information)
CREATE TABLE IF NOT EXISTS financials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pix_key TEXT NOT NULL,
  pix_qrcode_url TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_name TEXT NOT NULL DEFAULT 'Assembleia de Deus Missão',
  church_address TEXT NOT NULL DEFAULT 'Rua Carlos R da Cunha n° 90',
  church_city TEXT NOT NULL DEFAULT 'Sacramento - MG',
  church_cep TEXT NOT NULL DEFAULT '38190-000',
  phone TEXT NOT NULL DEFAULT '34984327019',
  email TEXT NOT NULL DEFAULT 'assembleiadedeussacra20@gmail.com',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/assembleiasacramento/',
  instagram_handle TEXT DEFAULT '@assembleiasacramento',
  google_maps_embed TEXT,
  google_calendar_embed TEXT,
  hero_autoplay_seconds INTEGER NOT NULL DEFAULT 6,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers updated_at (DROP IF EXISTS para reexecução segura)
DROP TRIGGER IF EXISTS update_banners_updated_at ON banners;
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leaders_updated_at ON leaders;
CREATE TRIGGER update_leaders_updated_at BEFORE UPDATE ON leaders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_links_updated_at ON gallery_links;
CREATE TRIGGER update_gallery_links_updated_at BEFORE UPDATE ON gallery_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_financials_updated_at ON financials;
CREATE TRIGGER update_financials_updated_at BEFORE UPDATE ON financials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (for public website)
DROP POLICY IF EXISTS "Public can read active banners" ON banners;
CREATE POLICY "Public can read active banners" ON banners FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Public can read verses" ON verses;
CREATE POLICY "Public can read verses" ON verses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read active leaders" ON leaders;
CREATE POLICY "Public can read active leaders" ON leaders FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Public can read published posts" ON posts;
CREATE POLICY "Public can read published posts" ON posts FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Public can read active events" ON events;
CREATE POLICY "Public can read active events" ON events FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Public can read active gallery links" ON gallery_links;
CREATE POLICY "Public can read active gallery links" ON gallery_links FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Public can read active financials" ON financials;
CREATE POLICY "Public can read active financials" ON financials FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Public can read active testimonials" ON testimonials;
CREATE POLICY "Public can read active testimonials" ON testimonials FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);

-- Admin whitelist (e-mails autorizados a gerenciar o painel)
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

-- Admin policies (somente e-mails em admin_users)
DROP POLICY IF EXISTS "Authenticated users can manage banners" ON banners;
DROP POLICY IF EXISTS "Admins can manage banners" ON banners;
CREATE POLICY "Admins can manage banners" ON banners FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Authenticated users can manage verses" ON verses;
DROP POLICY IF EXISTS "Admins can manage verses" ON verses;
CREATE POLICY "Admins can manage verses" ON verses FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Authenticated users can manage leaders" ON leaders;
DROP POLICY IF EXISTS "Admins can manage leaders" ON leaders;
CREATE POLICY "Admins can manage leaders" ON leaders FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Authenticated users can manage posts" ON posts;
DROP POLICY IF EXISTS "Admins can manage posts" ON posts;
CREATE POLICY "Admins can manage posts" ON posts FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Authenticated users can manage gallery links" ON gallery_links;
DROP POLICY IF EXISTS "Admins can manage gallery links" ON gallery_links;
CREATE POLICY "Admins can manage gallery links" ON gallery_links FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Authenticated users can manage financials" ON financials;
DROP POLICY IF EXISTS "Admins can manage financials" ON financials;
CREATE POLICY "Admins can manage financials" ON financials FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Authenticated users can manage site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());
-- Insert initial data (somente se tabelas vazias)

INSERT INTO site_settings (church_name, church_address, church_city, church_cep, phone, email, instagram_url, instagram_handle)
SELECT
  'Assembleia de Deus Missão',
  'Rua Carlos R da Cunha n° 90',
  'Sacramento - MG',
  '38190-000',
  '34984327019',
  'assembleiadedeussacra20@gmail.com',
  'https://www.instagram.com/assembleiasacramento/',
  '@assembleiasacramento'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

INSERT INTO events (title, day_of_week, time_start, time_end, description, type)
SELECT * FROM (VALUES
  ('Culto de Ensino', 'Terça-feira', '19:30', '21:00', 'Estudo bíblico e ensino da Palavra', 'estudo'),
  ('Círculo de Oração', 'Quinta-feira', '19:30', '21:00', 'Momento de intercessão e oração', 'oracao'),
  ('Escola Bíblica Dominical', 'Domingo', '09:00', '10:30', 'Estudo bíblico para todas as idades', 'ebd'),
  ('Culto da Noite', 'Domingo', '19:00', '21:00', 'Culto de adoração e pregação da Palavra', 'culto')
) AS v(title, day_of_week, time_start, time_end, description, type)
WHERE NOT EXISTS (SELECT 1 FROM events LIMIT 1);

INSERT INTO financials (pix_key, pix_qrcode_url)
SELECT '34984327019', '/images/qrcode-pix.png'
WHERE NOT EXISTS (SELECT 1 FROM financials LIMIT 1);

INSERT INTO testimonials (name, text, rating)
SELECT * FROM (VALUES
  ('Maria Silva', 'Uma igreja acolhedora onde encontrei uma família em Cristo. Louvo a Deus por fazer parte desta comunidade!', 5),
  ('João Santos', 'Os estudos bíblicos são edificantes e a liderança é comprometida com a Palavra de Deus.', 5),
  ('Ana Oliveira', 'Ambiente de paz e comunhão. Minha família foi muito bem recebida desde o primeiro dia.', 5)
) AS v(name, text, rating)
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);
-- About Page Cover table
CREATE TABLE IF NOT EXISTS about_page_cover (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  church_text_part1 TEXT,
  church_image_url TEXT,
  church_text_part2 TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Department Members table
CREATE TABLE IF NOT EXISTS department_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at triggers for new tables
DROP TRIGGER IF EXISTS update_about_page_cover_updated_at ON about_page_cover;
CREATE TRIGGER update_about_page_cover_updated_at
  BEFORE UPDATE ON about_page_cover
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_departments_updated_at ON departments;
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_department_members_updated_at ON department_members;
CREATE TRIGGER update_department_members_updated_at
  BEFORE UPDATE ON department_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Enable RLS on new tables
ALTER TABLE about_page_cover ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_members ENABLE ROW LEVEL SECURITY;

-- Public read policies for new tables
DROP POLICY IF EXISTS "Public can read active about page cover" ON about_page_cover;
CREATE POLICY "Public can read active about page cover"
  ON about_page_cover FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Public can read active departments" ON departments;
CREATE POLICY "Public can read active departments"
  ON departments FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Public can read active department members" ON department_members;
CREATE POLICY "Public can read active department members"
  ON department_members FOR SELECT
  USING (active = true);

-- Admin policies for new tables
DROP POLICY IF EXISTS "Authenticated users can manage about page cover" ON about_page_cover;
DROP POLICY IF EXISTS "Admins can manage about page cover" ON about_page_cover;
CREATE POLICY "Admins can manage about page cover"
  ON about_page_cover FOR ALL
  USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Authenticated users can manage departments" ON departments;
DROP POLICY IF EXISTS "Admins can manage departments" ON departments;
CREATE POLICY "Admins can manage departments"
  ON departments FOR ALL
  USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Authenticated users can manage department members" ON department_members;
DROP POLICY IF EXISTS "Admins can manage department members" ON department_members;
CREATE POLICY "Admins can manage department members"
  ON department_members FOR ALL
  USING (is_site_admin()) WITH CHECK (is_site_admin());
-- Insert default departments
INSERT INTO departments (name, description, "order") VALUES
('Departamento Infantil', 'Ministério dedicado ao ensino bíblico e cuidado das crianças', 1),
('Departamento de Jovens', 'Ministério voltado para jovens e adolescentes', 2),
('Círculo de Oração', 'Grupo de intercessão e oração', 3),
('Banda', 'Ministério de música e adoração', 4)
ON CONFLICT (name) DO NOTHING;

-- Page Banners table
CREATE TABLE IF NOT EXISTS page_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_type TEXT NOT NULL CHECK (page_type IN ('estudos', 'blog')),
  image_url TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger for page_banners
DROP TRIGGER IF EXISTS update_page_banners_updated_at ON page_banners;
CREATE TRIGGER update_page_banners_updated_at
  BEFORE UPDATE ON page_banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Enable RLS on page_banners
ALTER TABLE page_banners ENABLE ROW LEVEL SECURITY;

-- Public read policies for page_banners
DROP POLICY IF EXISTS "Public can read active page banners" ON page_banners;
CREATE POLICY "Public can read active page banners"
  ON page_banners FOR SELECT
  USING (active = true);

-- Admin policies for page_banners
DROP POLICY IF EXISTS "Authenticated users can manage page banners" ON page_banners;
DROP POLICY IF EXISTS "Admins can manage page banners" ON page_banners;
CREATE POLICY "Admins can manage page banners"
  ON page_banners FOR ALL
  USING (is_site_admin()) WITH CHECK (is_site_admin());
-- Create indexes for posts performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, type) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_posts_slug_lookup ON posts(slug, published) WHERE slug IS NOT NULL AND published = true;
CREATE INDEX IF NOT EXISTS idx_posts_views ON posts(views DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type_published ON posts(type, published);
CREATE INDEX IF NOT EXISTS idx_events_order ON events("order");

-- Post relations (posts relacionados)
CREATE TABLE IF NOT EXISTS post_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  related_post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, related_post_id)
);

ALTER TABLE post_relations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read post relations" ON post_relations;
CREATE POLICY "Public can read post relations" ON post_relations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage post relations" ON post_relations;
DROP POLICY IF EXISTS "Admins can manage post relations" ON post_relations;
CREATE POLICY "Admins can manage post relations" ON post_relations FOR ALL USING (is_site_admin()) WITH CHECK (is_site_admin());
-- Page views (analytics)
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

CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path_created_at ON page_views(page_path, created_at DESC);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert page views" ON page_views;
CREATE POLICY "Public can insert page views" ON page_views FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can read page views" ON page_views;
DROP POLICY IF EXISTS "Admins can read page views" ON page_views;
CREATE POLICY "Admins can read page views" ON page_views FOR SELECT USING (is_site_admin());
-- SEO slug helpers
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    result := LOWER(input_text);
    result := translate(result, 'áàâãäéèêëíìîïóòôõöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn');
    result := regexp_replace(result, '[^a-z0-9]+', '-', 'g');
    result := trim(both '-' from result);
    IF length(result) > 100 THEN
        result := left(result, 100);
        result := rtrim(result, '-');
    END IF;
    RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION ensure_unique_slug(base_slug TEXT, post_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    final_slug := base_slug;
    WHILE EXISTS (
        SELECT 1 FROM posts
        WHERE slug = final_slug
        AND (post_id IS NULL OR id != post_id)
    ) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
        IF counter > 1000 THEN
            RAISE EXCEPTION 'Unable to generate unique slug after 1000 attempts';
        END IF;
    END LOOP;
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  ALTER TABLE posts
  ADD CONSTRAINT posts_slug_not_empty CHECK (slug IS NULL OR length(trim(slug)) > 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Colunas adicionais em bancos criados antes do schema consolidado
ALTER TABLE banners ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button1_text TEXT;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button1_link TEXT;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button2_text TEXT;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button2_link TEXT;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button1_bg_color TEXT DEFAULT '#ffffff';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button1_text_color TEXT DEFAULT '#1a1a1a';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button1_hover_bg_color TEXT DEFAULT '#f0f0f0';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button1_hover_text_color TEXT DEFAULT '#1a1a1a';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button1_size TEXT DEFAULT 'md';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button1_style TEXT DEFAULT 'solid';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button1_open_new_tab BOOLEAN DEFAULT false;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button1_border_radius INTEGER DEFAULT 10;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button2_bg_color TEXT DEFAULT 'rgba(255, 255, 255, 0.1)';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button2_text_color TEXT DEFAULT '#ffffff';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button2_hover_bg_color TEXT DEFAULT 'rgba(255, 255, 255, 0.2)';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button2_hover_text_color TEXT DEFAULT '#ffffff';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button2_size TEXT DEFAULT 'md';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button2_style TEXT DEFAULT 'outline';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button2_open_new_tab BOOLEAN DEFAULT false;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button2_border_radius INTEGER DEFAULT 10;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS buttons_global_style TEXT DEFAULT 'individual';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS overlay_opacity INTEGER DEFAULT 50;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS overlay_color TEXT DEFAULT '#232d82';

ALTER TABLE posts ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE posts ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS noindex BOOLEAN DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS nofollow BOOLEAN DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_title TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_description TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS schema_type TEXT DEFAULT 'Article';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;

ALTER TABLE events ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leaders ADD COLUMN IF NOT EXISTS department TEXT;

CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials("order");

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS google_maps_embed TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS google_calendar_embed TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_autoplay_seconds INTEGER NOT NULL DEFAULT 6;
-- Analytics RPCs
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
