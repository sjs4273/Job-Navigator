from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from typing import List, Any
from datetime import datetime
from pydantic import BaseModel

from app.core.database import get_db
from app.models.summary import TrendSummaryORM
from app.models.tech_trend import TechTrendORM
from app.models.market_trends import MarketTrendORM

router = APIRouter()

# ✅ 공통 기술 트렌드 스키마
class TechnologyTrend(BaseModel):
    name: str
    percentage: float
    count: int
    category: str

# ✅ 직무별 기술 트렌드 응답 스키마
class RoleTrendResponse(BaseModel):
    role: str
    technologies: List[TechnologyTrend]  # 전체 목록
    top_5: List[TechnologyTrend]         # 상위 5개
    summary: str

# ✅ 직무별 요약 및 기술 키워드 API
@router.get(
    "/roles/{role}",
    response_model=RoleTrendResponse,
    summary="직무별 트렌드 키워드 및 요약 조회"
)
def get_role_trends(
    role: str = Path(..., examples={"example": {"value": "backend"}}),
    db: Session = Depends(get_db)
):
    summary_obj = db.query(TrendSummaryORM).filter(
        TrendSummaryORM.job_category == role
    ).first()
    if not summary_obj:
        raise HTTPException(status_code=404, detail=f"[{role}] 요약 정보가 없습니다.")

    all_tech = db.query(TechTrendORM).filter(
        TechTrendORM.job_category == role
    ).order_by(TechTrendORM.percentage.desc()).all()

    tech_list = [
        TechnologyTrend(
            name=row.keyword,
            percentage=row.percentage,
            count=row.count,
            category=row.category
        )
        for row in all_tech if row.percentage >= 1.0
    ]

    top_5 = [
        TechnologyTrend(
            name=row.keyword,
            percentage=row.top_percentage or 0.0,
            count=row.count,
            category=row.category
        )
        for row in all_tech if row.top_percentage and row.top_percentage > 0
    ][:5]

    return RoleTrendResponse(
        role=role,
        technologies=tech_list,
        top_5=top_5,
        summary=summary_obj.summary
    )


# ✅ 마켓 트렌드 응답 스키마
class MarketTrendOut(BaseModel):
    role: str
    updated_at: datetime
    data: Any

    class Config:
        orm_mode = True

# ✅ 직무별 마켓 트렌드 조회 API
@router.get(
    "/market/{role}",
    response_model=MarketTrendOut,
    summary="직무별 마켓 트렌드 통계 조회"
)
def get_market_trend(role: str, db: Session = Depends(get_db)):
    trend = db.query(MarketTrendORM).filter(MarketTrendORM.role == role).first()
    if not trend:
        raise HTTPException(status_code=404, detail="해당 직무의 마켓 트렌드 정보가 없습니다.")
    return trend
