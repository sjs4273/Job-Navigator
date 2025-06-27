from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import job, user, auth, keyword_extract, pdf_upload
from app.services import job_service
from app.core.config import load_env, get_settings
# from app.models.user import Base as UserBase
# from app.models.job import Base as JobBase
from app.core.database import engine

# ✅ 환경 변수 로드 및 설정 초기화
load_env()
settings = get_settings()

# ✅ CORS 허용 origin 리스트 추출
allow_origins = settings["CORS_ALLOWED_ORIGINS"]
print("✅ CORS 허용 origin 목록:", allow_origins)

# ✅ FastAPI 애플리케이션 인스턴스 생성
app = FastAPI(
    title=settings["APP_NAME"],
    description="채용공고 대시보드를 위한 백엔드 API",
    version="1.0.0",
)

# ✅ CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,  # 리스트로 잘 들어감
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 개발 환경에서는 테이블 자동 생성 허용 (주석 처리됨)
# if settings.get("ENV") != "production":
#     UserBase.metadata.create_all(bind=engine)
#     JobBase.metadata.create_all(bind=engine)

# ✅ 루트 경로 테스트
@app.get("/")
def read_root():
    return {"message": f"Welcome to the {settings['APP_NAME']} API!"}

# ✅ 라우터 등록
app.include_router(job.router, prefix="/api/v1/jobs", tags=["Jobs"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(user.router, prefix="/api/v1/users", tags=["User"])
app.include_router(keyword_extract.router, prefix="/api/v1/keywords/extract", tags=["Keyword"])

