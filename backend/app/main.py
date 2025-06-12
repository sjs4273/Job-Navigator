from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ CORS import
from app.api.v1 import job

app = FastAPI(
    title="Job Navigator API",
    description="채용공고 대시보드를 위한 백엔드 API",
    version="1.0.0"
)

# ✅ CORS 설정 추가
origins = [
    "*",    # 모든 도메인 허용 (개발용)
    # "http://localhost:3000",      # React 개발 서버
    # "http://127.0.0.1:3000",
    # "https://your-production-frontend.com",  # 실제 배포 주소 추가 가능
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],      # 모든 메서드 허용
    allow_headers=["*"],      # 모든 헤더 허용
)

@app.on_event("startup")
def startup_event():
    job_service.load_sample_jobs()  # ✅ 초기 데이터 주입

@app.get("/")
def read_root():
    return {"message": "Welcome to the Job Navigator API"}

app.include_router(job.router, prefix="/api/v1/jobs", tags=["Jobs"])
