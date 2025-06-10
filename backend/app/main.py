from fastapi import FastAPI
from app.api.v1 import job

app = FastAPI(title="Job Navigator API")

@app.get("/")
def read_root():
    return {"message": "Hello, world!"}

# 라우터 등록
app.include_router(job.router, prefix="/api/v1/jobs", tags=["Jobs"])
