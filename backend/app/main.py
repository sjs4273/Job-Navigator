from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import job, user, auth  # ✅ auth 대신 개별 라우터 import
from app.services import job_service
from app.core.config import load_env, get_settings
from app.models.user import Base
from app.core.database import engine
from app.core.config import load_env, get_settings

# ✅ 환경 변수 로드 및 설정 초기화
load_env()
settings = get_settings()

# ✅ FastAPI 애플리케이션 인스턴스 생성
app = FastAPI(
    title=settings["APP_NAME"],
    description="채용공고 대시보드를 위한 백엔드 API",
    version="1.0.0",
)

# ✅ CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings["CORS_ALLOWED_ORIGINS"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ DB 테이블 생성 (PgAdmin에서 생성했다면 주석처리해도 무관)
Base.metadata.create_all(bind=engine)

# ✅ 루트 경로 응답
@app.get("/")
def read_root():
    return {"message": f"Welcome to the {settings['APP_NAME']} API!"}

# ✅ 라우터 등록
app.include_router(job.router, prefix="/api/v1/jobs", tags=["Jobs"])

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])

app.include_router(user.router, prefix="/api/v1/users", tags=["User"])

