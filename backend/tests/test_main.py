# tests/test_main.py

from fastapi.testclient import TestClient
from app.main import app
from app.services import job_service

client = TestClient(app)


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert "API" in response.json()["message"]


def test_startup_loads_sample_jobs():
    # client를 실행하면서 startup 이벤트가 트리거되었는지 확인
    job_service.JOBS_DB.clear()
    with TestClient(app) as test_client:
        test_client.get("/")  # 트리거

    assert len(job_service.JOBS_DB) == 2
    assert any(job["title"] == "백엔드 개발자" for job in job_service.JOBS_DB)
    assert any(job["title"] == "프론트엔드 개발자" for job in job_service.JOBS_DB)


def test_jobs_endpoint_loads_sample_jobs():
    # 테스트 시작 전 데이터 초기화
    job_service.JOBS_DB.clear()

    with TestClient(app) as client:
        response = client.get("/api/v1/jobs/")
        data = response.json()

    # ✅ 응답 검증
    assert response.status_code == 200
    assert isinstance(data, list)
    assert len(data) == 2

    titles = [job["title"] for job in data]
    assert "백엔드 개발자" in titles
    assert "프론트엔드 개발자" in titles
