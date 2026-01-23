# 출석부 앱 배포 스크립트

Write-Host "=== 출석부 앱 배포 준비 ===" -ForegroundColor Green
Write-Host ""

# 1. Git 상태 확인
Write-Host "1. Git 상태 확인 중..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "   변경사항이 있습니다. 커밋하시겠습니까? (Y/N)" -ForegroundColor Yellow
    $commit = Read-Host
    if ($commit -eq "Y" -or $commit -eq "y") {
        git add .
        $message = Read-Host "커밋 메시지 입력"
        if (-not $message) {
            $message = "Deploy preparation"
        }
        git commit -m $message
        Write-Host "   커밋 완료" -ForegroundColor Green
    }
}

# 2. GitHub 푸시
Write-Host ""
Write-Host "2. GitHub에 푸시 중..." -ForegroundColor Yellow
Write-Host "   다음 명령어를 실행하세요:" -ForegroundColor Cyan
Write-Host "   git push origin main" -ForegroundColor White
Write-Host ""

# 3. 배포 가이드 표시
Write-Host "3. 배포 가이드" -ForegroundColor Yellow
Write-Host ""
Write-Host "   프론트엔드 (Vercel):" -ForegroundColor Cyan
Write-Host "   1. https://vercel.com 접속" -ForegroundColor White
Write-Host "   2. GitHub 저장소 연결" -ForegroundColor White
Write-Host "   3. Root Directory: frontend" -ForegroundColor White
Write-Host "   4. 환경 변수: VITE_API_URL 설정" -ForegroundColor White
Write-Host ""
Write-Host "   백엔드 (Render):" -ForegroundColor Cyan
Write-Host "   1. https://render.com 접속" -ForegroundColor White
Write-Host "   2. GitHub 저장소 연결" -ForegroundColor White
Write-Host "   3. Root Directory: backend" -ForegroundColor White
Write-Host "   4. 환경 변수 설정 (.env.production.example 참고)" -ForegroundColor White
Write-Host ""
Write-Host "   자세한 내용은 DEPLOY_NOW.md 파일을 참고하세요." -ForegroundColor Green
Write-Host ""
