"""PhishGuard Configuration Module.

This module handles all application configuration using environment variables.
Settings are validated using Pydantic's BaseSettings.
"""

import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "PhishGuard"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Phishing URL Detection System - Cyber Threat Intelligence"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./phishguard.db"

    # CORS
    CORS_ORIGINS: str = "*"

    # Security
    SECRET_KEY: str = "phishguard-dev-secret-key-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins string into a list."""
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        """Pydantic config."""
        env_file = ".env"
        case_sensitive = True


settings = Settings()

