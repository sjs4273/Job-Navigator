from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Job Navigator"
    environment: str = "development"
    allowed_origins: str = "*"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()

def get_allowed_origins() -> list[str]:
    return [origin.strip() for origin in settings.allowed_origins.split(",")]
