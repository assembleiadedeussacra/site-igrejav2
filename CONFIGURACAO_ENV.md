# Configuração de Variáveis de Ambiente

Crie ou atualize o arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Site URL (obrigatório)
NEXT_PUBLIC_SITE_URL=https://assembleiasacramento.com.br

# Revalidation Secret (para webhook de revalidação)
# Valor gerado: goA1S8Qh9Eo7l7z+j0wZuqpVKfF74k0LK0Zdbu/Lj3E=
REVALIDATE_SECRET=goA1S8Qh9Eo7l7z+j0wZuqpVKfF74k0LK0Zdbu/Lj3E=

# CORS Origin para API Headless CMS
# Use * para todos os origins, ou domínio específico: https://exemplo.com
CORS_ORIGIN=*
```

## Como Gerar REVALIDATE_SECRET

No terminal:
```bash
openssl rand -base64 32
```

Ou use qualquer gerador de string aleatória segura.

## Configuração do Webhook no Supabase

1. Acesse o Supabase Dashboard
2. Vá em Database > Webhooks
3. Crie um novo webhook que chama: `https://seu-dominio.com/api/revalidate?secret=SEU_REVALIDATE_SECRET`
4. Configure para disparar em INSERT/UPDATE na tabela `posts`
