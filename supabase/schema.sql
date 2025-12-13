-- Supabase Schema for Assembleia de Deus Missão - Sacramento/MG

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
  published BOOLEAN NOT NULL DEFAULT false,
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
  type TEXT NOT NULL CHECK (type IN ('culto', 'estudo', 'oracao', 'ebd')),
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
  email TEXT NOT NULL DEFAULT 'contato@assembleiasacramento.com.br',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/assembleiasacramento/',
  instagram_handle TEXT DEFAULT '@assembleiasacramento',
  google_maps_embed TEXT,
  google_calendar_embed TEXT,
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

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leaders_updated_at BEFORE UPDATE ON leaders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_links_updated_at BEFORE UPDATE ON gallery_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financials_updated_at BEFORE UPDATE ON financials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
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
CREATE POLICY "Public can read active banners" ON banners FOR SELECT USING (active = true);
CREATE POLICY "Public can read verses" ON verses FOR SELECT USING (true);
CREATE POLICY "Public can read active leaders" ON leaders FOR SELECT USING (active = true);
CREATE POLICY "Public can read published posts" ON posts FOR SELECT USING (published = true);
CREATE POLICY "Public can read active events" ON events FOR SELECT USING (active = true);
CREATE POLICY "Public can read active gallery links" ON gallery_links FOR SELECT USING (active = true);
CREATE POLICY "Public can read active financials" ON financials FOR SELECT USING (active = true);
CREATE POLICY "Public can read active testimonials" ON testimonials FOR SELECT USING (active = true);
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);

-- Admin policies (requires auth)
CREATE POLICY "Authenticated users can manage banners" ON banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage verses" ON verses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage leaders" ON leaders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage posts" ON posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage gallery links" ON gallery_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage financials" ON financials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial data

-- Insert default site settings
INSERT INTO site_settings (church_name, church_address, church_city, church_cep, phone, email, instagram_url, instagram_handle)
VALUES (
  'Assembleia de Deus Missão',
  'Rua Carlos R da Cunha n° 90',
  'Sacramento - MG',
  '38190-000',
  '34984327019',
  'contato@assembleiasacramento.com.br',
  'https://www.instagram.com/assembleiasacramento/',
  '@assembleiasacramento'
);

-- Insert default events (Agenda Fixa)
INSERT INTO events (title, day_of_week, time_start, time_end, description, type) VALUES
('Culto de Ensino', 'Terça-feira', '19:30', '21:00', 'Estudo bíblico e ensino da Palavra', 'estudo'),
('Círculo de Oração', 'Quinta-feira', '19:30', '21:00', 'Momento de intercessão e oração', 'oracao'),
('Escola Bíblica Dominical', 'Domingo', '09:00', '10:30', 'Estudo bíblico para todas as idades', 'ebd'),
('Culto da Noite', 'Domingo', '19:00', '21:00', 'Culto de adoração e pregação da Palavra', 'culto');

-- Insert default financial info
INSERT INTO financials (pix_key, pix_qrcode_url) VALUES
('34984327019', '/images/qrcode-pix.png');

-- Insert sample testimonials
INSERT INTO testimonials (name, text, rating) VALUES
('Maria Silva', 'Uma igreja acolhedora onde encontrei uma família em Cristo. Louvo a Deus por fazer parte desta comunidade!', 5),
('João Santos', 'Os estudos bíblicos são edificantes e a liderança é comprometida com a Palavra de Deus.', 5),
('Ana Oliveira', 'Ambiente de paz e comunhão. Minha família foi muito bem recebida desde o primeiro dia.', 5);
