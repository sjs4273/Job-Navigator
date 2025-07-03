from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

# ✅ 이력서 조회 응답 스키마 (Pydantic v2 기준 + user_id 포함)
class ResumeOut(BaseModel):
    resume_id: int
    user_id: int
    file_path: Optional[str] = None           # ✅ 변경: None 허용
    filename: Optional[str]  # ✅ 추가
    extracted_keywords: List[str]
    job_category: str
    resume_text: Optional[str] = None         # 이미 허용됨
    created_at: datetime
    gpt_response: Optional[Any] = None

    model_config = {
        "from_attributes": True
    }
