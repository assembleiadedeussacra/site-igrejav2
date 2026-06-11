-- Tempo de exibição de cada slide no carrossel da homepage (segundos)
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS hero_autoplay_seconds INTEGER NOT NULL DEFAULT 6;

COMMENT ON COLUMN site_settings.hero_autoplay_seconds IS 'Duração em segundos de cada slide do banner principal (3-60)';
