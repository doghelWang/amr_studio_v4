// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AMR Studio Pro V4 — Complete Type Definitions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type DriveType =
    | 'DIFFERENTIAL'
    | 'SINGLE_STEER'
    | 'DUAL_STEER'
    | 'QUAD_STEER'
    | 'MECANUM_4'
    | 'OMNI_3';

export const DRIVE_TYPE_LABELS: Record<DriveType, string> = {
    DIFFERENTIAL: '差速双驱 Differential',
    SINGLE_STEER: '单舵轮 Single Steer',
    DUAL_STEER: '双舵轮 Dual Steer',
    QUAD_STEER: '四舵轮 Quad Steer',
    MECANUM_4: '麦克纳姆四轮 Mecanum',
    OMNI_3: '三轮全向 Omni-3',
};

export type WheelOrientation =
    | 'FRONT_LEFT' | 'FRONT_RIGHT'
    | 'REAR_LEFT' | 'REAR_RIGHT'
    | 'FRONT_CENTER' | 'REAR_CENTER' | 'CENTER';

export type MotorPolarity = 'FORWARD' | 'REVERSE';

export type SensorType =
    | 'LASER_2D' | 'LASER_3D'
    | 'BARCODE' | 'CAMERA_BINOCULAR' | 'IMU';

export const SENSOR_MODELS: Record<SensorType, string[]> = {
    LASER_2D: [
        'SICK_TIM561-2050101', 'HOKUYO_UST-20LX', 'MR-LS-01F-S1533-BLACK', 
        'VANJEE_WLR-716', 'PEPPERL_OMD30M-R2000', 'PACECAT_LDS-50C-C30E',
        'TIM510-9950000S01', 'UAM-05LP-T301'
    ],
    LASER_3D: ['LIVOX_MID-360', 'RS-LS-RS-HELIOS16P', 'VELODYNE_VLP16'],
    BARCODE: ['HIKROBOT_MV_SC2000AM', 'HIKROBOT_MV_ID3016PM'],
    CAMERA_BINOCULAR: ['HIKROBOT_MV_EB435I', 'REALSENS_STEREO', 'BERXELP_100R'],
    IMU: ['HIKROBOT_MV_89013_V13', 'SPI_ON_BOARD'],
};

export type ConnectionType = 'ETHERNET' | 'USB' | 'RS232' | 'SPI' | 'CAN';

export type NavigationMethod =
    | 'LIDAR_SLAM' | 'REFLECTOR' | 'NATURAL_CONTOUR'
    | 'VISUAL_SLAM' | 'BARCODE_GRID' | 'HYBRID';

export const NAV_METHOD_LABELS: Record<NavigationMethod, string> = {
    LIDAR_SLAM: '激光SLAM',
    REFLECTOR: '激光反射板',
    NATURAL_CONTOUR: '自然轮廓',
    VISUAL_SLAM: '视觉SLAM',
    BARCODE_GRID: '二维码格导航',
    HYBRID: '混合导航',
};

// ━━━ Core Data Entities ━━━

export interface ProjectMeta {
    projectId: string;
    projectName: string;
    createdAt: string;
    modifiedAt: string;
    author: string;
    templateOrigin: string;
    formatVersion: '1.0';
}

 // ─── Chassis & Identity ───────────────────────────────────────────

export interface ChassisConfig {
    name: string;
    alias: string;
    description: string;
    version: string;
    subsystem: string;      // 子系统 (e.g., ChassisSys)
    mainType: string;       // 主类型 (e.g., chassis)
    subType: string;        // 子类型 (e.g., diffChassis, steerChassis)
    vendor: string;         // 供应商
    model: string;          // 设备型号
    shape: 'BOX' | 'CYLINDER';
    length: number;
    width: number;
    height: number;
    
    // Performance (Chassis Attr)
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

    // Motion Center (Private Attr)
    headOffsetIdle: number;
    tailOffsetIdle: number;
    leftOffsetIdle: number;
    rightOffsetIdle: number;
    headOffsetFull: number;
    tailOffsetFull: number;
    leftOffsetFull: number;
    rightOffsetFull: number;
}

export interface RobotIdentity {
    robotName: string;
    version: string;
    driveType: DriveType;
    navigationMethod: NavigationMethod;
    chassis: ChassisConfig; // Nested Chassis config
}

export interface McuConfig {
    // Basic Info
    name: string;
    alias: string;
    description: string;
    version: string;
    subsystem: string;
    mainType: string;
    subType: string;
    vendor: string;
    model: string;
    
    // Physical Pose (6D)
    mountX: number;
    mountY: number;
    mountZ: number;
    roll: number;
    pitch: number;
    yaw: number;
    
    // Shape & Dimensions
    shape: 'BOX' | 'CYLINDER';
    length: number;
    width: number;
    height: number;

    // Orientation Helpers
    surfaceOrientation: 'UP' | 'DOWN' | 'FRONT' | 'BACK' | 'LEFT' | 'RIGHT';
    cableDirection: 'FRONT' | 'BACK' | 'LEFT' | 'RIGHT';
    installType: 'HORIZONTAL' | 'VERTICAL';

    // Resources
    canBuses: string[];
    ethPorts: string[];
    rs232Ports: string[];
    rs485Ports: string[];
    speakerPorts: string[];

    // Onboard Device Flags (Derived or explicit)
    hasGyro: boolean;
    hasTopCamera: boolean;
    hasDownCamera: boolean;
}

export const MCU_MODELS = [
    'RA-MC-R318AT',
    'RA-MC-R318AD',
    'RA-MC-R318BN',
    'RA-MC-R349AD-21BH0',
];

export interface IoBoardConfig {
    id: string;
    label: string;
    model: string;
    canBus: string;       // 接入的主控 CAN 总线
    canNodeId: number;    // ID
    
    // Resources (Phase 12)
    canBuses: string[];   // 本地 CAN 总线
    diPorts: string[];
    doPorts: string[];
    aiPorts: string[];
}

export const IO_BOARD_MODELS: Record<string, number> = {
    'RA-IC/I-F-1R6BH0': 40,
    'RA-EI/I-A-14400AH0': 8,
    'RA-EI/I-A-18A00BH5': 18,
    'RA-EI/I-B-500A5AH1': 15,
    'RA-IC/I-A-1A3BH0': 15,
    'RA-IC/I-A-1C0AH1': 21,
    'RA-IC/I-A-1C0BH0': 21,
    'RA-IC/I-A-1E3BH0': 23,
    'RA-IC/I-C-140AH1': 14, // 4 DI + 7 DO + PZTB/BAR? Summing IO only for now
    'RA-IC/I-C-140BH0': 14,
    'RA-IC/I-D-120BH0': 11, // 2 DI + 5 DO + 3 AI + 1 CAN
    'RA-EI/F-C-1H2AH0': 8,
    'RA-EI/F-C-1S1AH0': 1,
};

export type WheelRole = 'DRIVE_DRIVER' | 'STEER_DRIVER' | 'STEER_ENCODER';

export interface WheelComponent {
    role: WheelRole;
    driverModel: string;
    canBus: string;
    canNodeId: number;
    motorPolarity: MotorPolarity;
    
    // Power & Motor attributes (Phase 8)
    ratedVoltage?: number;      // V
    ratedCurrent?: number;      // A
    ratedSpeed?: number;        // RPM
    gearRatio?: number;         // x:1
    encoderType?: 'NONE' | 'INCREMENTAL' | 'ABSOLUTE';
    encoderResolution?: number; // Lines or Bits
}

export interface WheelConfig {
    id: string;
    label: string;
    type: 'VERTICAL_STEER' | 'HORIZONTAL_STEER' | 'DIFF_STEER' | 'STANDARD_DIFF';
    
    // Kinematic (Phase 8)
    diameter: number;           // mm
    track: number;              // mm (wheel spacing)
    
    // Structural
    mountX: number;
    mountY: number;
    mountZ: number;
    mountYaw: number;
    orientation: WheelOrientation;
    
    // Components (e.g., Drive motor vs Steer motor)
    components: WheelComponent[];
    
    // Idle state parameters
    headOffsetIdle: number;
    tailOffsetIdle: number;
    leftOffsetIdle: number;
    rightOffsetIdle: number;
    maxVelocityIdle: number;
    maxAccIdle: number;
    maxDecIdle: number;

    // Full Load state parameters
    headOffsetFull: number;
    tailOffsetFull: number;
    leftOffsetFull: number;
    rightOffsetFull: number;
    maxVelocityFull: number;
    maxAccFull: number;
    maxDecFull: number;

    // Kinematic
    zeroPos: number;
    leftLimit: number;
    rightLimit: number;
}

export const DRIVER_MODELS = [
    'RA-DR/D-48/25DB-311BH3',
    'RA-DR/D-48/80S2B-411BH3',
    'KINCO_SERVO',
    'ZAPI_AC2',
    'ELMO_GOLD',
    'CURTIS_1234',
    'SIHENG_SERVO',
    'HIK_ENCODER_H8',
];

export interface SensorConfig {
    id: string;
    label: string;
    type: SensorType;
    model: string;
    // Pose 6D
    mountX: number;
    mountY: number;
    mountZ: number;
    mountYaw: number;
    mountPitch: number;
    mountRoll: number;
    // Usage
    usageNavi: boolean;
    usageObs: boolean;
    // Electrical
    connType: ConnectionType;
    ipAddress: string;
    port: number;
    ethPort: string;
    baudRate: number;
    serialPort: string;
}

export type LogicBind =
    | 'SAFETY_IO_EMC_STOP' | 'BUMPER_FRONT' | 'BUMPER_REAR'
    | 'MANUAL_OVERRIDE' | 'LED_STATUS_RED' | 'LED_STATUS_GREEN'
    | 'BUZZER' | 'CHARGE_DETECT' | 'DOOR_SENSOR';

export interface IOConfig {
    id: string;
    port: string;
    logicBind: LogicBind;
    ioBoardId: string;
}

export interface RobotConfig {
    identity: RobotIdentity;
    mcu: McuConfig;
    ioBoards: IoBoardConfig[];
    wheels: WheelConfig[];
    sensors: SensorConfig[];
    ioPorts: IOConfig[];
    actuators?: any[];
    auxiliary?: any[];
    others?: any[];
}

export interface ProjectSnapshot {
    snapshotId: string;
    label: string;
    createdAt: string;
    config: RobotConfig;
}

export interface AmrProject {
    formatVersion: '1.0';
    meta: ProjectMeta;
    config: RobotConfig;
    snapshots: ProjectSnapshot[];
}

// ━━━ Validation Types ━━━

export type ValidationSeverity = 'ERROR' | 'WARNING';

export interface ValidationIssue {
    code: string;
    severity: ValidationSeverity;
    message: string;
    panelKey: string;
    nodeId: string;
    fieldPath: string;
}

export interface ValidationResult {
    errors: ValidationIssue[];
    warnings: ValidationIssue[];
    isCompilable: boolean;
}

// ━━━ Utility Types ━━━

export type PanelKey =
    | 'identity' | 'control' | 'drive' | 'sensor' | 'io' | 'blueprint' | 'wiring';

// Default factory functions
export const defaultChassis = (len = 1200, wid = 800): ChassisConfig => ({
    name: 'diffChassis-Common',
    alias: 'Default Chassis',
    description: 'Universal Differential Chassis',
    version: 'V1.0',
    subsystem: 'ChassisSys',
    mainType: 'chassis',
    subType: 'diffChassis',
    vendor: 'HIKROBOT',
    model: 'HIK-CH-D-V1',
    shape: 'BOX',
    length: len,
    width: wid,
    height: 400,
    
    maxSpeedIdle: 1500, maxAccIdle: 800, maxDecIdle: 800,
    maxSpeedFull: 1200, maxAccFull: 500, maxDecFull: 500,
    maxAngSpeedIdle: 180, maxAngAccIdle: 90, maxAngDecIdle: 90,
    maxAngSpeedFull: 120, maxAngAccFull: 60, maxAngDecFull: 60,

    headOffsetIdle: len / 2, tailOffsetIdle: len / 2,
    leftOffsetIdle: wid / 2, rightOffsetIdle: wid / 2,
    headOffsetFull: len / 2, tailOffsetFull: len / 2,
    leftOffsetFull: wid / 2, rightOffsetFull: wid / 2,
});

export const defaultMcu = (): McuConfig => ({
    name: 'MainController',
    alias: '主控制器',
    description: '核心控制单元',
    version: 'V1.0',
    subsystem: 'ChassisSys',
    mainType: 'mcu',
    subType: 'hostBoard',
    vendor: 'HIKROBOT',
    model: 'RA-MC-R318AT',
    
    mountX: 508, mountY: -181, mountZ: 100,
    roll: 0, pitch: 0, yaw: 90,
    
    shape: 'BOX',
    length: 120, width: 100, height: 40,
    
    surfaceOrientation: 'UP',
    cableDirection: 'RIGHT',
    installType: 'HORIZONTAL',
    
    canBuses: ['CAN_1', 'CAN_2', 'CAN_3'],
    ethPorts: ['ETH0', 'ETH1', 'ETH2', 'ETH3'],
    rs232Ports: ['UART0', 'UART1'],
    rs485Ports: ['RS485_1', 'RS485_2'],
    speakerPorts: ['SPK0'],
    
    hasGyro: true,
    hasTopCamera: true,
    hasDownCamera: false,
});

export const defaultIdentity = (): RobotIdentity => ({
    robotName: 'Custom_AMR',
    version: '1.0',
    navigationMethod: 'LIDAR_SLAM',
    driveType: 'DIFFERENTIAL',
    chassis: defaultChassis(),
});

export const defaultRobotConfig = (): RobotConfig => ({
    identity: defaultIdentity(),
    mcu: defaultMcu(),
    ioBoards: [],
    wheels: [],
    sensors: [],
    ioPorts: [],
    actuators: [],
    auxiliary: [],
    others: [],
});
