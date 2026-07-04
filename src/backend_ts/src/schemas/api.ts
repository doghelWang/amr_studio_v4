export interface WheelComponent {
  role: string;
  driverModel: string;
  canBus: string;
  canNodeId: number;
  motorPolarity: string;
  // Power & Motor attributes (Phase 8)
  ratedVoltage?: number;
  ratedCurrent?: number;
  ratedSpeed?: number;
  gearRatio?: number;
  encoderType?: string;
  encoderResolution?: number;
}

export interface WheelConfig {
  id: string;
  name?: string;
  alias?: string;
  label?: string;
  type: string;
  // Kinematic (Phase 8)
  diameter: number;
  track: number;
  
  mountX: number;
  mountY: number;
  mountZ: number;
  mountYaw: number;
  orientation: string;
  components: WheelComponent[];
  zeroPos: number;
  leftLimit: number;
  rightLimit: number;
  headOffsetIdle: number;
  tailOffsetIdle: number;
  leftOffsetIdle: number;
  rightOffsetIdle: number;
  maxVelocityIdle: number;
  maxAccIdle: number;
  maxDecIdle: number;
  headOffsetFull: number;
  tailOffsetFull: number;
  leftOffsetFull: number;
  rightOffsetFull: number;
  maxVelocityFull: number;
  maxAccFull: number;
  maxDecFull: number;
  [key: string]: any;
}

export interface SensorConfig {
  id: string;
  name?: string;
  alias?: string;
  label?: string;
  type: string;
  model: string;
  usageNavi: boolean;
  usageObs: boolean;
  
  // Pose
  mountX: number;
  mountY: number;
  mountZ: number;
  mountYaw: number;
  mountPitch: number;
  mountRoll: number;
  
  // Connection
  connType?: string;
  ipAddress?: string;
  port?: number;
  ethPort?: string;
  baudRate?: number;
  serialPort?: string;
  
  // Private Attributes
  privateAttrs?: Record<string, any>;
  [key: string]: any;
}

export interface IOBoardConfig {
  id: string;
  name?: string;
  alias?: string;
  label?: string;
  model: string;
  canBus: string;
  canNodeId: number;
  // Resources (Phase 12)
  canBuses?: string[];
  diPorts?: string[];
  doPorts?: string[];
  aiPorts?: string[];
  [key: string]: any;
}

export interface IoConfig {
  id: string;
  port: string;
  logicBind: string;
  originModel?: string;
  ioBoardId?: string;
  [key: string]: any;
}

export interface McuConfig {
  name: string;
  alias: string;
  description: string;
  version: string;
  subsystem: string;
  mainType: string;
  subType: string;
  vendor: string;
  model: string;
  
  // Pose
  mountX: number;
  mountY: number;
  mountZ: number;
  roll: number;
  pitch: number;
  yaw: number;
  
  // Shape
  shape: string;
  length: number;
  width: number;
  height: number;
  
  // Lists
  canBuses: string[];
  ethPorts: string[];
  rs232Ports: string[];
  rs485Ports: string[];
  speakerPorts: string[];
  
  // Flags
  hasGyro: boolean;
  hasTopCamera: boolean;
  hasDownCamera: boolean;
  [key: string]: any;
}

export interface ChassisConfig {
  name: string;
  alias: string;
  description: string;
  version: string;
  subsystem: string;
  mainType: string;
  subType: string;
  vendor: string;
  model: string;
  shape: string; // 'BOX' | 'CYLINDER'
  length: number;
  width: number;
  height: number;
  
  // Performance
  maxSpeedIdle: number;
  maxAccIdle: number;
  maxDecIdle: number;
  maxSpeedFull: number;
  maxAccFull: number;
  maxDecFull: number;
  
  maxAngSpeedIdle: number;
  maxAngAccIdle: number;
  maxAngDecIdle: number;
  maxAngSpeedFull: number;
  maxAngAccFull: number;
  maxAngDecFull: number;

  // Motion Center
  headOffsetIdle: number;
  tailOffsetIdle: number;
  leftOffsetIdle: number;
  rightOffsetIdle: number;
  headOffsetFull: number;
  tailOffsetFull: number;
  leftOffsetFull: number;
  rightOffsetFull: number;
  [key: string]: any;
}

export interface GeneratePayload {
  projectId?: string;
  robotName: string;
  version: string;
  driveType: string;
  navigationMethod?: string;
  chassis: ChassisConfig;
  mcu?: McuConfig;
  wheels: WheelConfig[];
  sensors: SensorConfig[];
  ioBoards: IOBoardConfig[];
  ioPorts: IoConfig[];
  actuators?: Record<string, any>[];
  auxiliary?: Record<string, any>[];
  others?: Record<string, any>[];
  [key: string]: any;
}
