# 자동 배포 가이드

## ✅ GitHub 푸시 완료!

코드가 성공적으로 GitHub에 푸시되었습니다: `companyim/attendance-app`

## 🚀 이제 Vercel과 Render에서 배포만 하면 됩니다!

### 방법 1: Vercel 자동 배포 (프론트엔드)

1. **Vercel 접속**: https://vercel.com
2. **"Add New Project" 클릭**
3. **GitHub 저장소 선택**: `companyim/attendance-app`
4. **프로젝트 설정**:
   - **Root Directory**: `frontend` ⚠️ 중요!
   - **Framework Preset**: Vite (자동 감지)
   - **Build Command**: 자동 감지됨
   - **Output Directory**: `dist` (자동 감지됨)
5. **환경 변수** (나중에 설정 가능):
   - Key: `VITE_API_URL`
   - Value: 백엔드 배포 후 URL 입력
6. **"Deploy" 클릭**

✅ **배포 완료 시간**: 약 2-3분

### 방법 2: Render 자동 배포 (백엔드)

1. **Render 접속**: https://render.com
2. **"New +" → "Web Service" 클릭**
3. **GitHub 저장소 연결**: `companyim/attendance-app`
4. **서비스 설정**:
   - **Name**: `attendance-app-backend`
   - **Region**: Singapore
   - **Branch**: `main`
   - **Root Directory**: `backend` ⚠️ 중요!
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
5. **환경 변수 추가**:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=file:./prisma/dev.db
   ADMIN_PASSWORD=your-secure-password-here
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```
   ⚠️ `ADMIN_PASSWORD`는 강력한 비밀번호로 변경하세요!
   ⚠️ `CORS_ORIGIN`은 프론트엔드 배포 후 URL로 설정하세요!

6. **"Create Web Service" 클릭**

✅ **배포 완료 시간**: 약 5-10분

## 📋 배포 순서 권장사항

1. **백엔드 먼저 배포** (Render)
   - 배포 완료 후 URL 확인 (예: `https://attendance-app-backend.onrender.com`)

2. **프론트엔드 배포** (Vercel)
   - 환경 변수 `VITE_API_URL`에 백엔드 URL + `/api` 설정
   - 예: `https://attendance-app-backend.onrender.com/api`

3. **백엔드 CORS 업데이트** (Render)
   - 환경 변수 `CORS_ORIGIN`에 프론트엔드 URL 설정
   - 예: `https://attendance-app.vercel.app`
   - 저장하면 자동 재배포

## 🎯 배포 완료 후 확인사항

- [ ] 프론트엔드 URL 접속 가능
- [ ] 백엔드 `/api/health` 엔드포인트 응답 확인
- [ ] 관리자 로그인 작동
- [ ] 교리출석 체크 작동
- [ ] 미사출석 체크 작동
- [ ] 부서출석 체크 작동

## 🔧 문제 해결

### CORS 오류
- 백엔드 `CORS_ORIGIN`에 프론트엔드 URL이 정확히 설정되었는지 확인
- 프로토콜 포함 (https://)

### API 연결 오류
- 프론트엔드 `VITE_API_URL`이 올바른지 확인
- `/api` 경로 포함 확인
- 환경 변수 설정 후 재배포 필요

### 빌드 오류
- Root Directory가 올바른지 확인 (`frontend` 또는 `backend`)
- Build Command 확인

## 💡 팁

- Vercel과 Render는 GitHub 저장소에 푸시할 때마다 자동으로 재배포됩니다
- 환경 변수는 각 플랫폼의 대시보드에서 설정할 수 있습니다
- 배포 로그는 각 플랫폼의 대시보드에서 확인할 수 있습니다
