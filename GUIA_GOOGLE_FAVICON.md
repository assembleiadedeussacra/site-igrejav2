# 🔍 Guia: Corrigir Favicon e Título no Google

## 🎯 Problema Identificado

No Google Search, aparece:
- ❌ Favicon genérico (globo azul)
- ❌ Título "Vercel" ao invés de "AD Missão Sacramento"

## ✅ Soluções Implementadas

### 1. Favicon Configurado
Arquivos criados/atualizados:
- ✅ `public/favicon.ico` - Favicon principal
- ✅ `public/favicon.png` - Favicon PNG
- ✅ `public/browserconfig.xml` - Configuração Microsoft
- ✅ `src/app/layout.tsx` - Links atualizados

### 2. Títulos e Meta Tags Otimizados
- ✅ `title.default`: "AD Missão Sacramento - Assembleia de Deus Sacramento/MG"
- ✅ `applicationName`: "AD Missão Sacramento"
- ✅ `siteName`: "AD Missão Sacramento"
- ✅ `<meta name="application-name">`: "AD Missão Sacramento"

---

## 🚀 Como Forçar Atualização no Google

### Opção 1: Google Search Console (Recomendado)

1. **Acesse o Google Search Console**
   - URL: https://search.google.com/search-console
   - Faça login

2. **Inspeção de URL**
   - Na barra superior, digite: `https://assembleiasacramento.vercel.app`
   - Clique em "Enter"

3. **Solicitar Indexação**
   - Aguarde o Google inspecionar a URL
   - Clique em "Solicitar indexação"
   - Aguarde a confirmação

4. **Repetir para páginas principais** (opcional):
   - `https://assembleiasacramento.vercel.app/blog`
   - `https://assembleiasacramento.vercel.app/estudos`
   - `https://assembleiasacramento.vercel.app/sobre-nos`

### Opção 2: Aguardar Naturalmente

O Google atualiza automaticamente, mas pode levar:
- **Favicon:** 1-2 semanas
- **Título:** 1-7 dias

---

## 🔧 Verificar se o Favicon Está Funcionando

### 1. Teste Local (Desenvolvimento)

```bash
npm run dev
```

Acesse:
- `http://localhost:3000/favicon.ico` — Deve baixar o favicon
- `http://localhost:3000/manifest.json` — Deve mostrar o JSON
- `http://localhost:3000` — Verifique a aba do navegador

### 2. Teste em Produção (Vercel)

Acesse:
- `https://assembleiasacramento.vercel.app/favicon.ico`
- `https://assembleiasacramento.vercel.app/manifest.json`
- Abra o site e verifique a aba do navegador

---

## 📊 Verificação no Google

### Ferramenta de Teste de Resultados Avançados

1. **Acesse:**
   - URL: https://search.google.com/test/rich-results
   
2. **Digite a URL:**
   - `https://assembleiasacramento.vercel.app`

3. **Clique em "Testar URL"**
   - Veja como o Google vê seu site
   - Verifique se os dados estruturados estão corretos

### Google Rich Results Test

1. **Acesse:**
   - URL: https://developers.google.com/search/docs/appearance/favicon-in-search

2. **Verifique os requisitos:**
   - ✅ Favicon deve ser múltiplo de 48px (favicon.ico é 32x32)
   - ✅ Formato ICO, PNG ou SVG
   - ✅ Acessível publicamente

---

## 🎯 Checklist de Verificação

### Deploy
- [ ] Fazer deploy na Vercel
- [ ] Verificar que `favicon.ico` está acessível em produção
- [ ] Verificar que `manifest.json` está acessível

### Google Search Console
- [ ] Adicionar propriedade (se ainda não fez)
- [ ] Verificar propriedade
- [ ] Solicitar indexação da homepage
- [ ] Enviar sitemap

### Aguardar
- [ ] Aguardar 1-7 dias para título atualizar
- [ ] Aguardar 1-2 semanas para favicon atualizar
- [ ] Monitorar no Google Search Console

---

## 📝 Arquivos Relacionados

### Favicon:
- ✅ `public/favicon.ico` - Favicon principal (32x32)
- ✅ `public/favicon.png` - PNG alternativo
- ✅ `public/images/logo-igreja.png` - Logo para Apple/Android

### Configuração:
- ✅ `public/manifest.json` - PWA manifest
- ✅ `public/browserconfig.xml` - Microsoft tiles
- ✅ `src/app/layout.tsx` - Meta tags

### SEO:
- ✅ `src/app/sitemap.ts` - Sitemap dinâmico
- ✅ `src/app/robots.ts` - Robots.txt
- ✅ `public/google7d14be63a87a54c3.html` - Verificação Google

---

## ⚠️ Notas Importantes

### 1. Cache do Google
O Google mantém cache dos resultados de busca. Mesmo após corrigir, pode levar tempo para atualizar.

### 2. Favicon Requirements
Para o Google mostrar o favicon:
- ✅ Deve estar em `https://` (não funciona em http)
- ✅ Deve ser acessível publicamente
- ✅ Preferencialmente múltiplo de 48px
- ✅ Formato: ICO, PNG ou SVG

### 3. Título nos Resultados
O Google pode:
- Usar o `<title>` da página
- Usar o `siteName` do Open Graph
- Usar informações do Knowledge Graph
- Modificar baseado na query de busca

---

## 🔍 Troubleshooting

### Favicon não aparece no Google após 2 semanas
1. Verifique se está acessível: `https://assembleiasacramento.vercel.app/favicon.ico`
2. Verifique no Google Search Console se há erros de indexação
3. Solicite nova indexação

### Título ainda mostra "Vercel"
1. Verifique o `<title>` no HTML da página
2. Force re-indexação no Google Search Console
3. Verifique se o `manifest.json` está correto

### Erros de Supabase em Dev
- Verifique `.env.local`
- Verifique se o projeto Supabase está ativo
- Reinicie o servidor dev: `npm run dev`

---

## ✅ Status Final

### Implementado:
- ✅ Favicon configurado
- ✅ Títulos otimizados
- ✅ Meta tags completas
- ✅ Manifest atualizado
- ✅ Carrossel mobile corrigido
- ✅ Build 100% passando

### Aguardando:
- ⏳ Google atualizar cache (1-14 dias)
- ⏳ Verificação no Google Search Console

---

## 🎉 Conclusão

**Todas as correções técnicas foram aplicadas!**

Agora é necessário:
1. Fazer deploy
2. Solicitar indexação no Google Search Console
3. Aguardar o Google atualizar

**Sistema está correto, apenas aguardando cache do Google atualizar.** ✅
