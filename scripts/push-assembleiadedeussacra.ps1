# Push para o repositório oficial da igreja (conta assembleiadedeussacra)
# Execute no PowerShell:  .\scripts\push-assembleiadedeussacra.ps1
# No Git Bash use:        bash scripts/push-assembleiadedeussacra.sh

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

$Gcm = "git-credential-manager"
if (Test-Path "C:\Program Files\Git\mingw64\bin\git-credential-manager.exe") {
    $Gcm = "C:\Program Files\Git\mingw64\bin\git-credential-manager.exe"
}

$Repo = "assembleiadedeussacra/site-igrejav2"
$RemoteUrl = "https://github.com/$Repo.git"

Write-Host "Configurando remote..." -ForegroundColor Cyan
git remote set-url origin $RemoteUrl

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

Write-Host "`nRemovendo login GitHub da conta Jailton-Silva..." -ForegroundColor Yellow
& $Gcm github logout Jailton-Silva 2>$null
"protocol=https`nhost=github.com" | & $Gcm erase 2>$null
"protocol=https`nhost=github.com`nusername=Jailton-Silva" | & $Gcm erase 2>$null

if ($env:GITHUB_TOKEN) {
    Write-Host "`nUsando GITHUB_TOKEN para push como assembleiadedeussacra..." -ForegroundColor Green
    git -c credential.helper= push "https://assembleiadedeussacra:$($env:GITHUB_TOKEN)@github.com/$Repo.git" HEAD:main
    git branch --set-upstream-to=origin/main main 2>$null
} else {
    Write-Host @"

========================================
  ERRO 403: Git usa conta Jailton-Silva
========================================

Use token da conta assembleiadedeussacra:

  1. github.com > assembleiadedeussacra > Settings > Developer settings > Tokens
  2. Generate (classic) > marque 'repo'
  3. No PowerShell:

     `$env:GITHUB_TOKEN='ghp_SEU_TOKEN'
     .\scripts\push-assembleiadedeussacra.ps1

"@ -ForegroundColor Yellow
    exit 1
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nPush concluido com sucesso!" -ForegroundColor Green
    Write-Host "Repo: https://github.com/$Repo" -ForegroundColor Cyan
} else {
    Write-Host "`nPush falhou. Verifique o token da conta assembleiadedeussacra." -ForegroundColor Red
    exit 1
}
