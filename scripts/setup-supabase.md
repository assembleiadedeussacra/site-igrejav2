# Configuração do Supabase

## Instalação nova (recomendado)

Execute no [SQL Editor](https://supabase.com/dashboard) do Supabase:

1. **`supabase/schema.sql`** — schema consolidado (idempotente: pode reexecutar em banco existente)
2. **`supabase/create_storage_buckets.sql`** — buckets de upload

> **Banco já existente:** rode o `schema.sql` completo de novo — triggers, policies e colunas faltantes serão aplicados sem duplicar dados iniciais.

## Banco já existente (atualizar)

Se o projeto já foi criado com versões antigas do schema, rode **apenas** as migrações que ainda faltam, na ordem:

1. `supabase/migration_hero_autoplay.sql`
2. `supabase/migration_add_order_to_events.sql`
3. `supabase/migration_add_button_styles.sql`
4. `supabase/migration_create_post_relations.sql`
5. `supabase/migration_create_page_views.sql`
6. `supabase/migrations/add_seo_fields.sql`
7. `supabase/migration_admin_rls_testimonials_order.sql`
8. `supabase/migration_analytics_enrichment.sql`
9. `supabase/migration_analytics_realtime.sql`

Use `node scripts/verify-supabase.mjs` para ver o que falta.

## Autenticação (admin)

1. **Authentication → Providers** — habilite Email
2. **Authentication → Users** — crie o usuário admin (mesmo e-mail cadastrado em `admin_users`)
3. **Authentication → Settings** — desabilite "Enable sign ups" em produção
4. **SQL Editor** — confirme o e-mail na whitelist:

```sql
INSERT INTO admin_users (email) VALUES ('seu@email.com')
ON CONFLICT (email) DO NOTHING;
```

> Ao reaplicar `schema.sql`, o e-mail de `site_settings` é inserido automaticamente em `admin_users`.

## Storage

Após `create_storage_buckets.sql`, confira em **Storage** se existem os buckets:
`banners`, `leaders`, `posts`, `gallery`, `testimonials`, `about`, `financials`, `page-banners`

## Verificar localmente

```bash
npm run verify:supabase
```

## Variáveis na Vercel

Configure:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` = `https://www.assembleiadedeussacramento.com.br`
- `CORS_ORIGIN` = `https://www.assembleiadedeussacramento.com.br`
- `REVALIDATION_SECRET` (opcional, para webhook de revalidação)
