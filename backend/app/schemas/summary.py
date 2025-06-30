from pydantic import BaseModel, ConfigDict
from datetime import datetime

# ✅ 기술 트렌드 요약 조회용 응답 스키마
class TrendSummaryOut(BaseModel):
    id: int
    job_category: str
    summary: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
