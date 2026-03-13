from pydantic import BaseModel, conlist
from typing import List, Literal, Optional, Dict, Any

class WheelConfig(BaseModel):
    model_config = {"extra": "allow"}
    id: str
    label: str
    mountX: float = 0.0
    mountY: float = 0.0
    mountYaw: float = 0.0
    orientation: str = "CENTER"
    driverModel: str = "ELMO"
    canBus: str = "CAN0"
    canNodeId: int = 1
    motorPolarity: str = "NORMAL"
    zeroPos: float = 0.0
    leftLimit: float = -90.0
    rightLimit: float = 90.0
    headOffsetIdle: float = 0.0
    tailOffsetIdle: float = 0.0
    leftOffsetIdle: float = 0.0
    rightOffsetIdle: float = 0.0
    maxVelocityIdle: float = 1500.0
    maxAccIdle: float = 800.0
    maxDecIdle: float = 800.0
    headOffsetFull: float = 0.0
    tailOffsetFull: float = 0.0
    leftOffsetFull: float = 0.0
    rightOffsetFull: float = 0.0
    maxVelocityFull: float = 1200.0
    maxAccFull: float = 500.0
    maxDecFull: float = 500.0

class SensorConfig(BaseModel):
    model_config = {"extra": "allow"}
    id: str
    type: str
    model: str
    usageNavi: bool = True
    usageObs: bool = True
    offsetX: float = 0.0
    offsetY: float = 0.0
    offsetZ: float = 0.0
    yaw: float = 0.0
    pitch: float = 0.0
    roll: float = 0.0
    ip: Optional[str] = None
    port: Optional[int] = None
    canNodeId: Optional[int] = None

class IOBoardConfig(BaseModel):
    model_config = {"extra": "allow"}
    id: str
    model: str
    canNodeId: Optional[int] = None
    channels: Optional[int] = None

class IOConfig(BaseModel):
    model_config = {"extra": "allow"}
    id: str
    port: str
    logicBind: str
    originModel: Optional[str] = None
    ioBoardId: Optional[str] = None

class GeneratePayload(BaseModel):
    model_config = {"extra": "allow"}
    projectId: Optional[str] = None
    robotName: str
    version: str
    driveType: str
    navigationMethod: Optional[str] = None
    wheels: List[WheelConfig] = []
    sensors: List[SensorConfig] = []
    ioBoards: List[IOBoardConfig] = []
    ioPorts: List[IOConfig] = []
    actuators: List[Dict[str, Any]] = []
    auxiliary: List[Dict[str, Any]] = []
    others: List[Dict[str, Any]] = []
