# 출석부 앱 Ver.2 배포 가이드 (무료 플랜)

교리출석, 미사출석, 부서출석을 관리하는 출석부 앱 Ver.2를 **무료 플랜**으로 배포하는 방법입니다.

---

## 무료 사용 한도

| 서비스 | 무료 한도 |
|--------|-----------|
| **Vercel** | Hobby: 월 100GB 대역폭, 무제한 배포 |
| **Render** | Free: 750시간/월, 슬립 모드 (15분 미사용 시 대기) |
| **Neon** | Free: 0.5GB 스토리지, 1 프로젝트 |

---

## 1. Neon (DB) - 무료

1. [Neon 콘솔](https://console.neon.tech) 접속
2. **New Project** 또는 기존 프로젝트 선택
3. **Connection string** → **URI** 또는 **Pooled** 복사
4. 끝에 `?sslmode=require` 포함 확인

---

## 2. Render (백엔드) - 무료

1. [Render](https://dashboard.render.com) → **New +** → **Web Service**
2. 저장소: `companyim/attendance-app` 연결
3. 설정:
   - **Name**: `attendance-app-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push && npm run build`
   - **Start Command**: `npm start`
4. **Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `DATABASE_URL` = (1단계 Neon 연결 문자열)
   - `ADMIN_PASSWORD` = (비밀번호)
   - `CORS_ORIGIN` = (3단계 Vercel URL로 나중에 수정)
5. **Create Web Service** → 배포 완료 후 **서비스 URL** 복사

---

## 3. Vercel (프론트엔드) - 무료

1. [Vercel](https://vercel.com/new) → **Add New** → **Project**
2. 저장소: `companyim/attendance-app` 선택
3. 설정:
   - **Root Directory**: `frontend`
   - **Environment Variables**: `VITE_API_URL` = `https://(2단계 Render URL)/api`
4. **Deploy** 클릭 → 배포 후 **도메인 URL** 복사

---

## 4. 연결

- **Render** → Environment → `CORS_ORIGIN` = (3단계 Vercel URL) → Save
- **Vercel** → Settings → `VITE_API_URL` = `https://(Render URL)/api` → Redeploy

---

## 연결 페이지 한 번에 열기

```powershell
.\connect-vercel-render.ps1
```

자세한 단계는 [CONNECT.md](./CONNECT.md), [DEPLOY_NOW.md](./DEPLOY_NOW.md) 참고.
