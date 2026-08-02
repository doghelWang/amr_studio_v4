from pydantic import BaseModel, Field


class InitSandboxRequest(BaseModel):
    projectId: str = Field(..., description="Target project identifier")
    config: dict = Field(..., description="Frontend project configuration payload")


class SaveProjectRequest(BaseModel):
    name: str = Field(..., description="User-visible project name")
    config: dict = Field(..., description="Serialized frontend project configuration")
