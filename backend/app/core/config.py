import os
from dotenv import load_dotenv

# ✅ main.py에서 명시적으로 불러올 수 있도록 함수로 분리
def load_env():
    load_dotenv()

def get_allowed_origins() -> list[str]:
    origins = os.getenv("CORS_ALLOWED_ORIGINS", "")
    return [origin.strip() for origin in origins.split(",") if origin.strip()]

def get_settings() -> dict:
    return {
        "APP_NAME": os.getenv("APP_NAME", "Job Navigator"),
        "ENVIRONMENT": os.getenv("ENVIRONMENT", "development"),
        "CORS_ALLOWED_ORIGINS": get_allowed_origins()
    }
