from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    service_name: str = "skyops-agent"
    api_version: str = "0.1.0"
    app_mode: Literal["mock", "development", "test", "production"] = "mock"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="SKYOPS_",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

