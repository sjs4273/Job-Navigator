# 🛠️ Backend 개발 환경 설정 가이드 (FastAPI 기반)

이 문서는 `job-navigator/backend` 디렉터리의 FastAPI 프로젝트를 로컬에서 설치하고 실행하는 방법을 안내합니다. Windows, macOS, Linux 환경을 모두 고려해 작성되었습니다.

---

## 📋 사전 요구 항목

| 항목     | 설명                                                                  |
| ------ | ------------------------------------------------------------------- |
| Python | 3.10 이상 권장                                                          |
| Git    | 프로젝트 클론을 위한 Git 설치 필요                                               |
| 터미널    | macOS/Linux: 기본 Terminal<br>Windows: Git Bash, PowerShell 또는 WSL 권장 |

---

## 📥 1. 프로젝트 클론

```bash
git clone https://github.com/your-org/job-navigator.git
cd job-navigator/backend
```

---

## 🐍 2. 가상환경 생성 및 활성화

### ✅ macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### ✅ Windows (CMD)

```cmd
python -m venv .venv
.venv\Scripts\activate.bat
```

### ✅ Windows (PowerShell)

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

> 💡 *WSL (Ubuntu on Windows)를 사용하는 경우 macOS/Linux 명령어와 동일합니다.*

---

## 📦 3. 패키지 설치

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 🔐 4. 환경 변수 파일 생성

### ✅ 초기 설정

`.env` 파일을 수동으로 생성하거나 `.env.example` 파일을 기준으로 복사합니다:

```bash
cp .env.example .env
```

### ✅ `.env.example` 예시

```dotenv
APP_NAME="Job Navigator"
ENVIRONMENT=development
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

> 📌 `.env` 파일은 Git에 커밋되지 않도록 `.gitignore`에 포함되어야 하며, 필요 시 `.env.example`을 사용하여 공유합니다.

---

## 🚀 5. FastAPI 서버 실행

```bash
uvicorn app.main:app --reload
```

### ▶️ 기본 접속 경로

* 메인 페이지: [http://127.0.0.1:8000](http://127.0.0.1:8000)
* Swagger API 문서: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🧪 6. 테스트 실행 (선택 사항)

```bash
pytest
```

---

## 📁 디렉터리 구조 요약

```
backend/
├── app/
│   ├── core/              # 설정 관련 파일 (환경변수 등)
│   ├── main.py            # FastAPI 앱 엔트리포인트
│   ├── models/            # Pydantic 모델 정의
│   ├── routes/            # API 라우터 정의
│   └── services/          # 비즈니스 로직
├── tests/                 # 테스트 코드
├── requirements.txt       # Python 의존성 목록
├── .env                   # 로컬 환경 변수 파일 (직접 생성)
└── .venv/                 # Python 가상환경 (Git 제외)
```

---

## ⚠️ 주의 사항

* `.venv/`와 `.env` 파일은 반드시 `.gitignore`에 포함되어야 합니다.
* 환경 설정은 `.env.example`을 통해 안전하게 공유할 수 있도록 유지합니다.
* 프로젝트 구조는 FastAPI 권장 구조를 따르며, 추후 DB 연동, 인증 도입 시에도 쉽게 확장할 수 있도록 설계되어 있습니다.
