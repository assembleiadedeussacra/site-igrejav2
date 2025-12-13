-- Migration: Add department field to leaders table
-- Date: 2024

-- Add department column to leaders table
ALTER TABLE leaders 
ADD COLUMN IF NOT EXISTS department TEXT;

-- Add comment to column
COMMENT ON COLUMN leaders.department IS 'Departamento opcional ao qual o líder está associado';

