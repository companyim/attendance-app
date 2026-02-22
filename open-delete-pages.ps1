# 기존 배포 삭제할 때 열어볼 페이지들
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Start-Process "https://dashboard.render.com/project/prj-d5f9abre5dus7393l10g"
Start-Process "https://vercel.com/dashboard"
Start-Process "https://console.neon.tech/app/org-square-thunder-90602815/projects"

Write-Host "Render, Vercel, Neon 탭을 열었습니다." -ForegroundColor Yellow
Write-Host "FRESH_DEPLOY.md 의 'A. 기존 배포 삭제' 순서대로 삭제한 뒤, 'B. 처음부터 배포'를 진행하세요." -ForegroundColor Green
