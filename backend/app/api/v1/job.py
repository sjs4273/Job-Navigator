from fastapi import APIRouter, Query
from app.models.job import JobOut
from app.services.job_service import search_jobs

router = APIRouter()

@router.get("/", response_model=list[JobOut])
def get_jobs(query: str = Query(..., description="검색 키워드")):
    return search_jobs(query)
