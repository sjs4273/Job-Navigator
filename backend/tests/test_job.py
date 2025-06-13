from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_jobs():
    response = client.get("/api/v1/jobs?query=developer")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
