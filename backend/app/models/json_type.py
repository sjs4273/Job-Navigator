import os
import sqlalchemy as sa

# ✅ ENVIRONMENT 환경변수 기반으로 DB 종류 구분
if os.getenv("ENVIRONMENT", "development") == "production":
    from sqlalchemy.dialects.postgresql import JSONB
    JSONType = JSONB
else:
    JSONType = sa.JSON  # 또는 sa.Text (SQLite 3.9 미만일 경우)
