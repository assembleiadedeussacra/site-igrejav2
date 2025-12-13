# 🚀 Como Executar a Migração de Índices

## Opção 1: Via Supabase SQL Editor (Recomendado)

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   - Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New query**

3. **Cole o SQL**
   - Abra o arquivo: `supabase/migrations/add_performance_indexes.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor

4. **Execute**
   - Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)
   - Aguarde a confirmação de sucesso

5. **Verifique**
   - Você deve ver mensagens como:
     ```
     CREATE INDEX
     CREATE INDEX
     ...
     ```

---

## Opção 2: Via Script Node.js (Avançado)

### Pré-requisitos:

Você precisa da **SERVICE_ROLE_KEY** do Supabase (não a ANON_KEY).

⚠️ **IMPORTANTE**: A SERVICE_ROLE_KEY tem permissões completas. Mantenha-a segura!

### Como obter a SERVICE_ROLE_KEY:

1. Acesse o Supabase Dashboard
2. Vá em **Settings** > **API**
3. Copie a **service_role** key (não a anon/public key)

### Executar:

1. **Adicione ao `.env.local`:**
   ```env
   SUPABASE_URL=sua_url_do_supabase
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
   ```

2. **Execute o script:**
   ```bash
   node scripts/run-migration-indexes.js
   ```

---

## Opção 3: Via Supabase CLI (Se configurado)

Se você tiver o Supabase CLI instalado:

```bash
# Instalar CLI (se não tiver)
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref seu-project-ref

# Executar migração
supabase db push
```

---

## ✅ Verificação

Após executar, verifique se os índices foram criados:

```sql
-- No SQL Editor do Supabase, execute:
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('posts', 'banners', 'events', 'leaders', 'gallery_links', 'verses')
ORDER BY tablename, indexname;
```

Você deve ver os novos índices listados:
- `idx_posts_slug`
- `idx_posts_type_published`
- `idx_posts_views`
- `idx_posts_created_at`
- `idx_posts_updated_at`
- `idx_posts_type_published_created`
- `idx_posts_type_published_tags`
- `idx_banners_active_position`
- `idx_events_active`
- `idx_events_day_of_week`
- `idx_leaders_active_order`
- `idx_gallery_links_active_order`
- `idx_verses_active_date`

---

## 📊 Impacto Esperado

Após criar os índices, você deve notar:

- ✅ **Queries 5-10x mais rápidas** em listagens de posts
- ✅ **Busca por slug instantânea**
- ✅ **Ordenação por views/data muito mais rápida**
- ✅ **Queries de posts relacionados otimizadas**

---

## ⚠️ Notas Importantes

1. **Índices parciais**: Alguns índices usam `WHERE active = true`, o que os torna mais eficientes, mas apenas para registros ativos.

2. **Tempo de criação**: A criação de índices pode levar alguns segundos/minutos dependendo do tamanho das tabelas.

3. **Sem downtime**: A criação de índices com `CREATE INDEX IF NOT EXISTS` não bloqueia a tabela (em PostgreSQL 12+).

4. **Verificação**: Se algum índice já existir, o `IF NOT EXISTS` evitará erros.

---

## 🆘 Problemas?

### Erro: "relation does not exist"
- Verifique se as tabelas existem
- Execute primeiro: `supabase/schema.sql`

### Erro: "permission denied"
- Use a SERVICE_ROLE_KEY (não ANON_KEY)
- Ou execute via SQL Editor (que usa suas permissões de admin)

### Índices não aparecem
- Verifique se a execução foi bem-sucedida
- Execute a query de verificação acima
- Verifique se não há erros no console do SQL Editor

---

## 📝 Arquivo SQL

O arquivo completo está em:
```
supabase/migrations/add_performance_indexes.sql
```
