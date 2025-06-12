# 🛠️ Frontend 개발 환경 설정 가이드 (Vite + React)

이 문서는 `job-navigator/frontend` 디렉토리의 프론트엔드 프로젝트를 로컬에서 설치하고 실행하는 방법을 설명합니다. Vite + React 기반으로 구성되어 있으며, Windows, macOS, Linux 사용자를 모두 고려해 작성되었습니다.

---

## 📋 사전 요구 사항

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

## 🚀 3. Vite 개발 서버 실행

```bash
npm run dev
```

### ▶️ 기본 접속 경로

* 메인 페이지: [http://127.0.0.1:5173](http://127.0.0.1:5173)
* 브라우저에서 수동으로 위 주소를 열어 앱 확인 가능

---

## 🔗 4. 백엔드 연동 확인

프론트엔드에서는 다음 주소로 API 요청을 보냅니다:

```js
fetch("http://localhost:8000/api/v1/jobs/")
```

* 따라서 FastAPI 백엔드 서버도 반드시 실행되어 있어야 합니다:

```bash
uvicorn app.main:app --reload
```

---

## 🧪 5. 테스트 및 개발 팁

* API 요청 실패 시 브라우저 개발자 도구(F12) → 콘솔 또는 네트워크 탭에서 확인
* 백엔드 CORS 설정이 되어 있어야 React ↔ FastAPI 간 요청 허용됨
* 변경사항 저장 시 Vite는 자동으로 화면을 리로딩함

---

## 🗂️ 디렉토리 구조 요약

```
frontend/
├── public/              # 정적 리소스 (favicon, 이미지 등)
├── src/                 # 프론트엔드 소스 코드
│   ├── App.jsx          # 루트 컴포넌트
│   ├── Jobs.jsx         # 채용공고 리스트 컴포넌트
│   ├── main.jsx         # 진입점 (ReactDOM)
│   └── components/      # 로그인 등 UI 컴포넌트
├── index.html           # HTML 템플릿
├── package.json         # 의존성 및 스크립트
├── vite.config.js       # Vite 설정 파일
└── frontend_setup.md    # ← 현재 문서
```

---

## ⚠️ 주의 사항

* `node_modules/`는 매우 큰 디렉토리이며, 반드시 `.gitignore`에 포함되어야 합니다.
* API 주소는 `.env` 파일을 통해 `VITE_API_URL` 등의 변수로 분리할 수 있습니다.
* 브라우저 캐시 문제로 업데이트가 반영되지 않을 경우 새로고침 또는 강제 새로고침 (Ctrl+Shift+R)을 시도하세요.

---

## 📚 참고 링크

* [Vite 공식 문서](https://vitejs.dev/)
* [React 공식 문서](https://react.dev/)
* [Job Navigator 백엔드 실행 가이드](../docs/backend-structure.md)

---

문제 발생 시 `frontend_setup.md`를 확인하고, 필요한 경우 프로젝트 관리자에게 문의해주세요.
