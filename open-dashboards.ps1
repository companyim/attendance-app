# 배포 설정용 대시보드 열기 (Neon + Render)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$neon = "https://console.neon.tech/app/org-square-thunder-90602815/projects"
$render = "https://dashboard.render.com/project/prj-d5f9abre5dus7393l10g"
Start-Process $neon
Start-Process $render
Write-Host "Neon, Render 탭을 열었습니다. SETUP_NOW.md 를 보면서 환경 변수를 넣어주세요." -ForegroundColor Green
