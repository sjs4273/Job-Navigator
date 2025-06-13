# 📘 Job Navigator 프러티엔드 구조 문서 (Vite + React 기반)

이 문서는 `job-navigator/frontend` 디렉터리의 Vite + React 구성을 통해 프러티엔드 구조를 설명하고, 요청 흑망과 구성 방식을 유의적으로 설명합니다.

---

## 📁 전체 디렉터리 구조

```
frontend/
├── public/              # 정적 리소스 (favicon, 이미지 등)
├── src/                 # 프러티엔드 소스 코드
│   ├── App.jsx          # 루트 코목
│   ├── Jobs.jsx         # 채용공고 리스트 코드
│   ├── main.jsx         # 진입점 (ReactDOM.render)
│   └── components/      # 보존 UI 요소 (ex. login.jsx)
├── .env                 # 환경 변수 파일 (Git에서 제외)
├── .env.example         # 탐플릿 환경 파일
├── index.html           # HTML 템플릿 (root div 설정)
├── package.json         # 의존성 및 npm 스크립트
├── package-lock.json    # 정확한 의존 결정 정보
├── vite.config.js       # Vite 설정 파일 (proxy 등 개발 시 필요)
├── eslint.config.js     # 코드 호시와 스킬 보안 설정
├── frontend_setup.md    # 개발 환경 안내 문서
└── frontend-structure.md# ← 현재 문서 위치
```

---

## 🔧 클라이언트 개발 흑망

1. 백엔드가 실행중인 `localhost:8000`에서 API 를 제공
2. 프러티엔드가 `localhost:5173`에서 실행 되며, `.env`에서 `VITE_API_BASE_URL`로 구성
3. `Jobs.jsx`가 `useEffect`를 통해 `/api/v1/jobs/`를 fetch
4. 백엔드가 CORS 허용 가상이면 응답 반환

---

## 🧰 주요 구성 요소 설명

### `App.jsx`

* 그룹 화면의 루트 코목입니다.
* `Jobs.jsx` 등의 커피에너 항목을 포함합니다.

### `Jobs.jsx`

* 채용공고를 로드해서 나열적으로 보여주는 커피에너
* `useEffect` 또는 `fetch` 함수를 통해 API 를 발표

### `components/`

* 반드시 보존 요소 (ex. `login.jsx`, `login.css`)

### `.env` / `.env.example`

* `VITE_API_BASE_URL`를 설정해 API base URL을 관리
* `.env`는 Git에 커린되며, `.env.example`만 공유

---

## 🚀 확장 가능 포인트

* ✅ React Router 등록 건설 가능 (ex. 로그인/회원가입 화면)
* ✅ Zustand, Redux, Recoil 등의 전역 상황 관리기 등록 가능
* ✅ Tailwind CSS 또는 Styled Components 개선 가능
* ✅ Jest + React Testing Library을 통해 테스트 확장 가능

---

## ✨ 개발 추가 핀 가이드

* `.env` 변경 시 프러티엔드 서버 다시 시작
* fetch API를 통해 백엔드와 URL 조합 테스트 가능
* API 연동 시 CORS 구성이 FastAPI 에서 결정 되어야 합니다.

---

## 📈 참고 링크

* [Vite 공식 문서](https://vitejs.dev/)
* [React 공식 문서](https://react.dev/)
* [MDN fetch API](https://developer.mozilla.org/ko/docs/Web/API/Fetch_API)
