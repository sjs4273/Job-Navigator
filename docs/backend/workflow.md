# 🛠️ Backend 개발 환경 설정 가이드 (FastAPI)

이 문서는 `job-navigator/backend` 디렉토리의 FastAPI 프로젝트를 로컬에서 설치하고 실행하는 방법을 설명합니다. Windows, macOS, Linux 사용자를 모두 고려해 작성되었습니다.

---

## 📋 사전 요구 사항

| 항목       | 설명                                   |
|------------|----------------------------------------|
| Python     | 3.10 이상 권장                         |
| Git        | 프로젝트 클론을 위한 Git 설치 필요     |
| 터미널     | macOS/Linux: 기본 Terminal<br>Windows: Git Bash, PowerShell 또는 WSL 권장 |

---

## 📁 1. 프로젝트 클론

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

`.env` 파일을 아래와 같이 생성합니다:

```env
APP_NAME="Job Navigator"
ENVIRONMENT=development
```

> 📌 `.env` 파일은 Git에 커밋되지 않으며, 로컬 환경에서만 사용됩니다.

---

## 🚀 5. FastAPI 서버 실행

```bash
uvicorn app.main:app --reload
```

### ▶️ 기본 접속 경로

- 메인 페이지: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- API 문서: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🧪 6. 테스트 실행 (선택)

```bash
pytest
```

---

## 🗂️ 디렉토리 구조 요약

```
backend/
├── app/               # FastAPI 애플리케이션 코드
├── tests/             # 테스트 코드
├── requirements.txt   # 의존성 목록
├── .env               # 환경 변수 (직접 생성 필요)
└── .venv/             # 가상환경 (커밋 금지)
```

---

## ⚠️ 주의 사항

- `.venv/` 디렉토리는 반드시 `.gitignore`에 포함되어야 합니다.
- `.env` 파일은 로컬 전용이며 민감한 정보는 절대 커밋하지 마세요.
