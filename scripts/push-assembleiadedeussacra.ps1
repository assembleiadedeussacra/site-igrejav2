# Push para o repositório oficial da igreja (conta assembleiadedeussacra)
# Execute no PowerShell:  .\scripts\push-assembleiadedeussacra.ps1
# No Git Bash use:        bash scripts/push-assembleiadedeussacra.sh

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host "Remote atual:" -ForegroundColor Cyan
git remote -v

$ahead = git rev-list --count origin/main..HEAD 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Buscando origin..." -ForegroundColor Yellow
    git fetch origin
    $ahead = git rev-list --count origin/main..HEAD
}

Write-Host "`nCommits locais a enviar: $ahead" -ForegroundColor Cyan
git log origin/main..HEAD --oneline

Write-Host "`nLimpando credenciais antigas do GitHub..." -ForegroundColor Yellow
"protocol=https`nhost=github.com" | git credential reject 2>$null

Write-Host @"

========================================
  LOGIN: use a conta assembleiadedeussacra
========================================
- Se abrir o navegador, entre na conta da IGREJA (nao Jailton-Silva)
- Ou use Personal Access Token como senha:
  GitHub > assembleiadedeussacra > Settings > Developer settings > Tokens

"@ -ForegroundColor Green

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nPush concluido com sucesso!" -ForegroundColor Green
    Write-Host "Repo: https://github.com/assembleiadedeussacra/site-igrejav2" -ForegroundColor Cyan
} else {
    Write-Host "`nPush falhou. Verifique se esta logado como assembleiadedeussacra." -ForegroundColor Red
    exit 1
}
