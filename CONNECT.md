# Vercel · Render 저장소 연결

아래 스크립트로 **연결 페이지**를 연 뒤, 저장소만 선택하면 됩니다.

```powershell
.\connect-vercel-render.ps1
```

---

## Vercel 연결 (프론트엔드)

1. 열린 **Vercel** 탭에서 GitHub 로그인 후 **companyim/attendance-app** 선택 (또는 Import Git Repository에서 해당 저장소 선택)
2. **Configure Project** 에서:
   - **Root Directory**: `frontend` 로 변경 (Edit 클릭)
   - **Environment Variables** → Add → `VITE_API_URL` = `https://(나중에 Render URL)/api` (일단 비워두고 배포 후 수정 가능)
3. **Deploy** 클릭

---

## Render 연결 (백엔드)

1. 열린 **Render** 탭에서 **New +** → **Web Service**
2. **Build and deploy from a Git repository** → **Connect account** 또는 **companyim/attendance-app** 선택 후 **Connect**
3. 설정:
   - **Name**: `attendance-app-backend`
   - **Root Directory**: `backend` 입력
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables** (Add):
     - `NODE_ENV` = `production`
     - `PORT` = `3000`
     - `DATABASE_URL` = (Neon에서 복사한 연결 문자열)
     - `ADMIN_PASSWORD` = (비밀번호)
     - `CORS_ORIGIN` = (Vercel 배포 후 나온 프론트 URL)
4. **Create Web Service** 클릭

연결 후에는 푸시할 때마다 자동 배포됩니다.
