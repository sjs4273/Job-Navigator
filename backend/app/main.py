from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import job
from app.services import job_service
from app.core.config import get_allowed_origins

app = FastAPI(
    title="Job Navigator API",
    description="채용공고 대시보드를 위한 백엔드 API",
    version="1.0.0"
)

# ✅ .env로부터 CORS origin 목록 읽기
origins = get_allowed_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # ✅ 유연하게 CORS Origin 설정
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    job_service.load_sample_jobs()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Job Navigator API"}

app.include_router(job.router, prefix="/api/v1/jobs", tags=["Jobs"])
