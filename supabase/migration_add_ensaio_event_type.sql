-- Migration: Adicionar tipo 'ensaio' aos eventos
-- Execute este script no SQL Editor do Supabase

-- Remover constraint antiga
ALTER TABLE events 
DROP CONSTRAINT IF EXISTS events_type_check;

-- Adicionar nova constraint com 'ensaio'
ALTER TABLE events 
ADD CONSTRAINT events_type_check 
CHECK (type IN ('culto', 'estudo', 'oracao', 'ebd', 'ensaio'));

