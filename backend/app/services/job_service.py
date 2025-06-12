from app.models.job import JobCreate, JobUpdate, JobOut
from typing import List, Optional

# 인메모리 저장소
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
            updated_fields = job.dict()
            updated_fields.update(job_update.dict(exclude_unset=True))
            updated_job = JobOut(**updated_fields)
            _fake_db[i] = updated_job
            return updated_job
    return None

def delete_job(job_id: int) -> bool:
    for i, job in enumerate(_fake_db):
        if job.id == job_id:
            del _fake_db[i]
            return True
    return False
