from pydantic import BaseModel, Field

from app.core.models.common import DataSourceType, RiskLevel


class DroneState(BaseModel):
    source_type: DataSourceType = DataSourceType.MOCK
    drone_id: str
    model: str
    battery_percent: int = Field(ge=0, le=100)
    estimated_endurance_minutes: int = Field(ge=0)
    return_to_home_battery_threshold: int = Field(ge=0, le=100)
    payloads: list[str] = Field(default_factory=list)
    link_quality: RiskLevel
    available_for_mission: bool

