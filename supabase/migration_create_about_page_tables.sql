-- Migration: Create tables for About Page
-- Execute this script in the Supabase SQL Editor

-- About Page Cover table
CREATE TABLE IF NOT EXISTS about_page_cover (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
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

-- Create updated_at triggers
CREATE TRIGGER update_about_page_cover_updated_at 
  BEFORE UPDATE ON about_page_cover 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at 
  BEFORE UPDATE ON departments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_members_updated_at 
  BEFORE UPDATE ON department_members 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE about_page_cover ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_members ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read active about page cover" 
  ON about_page_cover FOR SELECT 
  USING (active = true);

CREATE POLICY "Public can read active departments" 
  ON departments FOR SELECT 
  USING (active = true);

CREATE POLICY "Public can read active department members" 
  ON department_members FOR SELECT 
  USING (active = true);

-- Admin policies (requires auth)
CREATE POLICY "Authenticated users can manage about page cover" 
  ON about_page_cover FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage departments" 
  ON departments FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage department members" 
  ON department_members FOR ALL 
  USING (auth.role() = 'authenticated');

-- Insert default departments
INSERT INTO departments (name, description, "order") VALUES
('Departamento Infantil', 'Ministério dedicado ao ensino bíblico e cuidado das crianças', 1),
('Departamento de Jovens', 'Ministério voltado para jovens e adolescentes', 2),
('Círculo de Oração', 'Grupo de intercessão e oração', 3),
('Banda', 'Ministério de música e adoração', 4)
ON CONFLICT (name) DO NOTHING;

