-- Formulário de contato + incremento seguro de views de posts

-- RPC: incrementa views sem expor UPDATE direto em posts
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE posts
  SET views = COALESCE(views, 0) + 1
  WHERE id = post_id AND published = true;
END;
$$;

REVOKE ALL ON FUNCTION increment_post_views(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_post_views(UUID) TO anon, authenticated;

-- Mensagens de contato / pedido de oração
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'contact' CHECK (type IN ('contact', 'prayer')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert contact messages" ON contact_messages;
CREATE POLICY "Public can insert contact messages"
  ON contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read contact messages" ON contact_messages;
CREATE POLICY "Admins can read contact messages"
  ON contact_messages FOR SELECT USING (is_site_admin());

DROP POLICY IF EXISTS "Admins can update contact messages" ON contact_messages;
CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "Admins can delete contact messages" ON contact_messages;
CREATE POLICY "Admins can delete contact messages"
  ON contact_messages FOR DELETE USING (is_site_admin());
