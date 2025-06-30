from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.core.database import Base

# 기술 트렌드 요약 결과를 저장하는 ORM 모델
class TrendSummaryORM(Base):
    __tablename__ = "trend_summary"

    # 고유 ID (Primary Key)
    id = Column(Integer, primary_key=True, index=True)

    # 직무 카테고리 (예: 'backend', 'frontend', 'mobile', 'ai')
    job_category = Column(String(100), nullable=False)

    # 요약된 트렌드 내용
    summary = Column(Text, nullable=False)

    # 생성 시각 (기본값: 현재 시각)
    created_at = Column(DateTime(timezone=False), server_default=func.now())
