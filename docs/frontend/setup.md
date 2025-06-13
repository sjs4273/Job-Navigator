# 🛠️ Frontend 개발 환경 설정 가이드 (Vite + React)

이 문서는 `job-navigator/frontend` 디렉터리의 프러티엔드 프로젝트를 로커보다 설치하고 실행하는 방법을 설명합니다. Vite + React 기반으로 구성되어 있으며, Windows, macOS, Linux 사용자를 고려했습니다.

---

## 📋 사전 요구 항목

| 항목      | 설명                                                                  |
| ------- | ------------------------------------------------------------------- |
| Node.js | 18 이상 권장                                                            |
| npm     | Node.js 설치 시 기본 포함                                                  |
| Git     | 프로젝트 클론을 위한 Git 설치 필요                                               |
| 터미널     | macOS/Linux: 기본 Terminal<br>Windows: Git Bash, PowerShell 또는 WSL 권장 |

---

## 📁 1. 프로젝트 클론

```bash
git clone https://github.com/your-org/job-navigator.git
cd job-navigator/frontend
```

---

## 📦 2. 의존성 설치

```bash
npm install
```

---

## ⚙️ 3. 환경 변수 설정 (.env 파일)

### ✅ 초기 설치

`.env.example` 파일을 복사하여 `.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

### ✅ 예제 내용

```env
VITE_API_BASE_URL=http://localhost:8000
```

> GitHub Codespaces를 사용하는 경우:
>
> ```env
> VITE_API_BASE_URL=https://8000-사용자명-xxxxxxx.app.github.dev
> ```

이 설정은 API 요청 시 `import.meta.env.VITE_API_BASE_URL`로 접근 가능하게 합니다.

---

## 🚀 4. Vite 개발 서버 실행

```bash
npm run dev
```

### ▶️ 기본 접속 경로

* 메인 페이지: [http://127.0.0.1:5173](http://127.0.0.1:5173)
* 브라우저에서 수동으로 위 주소를 열어 앱 확인 가능

---

## 🔗 5. 백엔드 연동 확인

`src/Jobs.jsx` 또는 API 호출 코드에서 다음과 같이 주소를 설정해야 합니다:

```js
const baseURL = import.meta.env.VITE_API_BASE_URL;
fetch(`${baseURL}/api/v1/jobs/`)
```

> 다음은 채용공고를 가져오는 실제 예시 코드입니다:

```jsx
import { useEffect, useState } from "react";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${baseURL}/api/v1/jobs/`)
      .then((res) => {
        if (!res.ok) throw new Error("API 요청 실패");
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>채용공고 목록</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <strong>{job.title}</strong> - {job.company} ({job.location})
            <p>{job.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Jobs;
```

결과적으로 FastAPI 백엔드 서버도 바로 실행되어야 합니다:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🧪 6. 테스트 및 개발 핀

* API 요청 실패 시 브라우저 개발자 도구(F12) → 콘솔 또는 네트워크 탭에서 확인
* 백엔드 CORS 설정이 되어 있어야 React ↔ FastAPI 간 요청 허용됩니다
* 변경사항 저장 시 Vite는 자동으로 화면을 리로딩합니다

---

## 🗂️ 디렉터리 구조 요약

```
frontend/
├── public/              # 정적 리소스 (favicon, 이미지 등)
├── src/                 # 프러티엔드 소스 코드
│   ├── App.jsx          # 루트 코목
│   ├── Jobs.jsx         # 채용공고 리스트 코드
│   ├── main.jsx         # 진입점 (ReactDOM)
│   └── components/      # 로그인 등 UI 코드
├── index.html           # HTML 템플릿
├── package.json         # 의존성 및 스크립트
├── vite.config.js       # Vite 설정 파일
├── .env.example         # 환경 변수 탐플릿 파일
└── frontend_setup.md    # ← 현재 문서
```

---

## ⚠️ 주의 사항

* `node_modules/`는 매우 크기가 큰 디렉터리이며, 반드시 `.gitignore`에 포함되어야 합니다.
* API 주소는 `.env` 파일을 통해 `VITE_API_BASE_URL` 변수로 분리하여 관리하세요.
* 브라우저 캐쉬 문제로 업데이트가 반영되지 않을 경우 새로고침 또는 강제 새로고침 (Ctrl+Shift+R)을 시도하세요.

---

## 📚 참고 링크

* [Vite 공식 문서](https://vitejs.dev/)
* [React 공식 문서](https://react.dev/)
* [Job Navigator 백엔드 실행 가이드](../docs/backend-structure.md)

---