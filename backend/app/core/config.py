"""
Dhan Sarthi — Application Configuration
Uses pydantic-settings for env-driven config.
Production: set DATABASE_URL to PostgreSQL connection string.
"""
import os

try:
    from pydantic_settings import BaseSettings
except (ImportError, Exception):
    try:
        from pydantic.v1 import BaseSettings
    except (ImportError, AttributeError, Exception):
        from pydantic import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Dhan Sarthi API"
    APP_VERSION: str = "2.1.0"

    # Database — SQLite for hackathon, override with PostgreSQL URL in production
    DATABASE_URL: str = "sqlite:///./dhan_sarthi.db"

    # JWT
    SECRET_KEY: str = "dhan-sarthi-hackathon-secret-key-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Authorization gateway
    AUTHORIZATION_EXPIRY_MINUTES: int = 60
    MIN_SUITABILITY_SCORE: int = 60
    MIN_KNOWLEDGE_SCORE: int = 50
    MAX_CONCENTRATION_PCT: float = 40.0

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
