# tests/test_job.py

from app.services import job_service


def test_load_sample_jobs():
    # 초기화
    job_service.JOBS_DB.clear()

    # 함수 실행
    job_service.load_sample_jobs()

    # 검증
    assert len(job_service.JOBS_DB) == 2

    titles = [job["title"] for job in job_service.JOBS_DB]
    assert "백엔드 개발자" in titles
    assert "프론트엔드 개발자" in titles

    # 필수 필드 확인
    for job in job_service.JOBS_DB:
        assert "id" in job
        assert "title" in job
        assert "company" in job
        assert "location" in job
        assert "posted_date" in job
        assert "description" in job
