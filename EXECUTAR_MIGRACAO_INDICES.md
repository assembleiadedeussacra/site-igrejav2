# 🚀 Executar Migração de Índices - Guia Rápido

## ⚡ Método Rápido (Recomendado)

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Selecione seu projeto

### 2. Abra o SQL Editor
- No menu lateral esquerdo, clique em **SQL Editor**
- Clique no botão **New query**

### 3. Cole e Execute o SQL abaixo

```sql
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
```

### 4. Execute
- Clique no botão **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)
- Aguarde alguns segundos

### 5. Verifique o Resultado
- Você deve ver mensagens de sucesso como:
  ```
  Success. No rows returned
  ```
- Ou mensagens individuais para cada índice criado

---

## ✅ Verificação

Após executar, verifique se os índices foram criados:

```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('posts', 'banners', 'events', 'leaders', 'gallery_links', 'verses')
ORDER BY tablename, indexname;
```

Você deve ver os seguintes índices:

**Posts:**
- `idx_posts_slug`
- `idx_posts_type_published`
- `idx_posts_views`
- `idx_posts_created_at`
- `idx_posts_updated_at`
- `idx_posts_type_published_created`
- `idx_posts_type_published_tags`

**Outros:**
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
- ✅ **Melhor performance geral do site**

---

## ⚠️ Notas Importantes

1. **Tempo de execução**: Pode levar alguns segundos/minutos dependendo do tamanho das tabelas
2. **Sem downtime**: A criação não bloqueia a tabela (PostgreSQL 12+)
3. **Seguro**: O `IF NOT EXISTS` evita erros se algum índice já existir
4. **Índices parciais**: Alguns usam `WHERE active = true` para maior eficiência

---

## 🆘 Problemas?

### Erro: "relation does not exist"
- Verifique se as tabelas existem
- Execute primeiro: `supabase/schema.sql`

### Erro: "permission denied"
- Certifique-se de estar logado como admin do projeto
- Use uma conta com permissões de administrador

### Índices não aparecem
- Verifique se a execução foi bem-sucedida
- Execute a query de verificação acima
- Verifique se não há erros no console

---

## 📝 Arquivo Original

O arquivo completo está em:
```
supabase/migrations/add_performance_indexes.sql
```

---

## ✅ Pronto!

Após executar, seus índices estarão criados e o sistema estará otimizado! 🎉
