from pydantic import BaseModel

class JobOut(BaseModel):
    title: str
    company: str
    location: str
    score: float
