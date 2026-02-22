# Vercel / Render 저장소 연결 페이지 열기
# companyim/attendance-app 저장소로 연결할 수 있는 페이지를 엽니다.
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$vercelRepo = "https%3A%2F%2Fgithub.com%2Fcompanyim%2Fattendance-app"
$vercelUrl = "https://vercel.com/new/clone?repository-url=https://github.com/companyim/attendance-app"
$renderUrl = "https://dashboard.render.com/select-repo?type=web"

Start-Process $vercelUrl
Start-Sleep -Seconds 1
Start-Process $renderUrl

Write-Host "Vercel, Render 탭을 열었습니다." -ForegroundColor Green
Write-Host "Vercel: companyim/attendance-app 선택 -> Root Directory: frontend -> Deploy" -ForegroundColor Yellow
Write-Host "Render: New Web Service -> companyim/attendance-app 연결 -> Root: backend -> 환경 변수 입력 -> Create" -ForegroundColor Yellow
Write-Host "자세한 단계: CONNECT.md" -ForegroundColor Cyan
