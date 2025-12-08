# Guia de Deploy na Vercel

## ⚠️ Erro 404 NOT_FOUND - Solução

Se você está recebendo um erro 404 após o deploy na Vercel, siga estes passos:

### 1. Verificar Variáveis de Ambiente

Certifique-se de que as seguintes variáveis de ambiente estão configuradas no painel da Vercel:

1. Acesse seu projeto na Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_do_supabase
```

**Importante:** 
- As variáveis devem começar com `NEXT_PUBLIC_` para serem acessíveis no cliente
- Certifique-se de copiar os valores corretos do seu projeto Supabase

### 2. Verificar Build Logs

1. Acesse **Deployments** no painel da Vercel
2. Clique no deployment que falhou
3. Verifique os **Build Logs** para identificar erros específicos

### 3. Verificar Configuração do Projeto

Certifique-se de que:
- O **Framework Preset** está configurado como **Next.js**
- O **Root Directory** está vazio (ou configurado corretamente se necessário)
- O **Build Command** está como `next build` (padrão)
- O **Output Directory** está vazio (padrão)

### 4. Rebuild do Projeto

Após configurar as variáveis de ambiente:

1. Vá em **Deployments**
2. Clique nos três pontos (...) do último deployment
3. Selecione **Redeploy**
4. Ou faça um novo commit e push para o repositório

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

### 6. Problemas Comuns

#### Erro: "Missing Supabase environment variables"
- **Solução:** Configure as variáveis de ambiente na Vercel (passo 1)

#### Erro: "Module not found"
- **Solução:** Execute `npm install` localmente e faça commit do `package-lock.json`

#### Erro: "Build failed"
- **Solução:** Verifique os logs de build na Vercel para identificar o erro específico

### 7. Testar Localmente Antes do Deploy

Antes de fazer deploy, teste o build localmente:

```bash
# Instalar dependências
npm install

# Criar arquivo .env.local com as variáveis
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key

# Testar build
npm run build

# Testar servidor de produção
npm start
```

Se o build funcionar localmente, o problema provavelmente está nas variáveis de ambiente na Vercel.

### 8. Suporte Adicional

Se o problema persistir:
1. Verifique os logs de build na Vercel
2. Verifique se todas as dependências estão no `package.json`
3. Certifique-se de que o Node.js version está compatível (Vercel usa Node 18+ por padrão)

