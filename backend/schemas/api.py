from pydantic import BaseModel, conlist
from typing import List, Literal, Optional, Dict, Any

class WheelComponent(BaseModel):
    role: str
    driverModel: str
    canBus: str
    canNodeId: int
    motorPolarity: str
    # Power & Motor attributes (Phase 8)
    ratedVoltage: Optional[float] = None
    ratedCurrent: Optional[float] = None
    ratedSpeed: Optional[int] = None
    gearRatio: Optional[float] = None
    encoderType: Optional[str] = None
    encoderResolution: Optional[int] = None

class WheelConfig(BaseModel):
    model_config = {"extra": "allow"}
    id: str
    label: str
    type: str = "STANDARD_DIFF"
    # Kinematic (Phase 8)
    diameter: float = 200.0
    track: float = 650.0
    
    mountX: float = 0.0
    mountY: float = 0.0
    mountZ: float = 0.0
    mountYaw: float = 0.0
    orientation: str = "CENTER"
    components: List[WheelComponent] = []
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
    canBus: str
    canNodeId: int
    # Resources (Phase 12)
    canBuses: List[str] = []
    diPorts: List[str] = []
    doPorts: List[str] = []
    aiPorts: List[str] = []

class IoConfig(BaseModel):
    model_config = {"extra": "allow"}
    id: str
    port: str
    logicBind: str
    originModel: Optional[str] = None
    ioBoardId: Optional[str] = None

class McuConfig(BaseModel):
    model_config = {"extra": "allow"}
    name: str = "MainController"
    alias: str = "主控制器"
    description: str = "核心控制单元"
    version: str = "V1.0"
    subsystem: str = "ChassisSys"
    mainType: str = "mcu"
    subType: str = "hostBoard"
    vendor: str = "HIKROBOT"
    model: str = "RA-MC-R318AT"
    
    # Pose
    mountX: float = 508.0
    mountY: float = -181.0
    mountZ: float = 100.0
    roll: float = 0.0
    pitch: float = 0.0
    yaw: float = 90.0
    
    # Shape
    shape: str = "BOX"
    length: float = 120.0
    width: float = 100.0
    height: float = 40.0
    
    # Lists
    canBuses: List[str] = ["CAN_1", "CAN_2", "CAN_3"]
    ethPorts: List[str] = ["ETH0", "ETH1", "ETH2", "ETH3"]
    rs232Ports: List[str] = ["UART0", "UART1"]
    rs485Ports: List[str] = ["RS485_1", "RS485_2"]
    speakerPorts: List[str] = ["SPK0"]
    
    # Flags
    hasGyro: bool = True
    hasTopCamera: bool = True
    hasDownCamera: bool = False

class ChassisConfig(BaseModel):
    model_config = {"extra": "allow"}
    name: str
    alias: str
    description: str
    version: str
    subsystem: str
    mainType: str
    subType: str
    vendor: str
    model: str
    shape: str # 'BOX' | 'CYLINDER'
    length: float
    width: float
    height: float
    
    # Performance
    maxSpeedIdle: float
    maxAccIdle: float
    maxDecIdle: float
    maxSpeedFull: float
    maxAccFull: float
    maxDecFull: float
    
    maxAngSpeedIdle: float
    maxAngAccIdle: float
    maxAngDecIdle: float
    maxAngSpeedFull: float
    maxAngAccFull: float
    maxAngDecFull: float

    # Motion Center
    headOffsetIdle: float
    tailOffsetIdle: float
    leftOffsetIdle: float
    rightOffsetIdle: float
    headOffsetFull: float
    tailOffsetFull: float
    leftOffsetFull: float
    rightOffsetFull: float

class GeneratePayload(BaseModel):
    model_config = {"extra": "allow"}
    projectId: Optional[str] = None
    robotName: str
    version: str
    driveType: str
    navigationMethod: Optional[str] = None
    chassis: ChassisConfig
    mcu: Optional[McuConfig] = None
    wheels: List[WheelConfig] = []
    sensors: List[SensorConfig] = []
    ioBoards: List[IOBoardConfig] = []
    ioPorts: List[IoConfig] = []
    actuators: List[Dict[str, Any]] = []
    auxiliary: List[Dict[str, Any]] = []
    others: List[Dict[str, Any]] = []
