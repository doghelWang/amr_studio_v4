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
    # Idle
    headOffsetIdle: float
    tailOffsetIdle: float
    leftOffsetIdle: float
    rightOffsetIdle: float
    maxVelocityIdle: float
    maxAccIdle: float
    maxDecIdle: float
    # Full Load
    headOffsetFull: float
    tailOffsetFull: float
    leftOffsetFull: float
    rightOffsetFull: float
    maxVelocityFull: float
    maxAccFull: float
    maxDecFull: float

class SensorConfig(BaseModel):
    id: str
    type: Literal['LASER', 'CAMERA', 'ULTRASONIC', 'GYRO']
    model: str
    usageNavi: bool
    usageObs: bool
    offsetX: float
    offsetY: float
    yaw: float

class IOConfig(BaseModel):
    id: str
    port: str
    logicBind: str

class GeneratePayload(BaseModel):
    robotName: str
    version: str
    driveType: Literal['DIFF', 'SINGLE_STEER', 'DUAL_STEER', 'QUAD_STEER', 'MECANUM']
    wheels: List[WheelConfig]
    sensors: List[SensorConfig]
    ioPorts: List[IOConfig]
