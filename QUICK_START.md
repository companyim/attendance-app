# 빠른 시작 가이드

## 서버 실행 방법

### 1단계: 데이터베이스 마이그레이션 (최초 1회 또는 스키마 변경 시)

**터미널 1** (PowerShell 또는 명령 프롬프트):

```powershell
cd C:\Users\compa\Documents\attendance-app\backend
npx prisma migrate deploy
npx prisma generate
```

> **참고**: 마이그레이션 오류가 나면 `npx prisma migrate dev` 사용

### 2단계: 백엔드 서버 실행

**터미널 1**에서 계속:

```powershell
npm run dev
```

성공하면 다음과 같은 메시지가 표시됩니다:
```
서버가 포트 3000에서 실행 중입니다.
로컬 접속: http://localhost:3000
```

### 3단계: 프론트엔드 서버 실행

**새 터미널 2** (PowerShell 또는 명령 프롬프트)를 열고:

```powershell
cd C:\Users\compa\Documents\attendance-app\frontend
npm run dev
```

성공하면 다음과 같은 메시지가 표시됩니다:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4단계: 브라우저에서 접속

브라우저에서 다음 주소로 접속:
- **프론트엔드**: http://localhost:5173
- **백엔드 API**: http://localhost:3000

## 문제 해결

### 오류: "Cannot connect to site" / "ERR_CONNECTION_REFUSED"

**원인**: 서버가 실행되지 않음

**해결 방법**:
1. 터미널에서 서버가 실행 중인지 확인
2. 백엔드 서버가 `http://localhost:3000`에서 실행 중인지 확인
3. 프론트엔드 서버가 `http://localhost:5173`에서 실행 중인지 확인
4. 두 서버 모두 실행되어야 합니다

### 오류: "Prisma Client" 관련 오류

**해결 방법**:
```powershell
cd C:\Users\compa\Documents\attendance-app\backend
npx prisma generate
```

### 오류: 데이터베이스 연결 오류

**해결 방법**:
1. `.env` 파일 확인 (backend 폴더)
2. `DATABASE_URL`이 올바른지 확인
3. PostgreSQL 데이터베이스가 실행 중인지 확인

### 포트가 이미 사용 중

**해결 방법**:
- 다른 포트 사용 중인 프로그램 종료
- 또는 `.env` 파일에서 포트 번호 변경

## 서버 중지 방법

각 터미널에서 `Ctrl + C`를 눌러 서버를 중지합니다.

## 다음 단계

서버가 정상적으로 실행되면:
1. 브라우저에서 http://localhost:5173 접속
2. 관리자 로그인 (`/admin/login`)
3. 새로운 출석 체크 항목 테스트:
   - 교리출석
   - 미사출석
   - 부서출석
