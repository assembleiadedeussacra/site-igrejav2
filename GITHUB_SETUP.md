# 🚀 Configuração do Repositório GitHub

## Novo Repositório: `site-igrejav2`

O remote do Git foi configurado para o novo repositório. Agora você precisa criar o repositório no GitHub.

## Passo a Passo

### 1. Criar o Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `site-igrejav2`
   - **Description:** (opcional) Site da Igreja Assembleia de Deus Missão
   - **Visibility:** Escolha **Public** ou **Private**
   - **NÃO marque** "Initialize this repository with a README" (já temos código)
3. Clique em **Create repository**

### 2. Fazer Push do Código

Após criar o repositório, execute:

```bash
# Verificar se está tudo certo
git status

# Fazer push do código
git push -u origin main
```

Se você já criou o repositório, pode executar o push agora:

```bash
git push -u origin main
```

### 3. Se o Repositório Já Existe

Se o repositório `site-igrejav2` já existe no GitHub:

```bash
# Fazer push forçado (se necessário)
git push -u origin main --force
```

**⚠️ Atenção:** Use `--force` apenas se tiver certeza de que quer sobrescrever o conteúdo do repositório remoto.

### 4. Verificar Configuração

```bash
# Ver remotes configurados
git remote -v

# Deve mostrar:
# origin  https://github.com/assembleiadedeussacra/site-igrejav2.git (fetch)
# origin  https://github.com/assembleiadedeussacra/site-igrejav2.git (push)
```

## 🔐 Autenticação

Se você receber erro de autenticação:

### Opção 1: Personal Access Token (Recomendado)

1. Vá em: https://github.com/settings/tokens
2. Clique em **Generate new token (classic)**
3. Dê um nome (ex: "site-igreja")
4. Selecione escopos: `repo` (todos)
5. Clique em **Generate token**
6. Copie o token
7. Use quando o Git pedir senha:
   - Username: seu usuário do GitHub
   - Password: cole o token

### Opção 2: SSH (Alternativa)

Se preferir usar SSH:

```bash
# Remover remote atual
git remote remove origin

# Adicionar com SSH
git remote add origin git@github.com:assembleiadedeussacra/site-igrejav2.git
```

## 📋 Próximos Passos

Após fazer o push:

1. ✅ Código no GitHub
2. ✅ Conectar na Vercel (se ainda não conectou)
3. ✅ Configurar variáveis de ambiente na Vercel
4. ✅ Fazer deploy

## 🆘 Problemas Comuns

### Erro: "repository not found"
- Verifique se o repositório existe no GitHub
- Verifique se você tem permissão de acesso
- Verifique se o nome do repositório está correto

### Erro: "authentication failed"
- Use Personal Access Token em vez de senha
- Ou configure SSH keys

### Erro: "remote origin already exists"
```bash
# Remover e adicionar novamente
git remote remove origin
git remote add origin https://github.com/assembleiadedeussacra/site-igrejav2.git
```

