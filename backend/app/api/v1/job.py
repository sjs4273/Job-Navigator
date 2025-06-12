from fastapi import APIRouter, HTTPException
from typing import List

from app.models.job import JobCreate, JobUpdate, JobOut
from app.services import job_service

router = APIRouter()

@router.post("/", response_model=JobOut, summary="채용공고 생성")
def create_job(job: JobCreate):
    return job_service.create_job(job)

@router.get("/", response_model=List[JobOut], summary="채용공고 전체 조회")
def list_jobs():
    return job_service.list_jobs()

@router.get("/{job_id}", response_model=JobOut, summary="단일 채용공고 조회")
def get_job(job_id: int):
    job = job_service.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/{job_id}", response_model=JobOut, summary="채용공고 수정")
def update_job(job_id: int, job_update: JobUpdate):
    job = job_service.update_job(job_id, job_update)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.delete("/{job_id}", summary="채용공고 삭제")
def delete_job(job_id: int):
    success = job_service.delete_job(job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted"}
