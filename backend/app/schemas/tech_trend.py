from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional


# ✅ 기술 트렌드 응답용 스키마
class TechTrendOut(BaseModel):
    trend_id: int
    keyword: str
    job_category: str
    count: int
    trend_date: date
    created_at: datetime
    category: str
    percentage: float
    top_percentage: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)
