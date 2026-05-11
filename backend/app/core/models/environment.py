from pydantic import BaseModel, Field

from app.core.models.common import DataSourceType, RiskLevel


class EnvironmentState(BaseModel):
    source_type: DataSourceType = DataSourceType.MOCK
    weather_summary: str
    wind_speed_mps: float = Field(ge=0)
    visibility_level: str
    crowd_level: RiskLevel
    gps_quality: str
    gps_confidence: float = Field(ge=0, le=1)
    data_confidence: float = Field(ge=0, le=1)
