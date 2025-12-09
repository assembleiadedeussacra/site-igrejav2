# Configuração do Deploy na Vercel

## ⚠️ Erro 404 NOT_FOUND - Solução Completa

Se você está recebendo um erro 404 após o deploy na Vercel, siga estes passos na ordem:

### 1. Configurar Variáveis de Ambiente na Vercel

**IMPORTANTE:** Este é o passo mais crítico. Sem as variáveis de ambiente, o site não funcionará.

1. Acesse seu projeto na Vercel: https://vercel.com/dashboard
2. Clique no seu projeto
3. Vá em **Settings** > **Environment Variables**
4. Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_do_supabase
```

**Onde encontrar essas variáveis:**
- Acesse seu projeto no Supabase
- Vá em **Settings** > **API**
- Copie:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Importante:**
- ✅ As variáveis devem começar com `NEXT_PUBLIC_` para serem acessíveis no cliente
- ✅ Configure para **Production**, **Preview** e **Development**
- ✅ Certifique-se de copiar os valores corretos (sem espaços extras)

### 2. Verificar Build Logs

1. Acesse **Deployments** no painel da Vercel
2. Clique no deployment mais recente
3. Verifique os **Build Logs** para identificar erros específicos
4. Procure por mensagens como:
   - "Missing Supabase environment variables"
   - "Error fetching banners"
   - Qualquer erro de TypeScript ou build

### 3. Fazer Redeploy

Após configurar as variáveis de ambiente:

1. Vá em **Deployments**
2. Clique nos três pontos (...) do último deployment
3. Selecione **Redeploy**
4. Ou faça um novo commit e push para o repositório

**Importante:** O redeploy é necessário para que as novas variáveis de ambiente sejam aplicadas.

### 4. Verificar Configuração do Projeto

Certifique-se de que na Vercel:

- **Framework Preset:** Next.js
- **Root Directory:** (vazio)
- **Build Command:** `next build` (padrão)
- **Output Directory:** (vazio)
- **Install Command:** `npm install` (padrão)

### 5. Verificar Estrutura de Arquivos

Certifique-se de que a estrutura do projeto está correta:

```
igreja-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ...
│   └── ...
├── next.config.ts
├── package.json
└── tsconfig.json
```

### 6. Problemas Comuns e Soluções

#### Erro: "404: NOT_FOUND"
**Causa mais comum:** Variáveis de ambiente não configuradas ou incorretas

**Solução:**
1. Verifique se as variáveis estão configuradas (passo 1)
2. Verifique se os valores estão corretos (sem espaços, URLs completas)
3. Faça um redeploy após configurar

#### Erro: "Missing Supabase environment variables"
**Solução:** Configure as variáveis de ambiente na Vercel (passo 1)

#### Erro: "Module not found"
**Solução:** 
1. Execute `npm install` localmente
2. Faça commit do `package-lock.json`
3. Faça push e redeploy

#### Build passa mas site mostra 404
**Solução:**
1. Verifique se o middleware não está bloqueando a rota `/`
2. Verifique os logs do deployment na Vercel
3. Tente acessar uma rota específica como `/blog` para testar

### 7. Testar Localmente Antes do Deploy

Para garantir que tudo funciona:

```bash
# 1. Configure as variáveis no arquivo .env.local
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key

# 2. Instale as dependências
npm install

# 3. Execute o build
npm run build

# 4. Teste o build localmente
npm start
```

Se funcionar localmente, deve funcionar na Vercel.

### 8. Checklist Final

Antes de fazer deploy, verifique:

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Valores das variáveis estão corretos
- [ ] Build passa localmente (`npm run build`)
- [ ] Não há erros no console do build
- [ ] Estrutura de arquivos está correta
- [ ] `package.json` está atualizado
- [ ] Todas as dependências estão no `package.json`

### 9. Suporte Adicional

Se o problema persistir:

1. Verifique os logs completos do deployment na Vercel
2. Verifique os logs do runtime (se disponível)
3. Teste acessando rotas específicas como `/blog` ou `/estudos`
4. Verifique se o Supabase está acessível e as tabelas existem

### 10. URLs Importantes

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **Documentação Next.js:** https://nextjs.org/docs
- **Documentação Vercel:** https://vercel.com/docs

