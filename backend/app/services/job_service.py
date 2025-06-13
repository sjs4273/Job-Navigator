from datetime import date
from uuid import uuid4

JOBS_DB = []


def load_sample_jobs():
    JOBS_DB.append(
        {
            "id": str(uuid4()),
            "title": "백엔드 개발자",
            "company": "AI Company",
            "location": "서울",
            "posted_date": date.today(),
            "description": "FastAPI 경력자 우대",
        }
    )
    JOBS_DB.append(
        {
            "id": str(uuid4()),
            "title": "프론트엔드 개발자",
            "company": "Tech Innovations",
            "location": "부산",
            "posted_date": date.today(),
            "description": "React 경험 필수",
        }
    )
