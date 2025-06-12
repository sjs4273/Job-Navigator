# 📘 Job Navigator 백엔드 구조 문서 (FastAPI 기반)

이 문서는 FastAPI에 익숙하지 않은 초급 개발자를 위해 작성된 백엔드 구조 안내서입니다. 프로젝트의 주요 구성 요소, 역할, 요청 흐름, 확장 포인트 등을 설명합니다.

---

## 📁 전체 디렉토리 구조

```
backend/
├── app/                     # FastAPI 애플리케이션 루트
│   ├── main.py              # 앱 진입점 (FastAPI 객체 생성 및 라우터 등록)
│   ├── api/                 # API 라우터 정의
│   │   └── v1/              # 버전별 API (현재는 v1 사용)
│   │       └── job.py       # 채용공고 관련 CRUD 라우터 정의
│   ├── models/              # Pydantic 모델 (데이터 검증 및 직렬화)
│   │   └── job.py           # JobCreate, JobUpdate, JobOut 모델 정의
│   ├── services/            # 비즈니스 로직 처리 계층
│   │   └── job_service.py   # 인메모리 CRUD 및 샘플 데이터 생성 로직
│   ├── core/                # 앱 설정 및 공통 종속성 관리
│   │   ├── config.py        # (예정) 환경설정 및 config 변수 정의
│   │   └── dependencies.py  # (예정) 의존성 주입 함수 정의
├── requirements.txt         # 프로젝트 의존성 정의 파일
├── tests/                   # 테스트 코드 저장소
│   └── test_job.py          # job API 테스트용 코드
└── docs/                    # 문서 디렉토리
    └── backend-structure.md # ← 현재 문서 위치
```

---

## ⚙️ FastAPI 애플리케이션 요청 흐름

1. 클라이언트가 `/api/v1/jobs/`로 요청을 보냄
2. `main.py` 에서 해당 요청이 `job.py` 라우터로 전달됨
3. `job.py` 라우터에서 `job_service.py`의 함수 호출
4. `job_service.py`는 인메모리 DB에서 데이터 처리 후 반환
5. `job.py`는 데이터를 Pydantic `JobOut` 모델로 직렬화하여 응답

```
[Client] → [main.py] → [api.v1.job.py] → [services.job_service.py] → [models.job.JobOut] → 응답
```

---

## 🧩 주요 구성 요소 설명

### `main.py`

* FastAPI 인스턴스를 생성합니다.
* CORS 미들웨어 설정을 포함합니다.
* API 라우터를 등록합니다.
* 앱 시작 시 샘플 데이터를 자동 등록합니다.

### `api/v1/job.py`

* HTTP 라우팅을 정의하는 곳입니다 (GET, POST, PUT, DELETE)
* 실제 비즈니스 로직은 service에 위임합니다.

### `models/job.py`

* `JobCreate`: POST 요청에 사용할 생성용 모델
* `JobUpdate`: PUT 요청에 사용할 수정용 모델
* `JobOut`: GET 응답 시 사용할 출력 모델

### `services/job_service.py`

* 채용공고에 대한 CRUD 비즈니스 로직을 담당합니다.
* 현재는 인메모리 리스트(`_fake_db`)를 통해 데이터 저장/조회가 이루어집니다.
* `load_sample_jobs()` 함수는 샘플 데이터를 미리 채워 넣습니다.

---

## 🧪 테스트 및 개발 팁

### 1. 서버 실행

```bash
uvicorn app.main:app --reload
```

### 2. Swagger 문서 확인

* 브라우저에서 `http://localhost:8000/docs`
* 자동 생성된 API 문서로 쉽게 테스트 가능

### 3. 샘플 요청

#### POST /api/v1/jobs

```json
{
  "title": "백엔드 개발자",
  "company": "AI Company",
  "location": "서울",
  "posted_date": "2025-06-10",
  "description": "FastAPI 경력자 우대"
}
```

### 4. GET /api/v1/jobs

샘플 채용공고 리스트 반환 (서버 시작 시 자동 생성됨)

---

## 💡 추가 설명

* **FastAPI는 경량이고 매우 빠른 Python 웹 프레임워크**입니다. 타입 힌트를 기반으로 자동 문서화가 강력한 것이 장점입니다.
* **Pydantic**은 데이터 유효성 검사를 위한 모델 선언 도구입니다. JSON ↔ Python 변환이 간편합니다.
* \*\*서비스 레이어(service)\*\*를 분리하면 라우터에서 로직을 분리할 수 있어 유지보수와 테스트에 유리합니다.
* 현재는 DB를 사용하지 않고 있으나, SQLAlchemy 등으로 연동이 가능하며 구조 변경 없이도 쉽게 확장할 수 있습니다.

---

## 🚀 앞으로 확장 가능 포인트

* ✅ PostgreSQL + SQLAlchemy 연동
* ✅ 검색(query 파라미터) 및 정렬 기능 추가
* ✅ 페이지네이션 구현
* ✅ 사용자 인증 추가 (OAuth2, JWT)
* ✅ 테스트 코드 작성 확대 (unit + integration)

---

## 📚 참고 링크

* [FastAPI 공식문서](https://fastapi.tiangolo.com/ko/)
* [Pydantic 공식문서](https://docs.pydantic.dev/)
* [Uvicorn ASGI 서버](https://www.uvicorn.org/)
* [Swagger UI 사용법](https://swagger.io/tools/swagger-ui/)

---
