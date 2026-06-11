#!/usr/bin/env bash
# Push para o repositório oficial (conta assembleiadedeussacra)
#
# Opção A — com token (recomendado, evita login errado):
#   GITHUB_TOKEN=ghp_seu_token bash scripts/push-assembleiadedeussacra.sh
#
# Opção B — login interativo:
#   bash scripts/push-assembleiadedeussacra.sh

set -e
cd "$(dirname "$0")/.."

REPO="assembleiadedeussacra/site-igrejav2"
REMOTE_URL="https://github.com/${REPO}.git"

GCM="git-credential-manager"
command -v git-credential-manager.exe >/dev/null 2>&1 && GCM="git-credential-manager.exe"

git remote set-url origin "$REMOTE_URL"

echo "Remote atual:"
git remote -v

git fetch origin 2>/dev/null || true

echo ""
echo "Commits locais a enviar:"
git log origin/main..HEAD --oneline || true

echo ""
echo "Limpando credenciais GitHub em cache..."
$GCM github logout Jailton-Silva 2>/dev/null || true
printf "protocol=https\nhost=github.com\n" | $GCM erase 2>/dev/null || true

push_with_token() {
  local token="$1"
  # Push pontual sem salvar credencial do Jailton-Silva
  git -c credential.helper= push \
    "https://assembleiadedeussacra:${token}@github.com/${REPO}.git" \
    HEAD:main
  git branch --set-upstream-to=origin/main main 2>/dev/null || true
}

if [ -n "$GITHUB_TOKEN" ]; then
  echo ""
  echo "Usando GITHUB_TOKEN para push como assembleiadedeussacra..."
  push_with_token "$GITHUB_TOKEN"
else
  cat <<'EOF'

========================================
  AUTENTICACAO: conta assembleiadedeussacra
========================================

O erro 403 ocorre porque o Git usa a conta Jailton-Silva automaticamente.

RECOMENDADO — use token da conta assembleiadedeussacra:

  1. Login em github.com como assembleiadedeussacra
  2. Settings > Developer settings > Personal access tokens > Tokens (classic)
  3. Generate new token > marque "repo"
  4. Rode:

     GITHUB_TOKEN=ghp_COLE_AQUI bash scripts/push-assembleiadedeussacra.sh

ALTERNATIVA — login no navegador (conta da igreja):

  git-credential-manager.exe github login
  (escolha assembleiadedeussacra, NAO Jailton-Silva)
  bash scripts/push-assembleiadedeussacra.sh

EOF
  exit 1
fi

echo ""
echo "Push concluido com sucesso!"
echo "Repo: https://github.com/${REPO}"
