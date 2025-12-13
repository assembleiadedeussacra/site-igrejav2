-- Migration: Adicionar campo order na tabela events
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna order se não existir
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;

-- Atualizar valores existentes com base na ordem de criação
UPDATE events 
SET "order" = subquery.row_number
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_number
    FROM events
) AS subquery
WHERE events.id = subquery.id;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_events_order ON events("order");

