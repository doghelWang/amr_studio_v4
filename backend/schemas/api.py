from pydantic import BaseModel
from typing import List, Literal, Optional

# Sensor types matching the frontend TypeScript definitions
SensorTypeLiteral = Literal[
    'LASER_2D', 'LASER_3D',
    'BARCODE', 'CAMERA_BINOCULAR', 'IMU', 'ULTRASONIC',
    # Legacy compatibility
    'LASER', 'CAMERA', 'GYRO'
]

# Drive types matching the frontend TypeScript definitions
DriveTypeLiteral = Literal[
    # Frontend enum values
    'DIFFERENTIAL', 'SINGLE_STEER', 'DUAL_STEER', 'QUAD_STEER', 'MECANUM_4', 'OMNI_3',
    # Backend shorthand (legacy)
    'DIFF', 'SINGLE_STEER', 'DUAL_STEER', 'QUAD_STEER', 'MECANUM', 'OMNI'
]

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
    type: str  # Flexible - accepts both frontend (LASER_2D) and legacy (LASER) values
    model: str
    usageNavi: bool
    usageObs: bool
    # Frontend field names - aligned with TypeScript SensorConfig
    mountX: float = 0.0
    mountY: float = 0.0
    mountYaw: float = 0.0
    # Legacy field names (still accepted for backward compatibility)
    offsetX: Optional[float] = None
    offsetY: Optional[float] = None
    yaw: Optional[float] = None
    
    def get_offset_x(self) -> float:
        return self.mountX if self.offsetX is None else self.offsetX
    
    def get_offset_y(self) -> float:
        return self.mountY if self.offsetY is None else self.offsetY
    
    def get_yaw(self) -> float:
        return self.mountYaw if self.yaw is None else self.yaw
    
    def get_laser_type(self) -> str:
        """Map frontend types to the LASER/CAMERA/ULTRASONIC/GYRO groups"""
        mapping = {
            'LASER_2D': 'LASER', 'LASER_3D': 'LASER',
            'CAMERA_BINOCULAR': 'CAMERA', 'BARCODE': 'CAMERA',
            'IMU': 'GYRO',
            'ULTRASONIC': 'ULTRASONIC',
        }
        return mapping.get(self.type, self.type)

class IOConfig(BaseModel):
    id: str
    port: str
    logicBind: str
    ioBoardId: Optional[str] = None  # Optional - matches frontend IOConfig

class GeneratePayload(BaseModel):
    robotName: str
    version: str
    driveType: str  # Flexible - accepts both DIFFERENTIAL and DIFF etc.
    navigationMethod: Optional[str] = None  # F4: navigation method for FuncDesc routing
    wheels: List[WheelConfig]
    sensors: List[SensorConfig]
    ioPorts: List[IOConfig]
    
    def get_canonical_drive_type(self) -> str:
        """Normalize frontend and legacy drivetypes to a single canonical form."""
        mapping = {
            'DIFFERENTIAL': 'DIFF',
            'MECANUM_4': 'MECANUM',
            'OMNI_3': 'OMNI',
        }
        return mapping.get(self.driveType, self.driveType)
