# 공통 의존성 주입 예시
from fastapi import Depends
from app.core.config import settings

def get_settings():
    return settings
