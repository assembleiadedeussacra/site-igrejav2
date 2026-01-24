# 📊 Sistema de Análises - Guia de Implementação

## ✅ O que foi implementado

### 1. **Banco de Dados**
- Tabela `page_views` para rastrear todas as visualizações
- Funções SQL para estatísticas agregadas
- Índices otimizados para consultas rápidas

### 2. **API de Rastreamento**
- Endpoint `/api/analytics/pageview` para registrar visualizações
- Rastreamento automático de IP, referrer, user agent e sessão

### 3. **Componente de Rastreamento**
- `PageViewTracker` que rastreia automaticamente todas as páginas
- Integrado no layout principal
- Não rastreia páginas admin

### 4. **Página de Admin**
- Interface completa de análises em `/admin/analytics`
- Estatísticas em tempo real
- Filtros por período (7, 30, 90, 365 dias)
- Gráficos e tabelas de visualizações

---

## 🚀 Como Usar

### Passo 1: Executar a Migration

Execute o arquivo SQL no Supabase Dashboard:

```sql
-- Arquivo: supabase/migration_create_page_views.sql
```

Ou execute via SQL Editor no Supabase:
1. Acesse o Supabase Dashboard
2. Vá em SQL Editor
3. Cole o conteúdo do arquivo `migration_create_page_views.sql`
4. Execute

### Passo 2: Verificar se está funcionando

1. Acesse qualquer página do site (exceto `/admin/*`)
2. Abra o console do navegador (F12)
3. Verifique se não há erros
4. Acesse `/admin/analytics` para ver as estatísticas

### Passo 3: Acessar a Página de Análises

1. Faça login no admin (`/admin/login`)
2. No menu lateral, clique em **"Análises"**
3. Visualize as estatísticas

---

## 📈 Funcionalidades da Página de Análises

### Cards de Resumo
- **Total de Visualizações**: Todas as visualizações desde o início
- **Páginas Únicas**: Número de páginas diferentes visitadas
- **Visitantes Únicos**: Número de sessões únicas

### Tabela de Páginas Mais Acessadas
- Ranking das páginas por número de visualizações
- Mostra:
  - Posição no ranking
  - Nome e caminho da página
  - Total de visualizações
  - Visitantes únicos
  - Data da última visualização

### Gráfico de Visualizações Diárias
- Visualização dos últimos 14 dias
- Mostra visualizações totais e visitantes únicos por dia
- Gráfico de barras horizontal

### Filtros de Período
- **7 dias**: Última semana
- **30 dias**: Último mês (padrão)
- **90 dias**: Últimos 3 meses
- **365 dias**: Último ano

---

## 🔧 Estrutura Técnica

### Tabela `page_views`
```sql
- id: UUID (chave primária)
- page_path: TEXT (caminho da página, ex: "/blog/post-1")
- page_title: TEXT (título da página)
- referrer: TEXT (página de origem)
- user_agent: TEXT (navegador/dispositivo)
- ip_address: TEXT (endereço IP)
- session_id: TEXT (ID da sessão)
- created_at: TIMESTAMPTZ (data/hora)
```

### Funções SQL

#### `get_page_view_stats(days_back)`
Retorna estatísticas agregadas por página:
- Total de visualizações
- Visitantes únicos
- Última visualização

#### `get_daily_page_views(days_back)`
Retorna estatísticas diárias:
- Data
- Total de visualizações
- Visitantes únicos

---

## 📝 Arquivos Criados/Modificados

### Novos Arquivos
- `supabase/migration_create_page_views.sql` - Migration do banco
- `src/app/api/analytics/pageview/route.ts` - API de rastreamento
- `src/components/analytics/PageViewTracker.tsx` - Componente de rastreamento
- `src/app/admin/analytics/page.tsx` - Página de admin de análises

### Arquivos Modificados
- `src/lib/database.types.ts` - Tipos TypeScript adicionados
- `src/services/api.ts` - Funções de API adicionadas
- `src/app/layout.tsx` - PageViewTracker integrado
- `src/app/admin/layout.tsx` - Link de Análises no menu

---

## 🎯 Próximos Passos (Opcional)

### Melhorias Futuras
1. **Exportação de Dados**
   - Botão para exportar estatísticas em CSV/Excel
   
2. **Gráficos Avançados**
   - Gráficos de linha para tendências
   - Comparação entre períodos
   
3. **Filtros Adicionais**
   - Filtrar por tipo de página
   - Filtrar por dispositivo
   - Filtrar por origem (referrer)
   
4. **Alertas**
   - Notificações quando páginas específicas recebem muito tráfego
   
5. **Integração com Google Analytics**
   - Comparar dados internos com GA4

---

## ⚠️ Notas Importantes

1. **Privacidade**: O sistema não armazena dados pessoais identificáveis
2. **Performance**: Os índices garantem consultas rápidas mesmo com muitos dados
3. **Limpeza**: Considere criar um job para limpar dados antigos (opcional)
4. **RLS**: As políticas de segurança estão configuradas corretamente

---

## 🐛 Troubleshooting

### Problema: Estatísticas não aparecem
**Solução**: 
1. Verifique se a migration foi executada
2. Verifique se há dados na tabela `page_views`
3. Verifique o console do navegador para erros

### Problema: Visualizações não estão sendo registradas
**Solução**:
1. Verifique se o `PageViewTracker` está no layout
2. Verifique se não está em uma página admin (não rastreia)
3. Verifique o console do navegador para erros na API

### Problema: Erro ao acessar `/admin/analytics`
**Solução**:
1. Verifique se está autenticado
2. Verifique se as funções SQL foram criadas
3. Verifique os logs do Supabase

---

**Última atualização:** Dezembro 2024
**Versão:** 1.0.0
