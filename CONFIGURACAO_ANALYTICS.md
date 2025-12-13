# 📊 Configuração de Analytics e Monitoramento

## ✅ O que foi implementado

### 1. **Google Analytics 4** ✅
- Sistema de analytics completo
- Tracking de eventos customizados
- Rastreamento automático de páginas
- Core Web Vitals integrado

### 2. **Performance Monitoring** ✅
- Rastreamento de Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
- Métricas de tempo de carregamento
- Monitoramento de performance de componentes

### 3. **Testes Automatizados** ✅
- Jest configurado
- Testing Library configurado
- Exemplo de teste criado

---

## 🔧 Configuração Necessária

### Variável de Ambiente

Adicione ao seu `.env.local`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Onde obter:**
1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie uma propriedade (se ainda não tiver)
3. Vá em **Admin** > **Data Streams**
4. Selecione seu stream ou crie um novo
5. Copie o **Measurement ID** (formato: `G-XXXXXXXXXX`)

---

## 📊 Eventos Rastreados

### Automáticos
- ✅ Visualização de página (page_view)
- ✅ Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
- ✅ Tempo de carregamento da página

### Customizados (já implementados)
- ✅ Visualização de posts (`post_view`)
- ✅ Compartilhamento de posts (`post_share`)
- ✅ Busca (`search`)
- ✅ Envio de formulário de contato (`contact_form_submit`)
- ✅ Download de arquivos (`file_download`)
- ✅ Clique em doação (`donation_click`)
- ✅ Erros (`error`)

---

## 🧪 Testes

### Executar testes

```bash
# Executar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Com cobertura
npm run test:coverage
```

### Exemplo de teste

Um teste de exemplo foi criado em:
- `__tests__/components/RelatedPosts.test.tsx`

---

## 📈 Como usar Analytics

### Em componentes

```typescript
import { AnalyticsEvents } from '@/lib/analytics';

// Rastrear evento customizado
AnalyticsEvents.postView(postId, postTitle, 'blog');

// Rastrear compartilhamento
AnalyticsEvents.postShare(postId, 'facebook');

// Rastrear busca
AnalyticsEvents.search('termo buscado', 10);
```

### Performance Monitoring

O monitoramento de performance é automático através do componente `PerformanceMonitor` no layout.

---

## 🎯 Próximos Passos

1. **Adicionar Measurement ID** ao `.env.local`
2. **Verificar eventos** no Google Analytics após algumas interações
3. **Criar mais testes** conforme necessário
4. **Configurar Sentry** (opcional, para error tracking avançado)

---

## 📝 Notas

- Analytics só funciona em produção ou quando `NEXT_PUBLIC_GA_MEASUREMENT_ID` está configurado
- Em desenvolvimento, eventos são logados no console
- Core Web Vitals são enviados automaticamente para o GA4
- Testes podem ser expandidos conforme necessário
