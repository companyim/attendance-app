# 출석부 앱 배포 가이드

## 배포 아키텍처

- **프론트엔드**: Vercel (무료 플랜)
- **백엔드**: Render (무료 플랜) 또는 Railway
- **데이터베이스**: SQLite (파일 기반) 또는 PostgreSQL (Supabase 무료 플랜)

## 사전 준비사항

### 1. Git 저장소 준비

```bash
cd attendance-app
git init
git add .
git commit -m "Initial commit"
```

GitHub에 저장소를 만들고 연결:

```bash
git remote add origin https://github.com/your-username/attendance-app.git
git push -u origin main
```

### 2. 환경 변수 확인

백엔드 `.env` 파일:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=file:./prisma/dev.db
ADMIN_PASSWORD=your-secure-password
CORS_ORIGIN=https://your-frontend.vercel.app
```

## 배포 단계

### 1단계: Vercel에 프론트엔드 배포

1. **Vercel 계정 생성**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 추가**
   - "Add New Project" 클릭
   - GitHub 저장소 선택
   - Root Directory: `frontend` 설정
   - Framework Preset: Vite 선택

3. **환경 변수 설정**
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
   또는 Railway 사용 시:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

4. **배포**
   - "Deploy" 클릭
   - 배포 완료 후 URL 확인 (예: `https://attendance-app.vercel.app`)

### 2단계: Render에 백엔드 배포

1. **Render 계정 생성**
   - https://render.com 접속
   - GitHub 계정으로 로그인

2. **새 Web Service 생성**
   - "New +" → "Web Service" 선택
   - GitHub 저장소 연결
   - 설정:
     - **Name**: `attendance-app-backend`
     - **Region**: Singapore (또는 가장 가까운 지역)
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`

3. **환경 변수 설정**
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=file:./prisma/dev.db
   ADMIN_PASSWORD=your-secure-password-here
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

4. **배포**
   - "Create Web Service" 클릭
   - 첫 배포는 몇 분 소요
   - 배포 완료 후 URL 확인 (예: `https://attendance-app-backend.onrender.com`)

### 3단계: Railway에 백엔드 배포 (대안)

Railway를 사용하는 경우:

1. **Railway 계정 생성**
   - https://railway.app 접속
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - "New Project" → "Deploy from GitHub repo"
   - 저장소 선택
   - Root Directory: `backend` 설정

3. **환경 변수 설정**
   - Variables 탭에서 환경 변수 추가 (위와 동일)

4. **배포**
   - 자동으로 배포 시작
   - 배포 완료 후 URL 확인

### 4단계: PostgreSQL 데이터베이스 설정 (선택사항)

SQLite 대신 PostgreSQL을 사용하려면:

1. **Supabase 프로젝트 생성**
   - https://supabase.com 접속
   - 새 프로젝트 생성
   - 데이터베이스 URL 복사

2. **Prisma 스키마 변경**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **환경 변수 업데이트**
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```

4. **마이그레이션 실행**
   ```bash
   npx prisma migrate deploy
   ```

## 배포 후 확인사항

### 1. 프론트엔드 확인
- [ ] https://your-app.vercel.app 접속 가능
- [ ] 관리자 로그인 페이지 작동
- [ ] API 요청이 백엔드로 전송됨

### 2. 백엔드 확인
- [ ] https://your-backend.onrender.com 접속 가능
- [ ] `/api/health` 엔드포인트 응답 확인
- [ ] 데이터베이스 연결 확인

### 3. 기능 테스트
- [ ] 교리출석 체크 작동
- [ ] 미사출석 체크 작동
- [ ] 부서출석 체크 작동
- [ ] 학생 관리 작동
- [ ] 통계 대시보드 작동

## 문제 해결

### CORS 오류
- 백엔드의 `CORS_ORIGIN` 환경 변수에 프론트엔드 URL이 정확히 설정되어 있는지 확인

### 데이터베이스 연결 오류
- SQLite 사용 시: Render/Railway에서 파일 시스템이 영구적이지 않을 수 있음
- PostgreSQL 사용 권장 (Supabase 무료 플랜)

### 빌드 오류
- `package.json`의 빌드 스크립트 확인
- Prisma Client 생성 확인: `npx prisma generate`

### 환경 변수 오류
- 모든 환경 변수가 올바르게 설정되었는지 확인
- 프론트엔드와 백엔드 모두 확인

## 무료 플랜 제한사항

### Vercel
- 월 100GB 대역폭
- 무제한 요청
- 자동 HTTPS

### Render
- 무료 플랜: 15분 비활성 시 슬립 모드
- 첫 요청 시 깨어나는데 시간 소요 (Cold Start)
- 월 750시간 무료

### Railway
- 월 $5 크레딧 무료
- 사용량에 따라 과금
- 슬립 모드 없음

## 권장사항

1. **프로덕션 환경 변수**
   - 강력한 `ADMIN_PASSWORD` 사용
   - `JWT_SECRET` 랜덤 문자열 생성

2. **데이터베이스**
   - 프로덕션에서는 PostgreSQL 사용 권장
   - SQLite는 파일 시스템 제한으로 인해 문제 발생 가능

3. **모니터링**
   - Vercel Analytics 활성화
   - Render/Railway 로그 확인

4. **백업**
   - 정기적으로 데이터베이스 백업
   - 환경 변수 백업

## 빠른 배포 체크리스트

- [ ] Git 저장소에 코드 푸시
- [ ] Vercel에 프론트엔드 배포
- [ ] Render/Railway에 백엔드 배포
- [ ] 환경 변수 설정
- [ ] CORS 설정 확인
- [ ] 데이터베이스 연결 확인
- [ ] 기능 테스트
- [ ] 도메인 연결 (선택사항)
