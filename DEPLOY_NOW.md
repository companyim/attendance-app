# 지금 바로 배포하기

## 1단계: GitHub에 코드 푸시

터미널에서 실행:

```bash
cd C:\Users\compa\Documents\attendance-app
git push origin main
```

인증이 필요하면 GitHub Personal Access Token을 사용하거나, GitHub Desktop을 사용하세요.

## 2단계: Vercel에 프론트엔드 배포

### 빠른 배포 (5분)

1. **Vercel 접속**: https://vercel.com
2. **GitHub로 로그인**
3. **"Add New Project" 클릭**
4. **저장소 선택**: `companyim/attendance-app`
5. **프로젝트 설정**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (중요!)
   - **Build Command**: `npm run build` (자동 감지)
   - **Output Directory**: `dist` (자동 감지)
6. **환경 변수 추가**:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api` (백엔드 배포 후 업데이트)
7. **"Deploy" 클릭**

### 배포 완료 후
- 프론트엔드 URL 확인 (예: `https://attendance-app.vercel.app`)
- 이 URL을 백엔드 `CORS_ORIGIN`에 설정해야 함

## 2.5단계: 데이터베이스 (Neon PostgreSQL)

- **Neon**은 **데이터베이스만** 제공합니다. API 서버는 아래 3단계에서 Render에 배포합니다.
- [Neon 콘솔](https://console.neon.tech/app/org-square-thunder-90602815/projects)에서:
  1. 프로젝트 선택 → **Connection string** 복사 (또는 Dashboard → 연결 정보)
  2. 형식: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
- 이 연결 문자열을 **3단계 Render**의 `DATABASE_URL`에 그대로 넣습니다.

## 3단계: Render에 백엔드 배포

- **내 Render 프로젝트**: [dashboard.render.com 프로젝트 열기](https://dashboard.render.com/project/prj-d5f9abre5dus7393l10g)

### 빠른 배포 (10분)

1. **Render 접속**: https://render.com (또는 위 링크)
2. **GitHub로 로그인**
3. **"New +" → "Web Service" 클릭**
4. **저장소 연결**: `companyim/attendance-app`
5. **서비스 설정**:
   - **Name**: `attendance-app-backend`
   - **Region**: Singapore (또는 가장 가까운 지역)
   - **Branch**: `main`
   - **Root Directory**: `backend` (중요!)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push && npm run build`
   - **Start Command**: `npm start`
6. **환경 변수 추가** (Environment Variables 섹션):
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<Neon에서 복사한 PostgreSQL 연결 문자열>
   ADMIN_PASSWORD=your-secure-password-here
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```
   ⚠️ `DATABASE_URL`은 Neon 콘솔에서 복사한 값으로 넣으세요.
   ⚠️ `ADMIN_PASSWORD`는 강력한 비밀번호로 변경하세요!
   ⚠️ `CORS_ORIGIN`은 프론트엔드 URL로 설정하세요!

7. **"Create Web Service" 클릭**

### 배포 완료 후
- 백엔드 URL 확인 (예: `https://attendance-app-backend.onrender.com`)
- 프론트엔드 환경 변수 `VITE_API_URL` 업데이트 필요

## 4단계: 환경 변수 업데이트

### 프론트엔드 (Vercel)
1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. `VITE_API_URL` 수정:
   - Value: `https://attendance-app-backend.onrender.com/api`
3. "Redeploy" 클릭

### 백엔드 (Render)
1. [Render 프로젝트](https://dashboard.render.com/project/prj-d5f9abre5dus7393l10g) → 백엔드 **Web Service** 클릭 → **Environment**
2. `CORS_ORIGIN` 확인:
   - Value: `https://attendance-app.vercel.app` (실제 프론트엔드 URL)
3. "Save Changes" 클릭 (자동 재배포)

## 5단계: 테스트

1. 프론트엔드 URL 접속
2. 관리자 로그인 (`/admin/login`)
3. 기능 테스트:
   - ✅ 교리출석 체크
   - ✅ 미사출석 체크
   - ✅ 부서출석 체크
   - ✅ 학생 관리
   - ✅ 통계 대시보드

## 문제 해결

### "서버에 연결할 수 없습니다" 오류 (배포 후)
- **원인**: Vercel에 `VITE_API_URL`이 없거나 잘못됨. 빌드 시 기본값이 `http://localhost:3000/api`라서, 배포된 사이트에서는 백엔드에 연결되지 않습니다.
- **해결**:
  1. Vercel 대시보드 → 프로젝트 → **Settings** → **Environment Variables**
  2. **VITE_API_URL** 추가(또는 수정): 값 = 백엔드 API 주소 (예: `https://attendance-app-backend.onrender.com/api`)
  3. **Redeploy** 실행 (환경 변수 변경 후 재배포 필요)

### CORS 오류
- 백엔드 `CORS_ORIGIN`에 프론트엔드 URL이 정확히 설정되었는지 확인
- 프로토콜 포함 (https://)

### API 연결 오류
- 프론트엔드 `VITE_API_URL`이 올바른지 확인
- `/api` 경로 포함 확인

### 데이터베이스 연결 실패 / P1012 (Render 로그)
- **원인**: `DATABASE_URL`이 Render Environment에 없거나 형식이 잘못됨
- **해결**: Render → 서비스 → Environment → `DATABASE_URL`에 Neon 연결 문자열 **전체** 붙여넣기 (끝에 `?sslmode=require` 포함). 저장 후 재배포

## 배포 완료 체크리스트

- [ ] GitHub에 코드 푸시 완료
- [ ] Vercel에 프론트엔드 배포 완료
- [ ] Render에 백엔드 배포 완료
- [ ] 환경 변수 설정 완료
- [ ] CORS 설정 확인
- [ ] 기능 테스트 완료

## 다음 단계

배포가 완료되면:
1. 도메인 연결 (선택사항)
2. 모니터링 설정
3. 백업 전략 수립
