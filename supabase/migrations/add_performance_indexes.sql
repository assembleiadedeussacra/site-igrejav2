-- Índices para otimização de performance
-- Execute este arquivo no SQL Editor do Supabase

-- Índices para posts (já devem existir alguns, mas garantindo que todos estão presentes)
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_type_published ON posts(type, published);
CREATE INDEX IF NOT EXISTS idx_posts_views ON posts(views DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_updated_at ON posts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type_published_created ON posts(type, published, created_at DESC);

-- Índice composto para queries de posts relacionados
CREATE INDEX IF NOT EXISTS idx_posts_type_published_tags ON posts(type, published) 
WHERE tags IS NOT NULL AND array_length(tags, 1) > 0;

-- Índices para banners
CREATE INDEX IF NOT EXISTS idx_banners_active_position ON banners(active, position) 
WHERE active = true;

-- Índices para eventos
CREATE INDEX IF NOT EXISTS idx_events_active ON events(active) 
WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_events_day_of_week ON events(day_of_week);

-- Índices para líderes
CREATE INDEX IF NOT EXISTS idx_leaders_active_order ON leaders(active, "order") 
WHERE active = true;

-- Índices para galeria
CREATE INDEX IF NOT EXISTS idx_gallery_links_active_order ON gallery_links(active, "order") 
WHERE active = true;

-- Índices para versículos
CREATE INDEX IF NOT EXISTS idx_verses_active_date ON verses(active_date);

-- Índice para busca de texto (se usar busca full-text no futuro)
-- CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING gin(to_tsvector('portuguese', title || ' ' || description || ' ' || content));

-- Comentários sobre os índices:
-- - idx_posts_slug: Essencial para buscas por slug (muito usado)
-- - idx_posts_type_published: Otimiza queries de listagem
-- - idx_posts_views: Para ordenação por popularidade
-- - idx_posts_type_published_created: Para queries combinadas
-- - Índices parciais (WHERE): Mais eficientes, apenas para registros ativos
