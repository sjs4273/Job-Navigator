from pydantic import BaseModel
from typing import Optional
from datetime import date

class JobBase(BaseModel):
    title: str
    company: str
    location: str
    posted_date: date
    description: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    posted_date: Optional[date] = None
    description: Optional[str] = None

class JobOut(JobBase):
    id: str
