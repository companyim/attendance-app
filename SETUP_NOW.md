# 지금 2단계만 하면 됩니다

아래 두 탭이 열렸을 겁니다. **순서대로** 진행하세요.

---

## 1단계: Neon에서 연결 문자열 복사

1. **Neon 탭** (console.neon.tech)에서:
   - 프로젝트 선택
   - **Connection string** 또는 **Dashboard** → 연결 정보에서 **URI** 복사
   - 반드시 끝에 `?sslmode=require` 가 포함된 문자열을 쓰세요.  
     예: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - 비밀번호에 `@`, `#`, `%` 등이 있으면 URL 인코딩된 값으로 바꿔서 넣어야 할 수 있습니다.

---

## 2단계: Render에 환경 변수 넣기

1. **Render 탭** (dashboard.render.com)에서:
   - 프로젝트 → **attendance-app-backend** (백엔드 Web Service) 클릭
   - 왼쪽 **Environment** 클릭
   - 아래 변수 추가/수정:

| Key | Value |
|-----|--------|
| `DATABASE_URL` | 1단계에서 복사한 Neon 연결 문자열 **그대로** 붙여넣기 |
| `CORS_ORIGIN` | `https://attendance-app-one-neon.vercel.app` |
| `ADMIN_PASSWORD` | 사용할 관리자 비밀번호 (예: 8자 이상) |

2. **Save Changes** 클릭 (자동 재배포됨)

3. 상단 **서비스 URL** 복사 (예: `https://attendance-app-backend-xxxx.onrender.com`)

---

## 3단계: Vercel에 백엔드 주소 넣기

1. **Vercel** (vercel.com) → 출석부 프로젝트 → **Settings** → **Environment Variables**
2. `VITE_API_URL` 수정:
   - Value: `https://방금_복사한_Render_URL/api`  
     (예: `https://attendance-app-backend-xxxx.onrender.com/api`)
3. **Redeploy** 실행

---

끝입니다. 프론트 주소(attendance-app-one-neon.vercel.app)에서 로그인·출석 확인해 보세요.

---

## ❌ "데이터베이스 연결 실패" / P1012 로그가 나올 때

- **원인**: Render에 `DATABASE_URL`이 없거나, 값이 잘못됐을 때 발생합니다.
- **해결**:
  1. [Render 프로젝트](https://dashboard.render.com/project/prj-d5f9abre5dus7393l10g) → **attendance-app-backend** → **Environment**
  2. **DATABASE_URL** 키가 정확히 있는지 확인 (대소문자 구분). 없으면 **Add Environment Variable** 로 추가.
  3. **Value** 는 Neon에서 **Connection string** 을 **한 번에 복사**해서 그대로 붙여넣기.
     - Neon 대시보드: 프로젝트 → **Connection string** 에서 **URI** 또는 **Pooled connection** 선택 후 복사.
     - 반드시 `postgresql://` 로 시작하고, 끝에 `?sslmode=require` 가 포함되어 있어야 합니다.
  4. **주의**: 값을 수동으로 수정하지 말고, Neon에서 복사한 문자열 전체를 붙여넣으세요. 비밀번호에 `@`, `#` 등이 있으면 Neon이 이미 인코딩한 값을 줍니다.
  5. **Save Changes** 클릭 → 재배포 후 로그에 **"데이터베이스 연결 성공"** 이 나오면 됩니다.
  6. 여전히 P1012가 나오면: Neon에서 **Pooled connection** (풀 연결) 문자열로 바꿔서 시도해 보세요.
