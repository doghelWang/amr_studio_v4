from pydantic import BaseModel, conlist
from typing import List, Literal, Optional

class WheelConfig(BaseModel):
    id: str
    label: str
    mountX: float
    mountY: float
    mountYaw: float
    orientation: str
    driverModel: str
    canBus: str
    canNodeId: int
    motorPolarity: str
    zeroPos: float
    leftLimit: float
    rightLimit: float
    headOffsetIdle: float
    tailOffsetIdle: float
    leftOffsetIdle: float
    rightOffsetIdle: float
    maxVelocityIdle: float
    maxAccIdle: float
    maxDecIdle: float
    headOffsetFull: float
    tailOffsetFull: float
    leftOffsetFull: float
    rightOffsetFull: float
    maxVelocityFull: float
    maxAccFull: float
    maxDecFull: float

class SensorConfig(BaseModel):
    id: str
    type: Literal['LASER', 'CAMERA', 'ULTRASONIC', 'GYRO', 'ENCODER']
    model: str
    usageNavi: bool
    usageObs: bool
    offsetX: float
    offsetY: float
    offsetZ: float = 0.0
    yaw: float
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
    id: str
    port: str
    logicBind: str
    originModel: Optional[str] = None

class GeneratePayload(BaseModel):
    robotName: str
    version: str
    driveType: Literal['DIFF', 'SINGLE_STEER', 'DUAL_STEER', 'QUAD_STEER', 'MECANUM']
    navigationMethod: Optional[str] = None
    wheels: List[WheelConfig]
    sensors: List[SensorConfig]
    ioBoards: Optional[List[IOBoardConfig]] = []
    ioPorts: List[IOConfig]

