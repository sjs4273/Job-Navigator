# backend/scripts/migration.py

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models.user import UserORM
from app.models.job import JobORM
from app.models.resume import ResumeORM
from app.models.roadmap import RoadmapORM
from app.models.favorite import FavoriteJobORM
from app.models.tech_trend import TechTrendORM

# ✅ .env 파일 로드
load_dotenv(dotenv_path="./backend/.env")

# ✅ 공통 환경 변수
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")

# ✅ 로컬 DB 연결 (localhost)
LOCAL_DB_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:{POSTGRES_PORT}/{POSTGRES_DB}"
local_engine = create_engine(LOCAL_DB_URL)
LocalSession = sessionmaker(bind=local_engine)

# ✅ Docker DB 연결 (host=db)
DOCKER_DB_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@db:{POSTGRES_PORT}/{POSTGRES_DB}"
docker_engine = create_engine(DOCKER_DB_URL)
DockerSession = sessionmaker(bind=docker_engine)

def migrate():
    local_db = LocalSession()
    docker_db = DockerSession()

    try:
        # ✅ users
        for user in local_db.query(UserORM).all():
            docker_db.merge(user)

        # ✅ jobs
        for job in local_db.query(JobORM).all():
            docker_db.merge(job)

        # ✅ resumes
        for resume in local_db.query(ResumeORM).all():
            docker_db.merge(resume)

        # ✅ roadmaps
        for roadmap in local_db.query(RoadmapORM).all():
            docker_db.merge(roadmap)

        # ✅ user_favorite_posts
        for fav in local_db.query(FavoriteJobORM).all():
            docker_db.merge(fav)

        # ✅ tech_trends
        for trend in local_db.query(TechTrendORM).all():
            docker_db.merge(trend)

        docker_db.commit()
        print("✅ 전체 마이그레이션 완료!")

    except Exception as e:
        docker_db.rollback()
        print(f"❌ 마이그레이션 중 오류 발생: {e}")

    finally:
        local_db.close()
        docker_db.close()

if __name__ == "__main__":
    migrate()
