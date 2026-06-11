#!/usr/bin/env bash
# Push para o repositório oficial (conta assembleiadedeussacra)
# Uso: bash scripts/push-assembleiadedeussacra.sh

set -e
cd "$(dirname "$0")/.."

echo "Remote atual:"
git remote -v

git fetch origin 2>/dev/null || true

echo ""
echo "Commits locais a enviar:"
git log origin/main..HEAD --oneline || true

echo ""
echo "Limpando credenciais antigas do GitHub..."
printf "protocol=https\nhost=github.com\n" | git credential reject 2>/dev/null || true

cat <<'EOF'

========================================
  LOGIN: use a conta assembleiadedeussacra
========================================
- Se abrir o navegador, entre na conta da IGREJA (nao Jailton-Silva)
- Ou use Personal Access Token como senha:
  GitHub > assembleiadedeussacra > Settings > Developer settings > Tokens

EOF

git push -u origin main

echo ""
echo "Push concluido com sucesso!"
echo "Repo: https://github.com/assembleiadedeussacra/site-igrejav2"
