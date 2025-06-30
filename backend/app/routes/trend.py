from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.summary import TrendSummaryORM
from app.models.tech_trend import TechTrendORM
from pydantic import BaseModel

# 📦 응답 스키마
class TechnologyTrend(BaseModel):
    name: str
    percentage: float
    count: int
    category: str

class RoleTrendResponse(BaseModel):
    role: str
    technologies: List[TechnologyTrend]  # 전체 목록
    top_5: List[TechnologyTrend]         # 상위 5개
    summary: str

router = APIRouter()

@router.get("/roles/{role_name}", response_model=RoleTrendResponse, summary="직무별 트렌드 키워드 및 요약 조회")
def get_role_trends(
    role_name: str = Path(..., example="backend"),
    db: Session = Depends(get_db)
):
    # 1. 요약 조회
    summary_obj = db.query(TrendSummaryORM).filter(
        TrendSummaryORM.job_category == role_name
    ).first()
    if not summary_obj:
        raise HTTPException(status_code=404, detail=f"[{role_name}] 요약 정보가 없습니다.")

    # 2. 전체 기술 조회 (percentage ≥ 1.0)
    all_tech = db.query(TechTrendORM).filter(
        TechTrendORM.job_category == role_name
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

    # 3. top_5는 top_percentage가 None이 아닌 항목만 추출
    top_5 = [
        TechnologyTrend(
            name=row.keyword,
            percentage=row.top_percentage or 0.0,  # top_5는 top_percentage 기준
            count=row.count,
            category=row.category
        )
        for row in all_tech if row.top_percentage and row.top_percentage > 0
    ][:5]  # 최대 5개만

    return RoleTrendResponse(
        role=role_name,
        technologies=tech_list,
        top_5=top_5,
        summary=summary_obj.summary
    )

