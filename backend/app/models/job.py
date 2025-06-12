from pydantic import BaseModel
from datetime import date
from typing import Optional

# 🔹 생성 시 사용할 모델
class JobCreate(BaseModel):
    title: str
    company: str
    location: str
    posted_date: date
    description: str

# 🔹 수정 시 사용할 모델 (모든 필드는 선택적)
class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    posted_date: Optional[date] = None
    description: Optional[str] = None

# 🔹 응답용 출력 모델
class JobOut(BaseModel):
    id: int
    title: str
    company: str
    location: str
    posted_date: date
    description: str
