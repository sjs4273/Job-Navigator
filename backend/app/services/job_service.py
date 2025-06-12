from app.models.job import JobCreate, JobUpdate, JobOut
from typing import List, Optional
from datetime import date

_fake_db: List[JobOut] = []
_next_id = 1

def create_job(job: JobCreate) -> JobOut:
    global _next_id
    new_job = JobOut(id=_next_id, **job.dict())
    _fake_db.append(new_job)
    _next_id += 1
    return new_job

def list_jobs() -> List[JobOut]:
    return _fake_db

def get_job(job_id: int) -> Optional[JobOut]:
    return next((job for job in _fake_db if job.id == job_id), None)

def update_job(job_id: int, job_update: JobUpdate) -> Optional[JobOut]:
    for i, job in enumerate(_fake_db):
        if job.id == job_id:
            updated_data = job.dict()
            updated_data.update(job_update.dict(exclude_unset=True))
            updated_job = JobOut(**updated_data)
            _fake_db[i] = updated_job
            return updated_job
    return None

def delete_job(job_id: int) -> bool:
    for i, job in enumerate(_fake_db):
        if job.id == job_id:
            del _fake_db[i]
            return True
    return False

# ✅ 초기 데이터 로딩 함수
def load_sample_jobs():
    global _next_id
    sample_jobs = [
        JobCreate(
            title="백엔드 개발자 (Python)",
            company="AI Company",
            location="서울",
            posted_date=date(2025, 6, 10),
            description="FastAPI와 PostgreSQL 경험자를 찾습니다."
        ),
        JobCreate(
            title="프론트엔드 개발자 (React)",
            company="WebTech",
            location="부산",
            posted_date=date(2025, 6, 9),
            description="TypeScript와 Tailwind CSS 경험자 우대."
        ),
        JobCreate(
            title="데이터 분석가",
            company="DataCorp",
            location="대전",
            posted_date=date(2025, 6, 8),
            description="Pandas, scikit-learn 활용 경험 필요."
        )
    ]
    for job in sample_jobs:
        create_job(job)
