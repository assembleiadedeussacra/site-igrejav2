-- Habilita Supabase Realtime na tabela page_views (atualização instantânea no admin)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE page_views;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN others THEN
    RAISE NOTICE 'Realtime já configurado ou indisponível: %', SQLERRM;
END $$;
