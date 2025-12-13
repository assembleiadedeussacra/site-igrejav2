-- ============================================
-- Script para criar o bucket 'banners' no Supabase Storage
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- https://app.supabase.com/project/[seu-projeto]/sql/new

-- Criar bucket para banners (hero images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'banners',
    'banners',
    true, -- Público (leitura permitida para todos)
    5242880, -- 5MB em bytes
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Configurar políticas de acesso (RLS) para o bucket 'banners'
-- ============================================

-- Remover políticas antigas se existirem (para evitar conflitos)
DROP POLICY IF EXISTS "Public Access for banners bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete banners" ON storage.objects;

-- Permitir leitura pública
CREATE POLICY "Public Access for banners bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

-- Permitir upload apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload to banners"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'banners' 
    AND auth.role() = 'authenticated'
);

-- Permitir atualização apenas para usuários autenticados
CREATE POLICY "Authenticated users can update banners"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'banners' 
    AND auth.role() = 'authenticated'
);

-- Permitir exclusão apenas para usuários autenticados
CREATE POLICY "Authenticated users can delete banners"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'banners' 
    AND auth.role() = 'authenticated'
);

-- ============================================
-- Verificar se o bucket foi criado
-- ============================================
SELECT id, name, public, file_size_limit, allowed_mime_types, created_at
FROM storage.buckets
WHERE id = 'banners';

