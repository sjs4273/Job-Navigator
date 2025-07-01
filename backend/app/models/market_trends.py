# 📄 models/market_trends.py

from sqlalchemy import Column, Integer, String, DateTime, func
from app.models.json_type import JSONType
from app.core.database import Base


class MarketTrendORM(Base):
    """
    GPT 분석용 시장 기술 트렌드 데이터를 저장하는 테이블의 ORM 모델입니다.
    직무(role)별로 최신 트렌드 데이터를 JSON 형태로 저장합니다.
    """
    __tablename__ = "market_trends"

    trend_id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False)            # backend, frontend, mobile, ai 등
    data = Column(JSONType, nullable=False)              # 트렌드 전체 JSON 구조
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
