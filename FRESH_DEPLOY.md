# 처음부터 배포하기

기존에 배포된 것을 정리한 뒤, 순서대로 다시 배포하는 가이드입니다.

---

## A. 기존 배포 삭제

아래 순서대로 진행하세요. (삭제 후에도 같은 서비스 이름으로 다시 만들 수 있습니다.)

### 1. Render 백엔드 삭제

1. [Render 대시보드](https://dashboard.render.com) 접속
2. 프로젝트 선택 (또는 [이 프로젝트](https://dashboard.render.com/project/prj-d5f9abre5dus7393l10g))
3. **attendance-app-backend** Web Service 클릭
4. **Settings** (왼쪽) → 맨 아래 **Delete Web Service** → 확인

### 2. Vercel 프론트엔드 삭제

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. 출석부 앱 프로젝트 클릭 (예: attendance-app-one-neon)
3. **Settings** → 맨 아래 **Delete Project** → 프로젝트 이름 입력 후 삭제

### 3. Neon (선택)

- **DB를 비우고 다시 쓰고 싶다면**: Neon 콘솔에서 해당 프로젝트의 브랜치/DB를 삭제하거나, **새 프로젝트**를 만들어서 새 연결 문자열을 쓰면 됩니다.
- **그대로 둬도 됨**: 나중에 Render에서 같은 `DATABASE_URL`을 쓰면 기존 DB에 그대로 연결됩니다.

---

## B. 처음부터 배포 (순서 중요)

### 1. GitHub에 최신 코드 푸시

```powershell
cd C:\Users\compa\Documents\attendance-app-ver2
git add .
git status
git commit -m "Deploy from scratch"
git push origin main
```

- 저장소가 `companyim/attendance-app` 이면 그대로 푸시. 다른 저장소를 쓰면 해당 remote로 푸시.

---

### 2. Neon에서 DB 연결 문자열 준비

1. [Neon 콘솔](https://console.neon.tech/app/org-square-thunder-90602815/projects) 접속
2. **기존 프로젝트** 사용 또는 **New Project**로 새로 생성
3. 프로젝트 → **Connection string** (또는 Dashboard) → **URI** 또는 **Pooled connection** 복사
4. 반드시 `postgresql://` 로 시작하고 끝에 `?sslmode=require` 가 있는지 확인
5. 이 문자열은 **3단계 Render**에서 `DATABASE_URL`로 씁니다 (메모장에 잠깐 붙여두기)

---

### 3. Render에 백엔드 새로 만들기

1. [Render](https://dashboard.render.com) → **New +** → **Web Service**
2. **저장소 연결**: GitHub → `companyim/attendance-app` (또는 사용 중인 저장소) 선택
3. **설정**:
   - **Name**: `attendance-app-backend`
   - **Region**: Singapore (또는 가까운 지역)
   - **Branch**: `main`
   - **Root Directory**: `backend` ← 반드시 입력
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push && npm run build`
   - **Start Command**: `npm start`
4. **Environment Variables** (Advanced 옵션 펼치거나 다음 단계에서):
   - **Add Environment Variable** 로 아래 추가

   | Key | Value |
   |-----|--------|
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |
   | `DATABASE_URL` | 2단계에서 복사한 Neon 연결 문자열 **전체** |
   | `ADMIN_PASSWORD` | 사용할 관리자 비밀번호 (8자 이상) |
   | `CORS_ORIGIN` | 나중에 4단계에서 받은 **프론트엔드 URL**로 수정 (일단 `https://placeholder.vercel.app` 입력해도 됨) |

5. **Create Web Service** 클릭
6. 배포가 끝나면 상단 **서비스 URL** 복사 (예: `https://attendance-app-backend-xxxx.onrender.com`)  
   → 이걸 **4단계 Vercel**과 **CORS_ORIGIN**에 씁니다.

---

### 4. Vercel에 프론트엔드 새로 만들기

1. [Vercel](https://vercel.com) → **Add New** → **Project**
2. **Import** 할 저장소: `companyim/attendance-app` (또는 사용 중인 저장소)
3. **설정**:
   - **Root Directory**: `frontend` → **Edit** 후 `frontend` 입력
   - **Framework Preset**: Vite (자동 감지될 수 있음)
   - **Environment Variables**:
     - Key: `VITE_API_URL`  
     - Value: `https://3단계에서_복사한_Render_URL/api`  
       예: `https://attendance-app-backend-xxxx.onrender.com/api`
4. **Deploy** 클릭
5. 배포 완료 후 **도메인 URL** 복사 (예: `https://attendance-app-xxx.vercel.app`)

---

### 5. 서로 연결하기

**Render (백엔드)**  
- **Environment** → `CORS_ORIGIN` 값을 **4단계에서 복사한 Vercel URL**로 수정 (예: `https://attendance-app-xxx.vercel.app`)  
- **Save Changes** (자동 재배포)

**Vercel (프론트)**  
- 이미 4단계에서 `VITE_API_URL`을 넣었다면 추가 수정 없음.  
- 넣지 않았다면 **Settings** → **Environment Variables** → `VITE_API_URL` = `https://Render서비스URL/api` 추가 후 **Redeploy**

---

### 6. 확인

1. Vercel 프론트 URL 접속
2. 학생 조회 / 관리자 로그인 동작 확인
3. Render **Logs**에서 "데이터베이스 연결 성공" 확인

---

## 한 번에 열기

아래 스크립트로 필요한 대시보드를 열 수 있습니다.

```powershell
.\open-dashboards.ps1
```

(Neon, Render 링크가 열립니다. Vercel은 https://vercel.com/new 에서 저장소 선택 후 진행하세요.)
