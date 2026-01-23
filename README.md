# 출석부 앱

교리출석, 미사출석, 부서출석을 관리하는 웹 애플리케이션입니다.

## 주요 기능

- ✅ **교리출석 체크** - 학년별 필수 선택
- ✅ **미사출석 체크** - 학년별 필수 선택  
- ✅ **부서출석 체크** - 부서별 선택
- ✅ **학생 관리** - 등록, 수정, 삭제, 엑셀 업로드
- ✅ **달란트 시스템** - 출석 시 자동 지급
- ✅ **통계 대시보드** - 출석률, 학년별/부서별 비교
- ✅ **학생 조회** - 이름으로 출석 기록 조회 (인증 불필요)

## 기술 스택

### 프론트엔드
- React + TypeScript
- Vite
- Tailwind CSS
- React Router

### 백엔드
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite / PostgreSQL

## 로컬 개발

### 사전 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/your-username/attendance-app.git
cd attendance-app
```

2. **백엔드 설정**
```bash
cd backend
npm install
cp .env.example .env
# .env 파일 수정
npm run dev
```

3. **프론트엔드 설정** (새 터미널)
```bash
cd frontend
npm install
cp .env.example .env
# .env 파일 수정
npm run dev
```

4. **브라우저 접속**
- 프론트엔드: http://localhost:5173
- 백엔드: http://localhost:3000

## 배포

자세한 배포 가이드는 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)를 참고하세요.

### 빠른 배포 (Vercel + Render)

1. **GitHub에 코드 푸시**
2. **Vercel에 프론트엔드 배포**
   - 저장소 연결
   - Root Directory: `frontend`
   - 환경 변수: `VITE_API_URL` 설정
3. **Render에 백엔드 배포**
   - 저장소 연결
   - Root Directory: `backend`
   - 환경 변수 설정 (`.env.production.example` 참고)

## 프로젝트 구조

```
attendance-app/
├── frontend/          # React 프론트엔드
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── backend/           # Express 백엔드
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
└── README.md
```

## 환경 변수

### 백엔드 (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=file:./prisma/dev.db
ADMIN_PASSWORD=admin123
CORS_ORIGIN=http://localhost:5173
```

### 프론트엔드 (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## 라이선스

MIT
