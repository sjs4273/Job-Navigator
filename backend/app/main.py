from fastapi import FastAPI
from app.api.v1 import job

app = FastAPI(
    title="Job Navigator API",
    description="채용공고 대시보드를 위한 백엔드 API",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Job Navigator API"}

app.include_router(job.router, prefix="/api/v1/jobs", tags=["Jobs"])
