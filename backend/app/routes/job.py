from fastapi import APIRouter, HTTPException
from uuid import uuid4
from app.models.job import JobCreate, JobUpdate, JobOut
from app.services import job_service

router = APIRouter()

@router.get("/", response_model=list[JobOut])
def get_jobs():
    return job_service.JOBS_DB

@router.post("/", response_model=JobOut)
def create_job(job: JobCreate):
    new_job = job.dict()
    new_job["id"] = str(uuid4())
    job_service.JOBS_DB.append(new_job)
    return new_job

@router.put("/{job_id}", response_model=JobOut)
def update_job(job_id: str, job: JobUpdate):
    for j in job_service.JOBS_DB:
        if j["id"] == job_id:
            j.update(job.dict(exclude_unset=True))
            return j
    raise HTTPException(status_code=404, detail="Job not found")
