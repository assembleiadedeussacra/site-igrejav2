-- ============================================
-- Script para criar buckets no Supabase Storage
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- https://app.supabase.com/project/[seu-projeto]/sql/new

-- 1. Criar bucket para fotos dos líderes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'leaders',
    'leaders',
    true, -- Público (leitura permitida para todos)
    5242880, -- 5MB em bytes
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar bucket para imagens de posts (capa e inline)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'posts',
    'posts',
    true, -- Público (leitura permitida para todos)
    5242880, -- 5MB em bytes
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Criar bucket para capas dos álbuns da galeria
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gallery',
    'gallery',
    true, -- Público (leitura permitida para todos)
    5242880, -- 5MB em bytes
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 4. Criar bucket para QR Codes PIX (financeiro)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'financials',
    'financials',
    true, -- Público (leitura permitida para todos)
    5242880, -- 5MB em bytes
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 5. Criar bucket para avatares de depoimentos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'testimonials',
    'testimonials',
    true, -- Público (leitura permitida para todos)
    2097152, -- 2MB em bytes (menor para avatares)
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Configurar políticas de acesso (RLS)
-- ============================================

-- Políticas para bucket 'leaders'
-- Permitir leitura pública
CREATE POLICY "Public Access for leaders bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'leaders');

-- Permitir upload apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload to leaders"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'leaders' 
    AND auth.role() = 'authenticated'
);

-- Permitir atualização apenas para usuários autenticados
CREATE POLICY "Authenticated users can update leaders"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'leaders' 
    AND auth.role() = 'authenticated'
);

-- Permitir exclusão apenas para usuários autenticados
CREATE POLICY "Authenticated users can delete leaders"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'leaders' 
    AND auth.role() = 'authenticated'
);

-- Políticas para bucket 'posts'
CREATE POLICY "Public Access for posts bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'posts');

CREATE POLICY "Authenticated users can upload to posts"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'posts' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update posts"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'posts' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete posts"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'posts' 
    AND auth.role() = 'authenticated'
);

-- Políticas para bucket 'gallery'
CREATE POLICY "Public Access for gallery bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can upload to gallery"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'gallery' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update gallery"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'gallery' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete gallery"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'gallery' 
    AND auth.role() = 'authenticated'
);

-- Políticas para bucket 'financials'
CREATE POLICY "Public Access for financials bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'financials');

CREATE POLICY "Authenticated users can upload to financials"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'financials' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update financials"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'financials' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete financials"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'financials' 
    AND auth.role() = 'authenticated'
);

-- Políticas para bucket 'testimonials'
CREATE POLICY "Public Access for testimonials bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonials');

CREATE POLICY "Authenticated users can upload to testimonials"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'testimonials' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update testimonials"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'testimonials' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete testimonials"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'testimonials' 
    AND auth.role() = 'authenticated'
);

-- ============================================
-- Verificar buckets criados
-- ============================================
SELECT id, name, public, file_size_limit, allowed_mime_types, created_at
FROM storage.buckets
WHERE id IN ('leaders', 'posts', 'gallery', 'financials', 'testimonials')
ORDER BY created_at;

