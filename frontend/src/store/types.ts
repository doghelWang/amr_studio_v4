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
    LASER_2D: ['SICK_TIM561', 'SICK_NANO_SCAN3', 'HOKUYO_UTM30LX', 'RSLIDAR_M1', 'LEISHEN_N10'],
    LASER_3D: ['VELODYNE_VLP16', 'OUSTER_OS1', 'RSLIDAR_RS16', 'LIVOX_MID360'],
    BARCODE: ['SICK_CLV6XX', 'ZEBRA_DS9908', 'DATALOGIC_MATRIX'],
    CAMERA_BINOCULAR: ['ZED2i', 'INTEL_D435i', 'ORBBEC_ASTRA'],
    IMU: ['XSENS_MTI', 'HIPNUC_HI226', 'WHEELTEC_N100'],
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

export interface RobotIdentity {
    robotName: string;
    version: string;
    chassisLength: number;
    chassisWidth: number;
    navigationMethod: NavigationMethod;
    driveType: DriveType;
}

export interface McuConfig {
    model: string;
    canBuses: string[];
    ethPorts: string[];
}

export const MCU_MODELS = [
    'RK3588_CTRL_BOARD',
    'X86_IPC_CTRL',
    'JETSON_ORIN_CTRL',
    'CUSTOM_MCU',
];

export interface IoBoardConfig {
    id: string;
    label: string;
    model: string;
    canBus: string;
    canNodeId: number;
    channelCount: number;
}

export const IO_BOARD_MODELS: Record<string, number> = {
    'STANDARD_IO_16CH': 16,
    'COMPACT_IO_8CH': 8,
    'SAFETY_IO_16CH': 16,
};

export interface WheelConfig {
    id: string;
    label: string;
    // Structural
    mountX: number;
    mountY: number;
    mountYaw: number;
    orientation: WheelOrientation;
    
    // Idle state parameters
    headOffsetIdle: number;
    tailOffsetIdle: number;
    leftOffsetIdle: number;
    rightOffsetIdle: number;
    maxVelocityIdle: number;
    maxAccIdle: number;
    maxDecIdle: number;

    // Full Load state parameters (added to align with V4 .model spec)
    headOffsetFull: number;
    tailOffsetFull: number;
    leftOffsetFull: number;
    rightOffsetFull: number;
    maxVelocityFull: number;
    maxAccFull: number;
    maxDecFull: number;

    // Electrical
    driverModel: string;
    canBus: string;
    canNodeId: number;
    motorPolarity: MotorPolarity;
    
    // Kinematic
    zeroPos: number;
    leftLimit: number;
    rightLimit: number;
}

export const DRIVER_MODELS = [
    'ELMO_GOLD', 'CANOPEN_SERVO', 'MAXON_EPOS4',
    'INOVANCE_IS620N', 'TECHSERVO_TS100', 'CUSTOM_DRIVER',
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
export const defaultMcu = (): McuConfig => ({
    model: 'RK3588_CTRL_BOARD',
    canBuses: ['CAN0', 'CAN1', 'CAN2'],
    ethPorts: ['ETH0', 'ETH1'],
});

export const defaultIdentity = (): RobotIdentity => ({
    robotName: 'Custom AMR',
    version: '1.0',
    chassisLength: 1200,
    chassisWidth: 800,
    navigationMethod: 'LIDAR_SLAM',
    driveType: 'DIFFERENTIAL',
});

export const defaultRobotConfig = (): RobotConfig => ({
    identity: defaultIdentity(),
    mcu: defaultMcu(),
    ioBoards: [],
    wheels: [],
    sensors: [],
    ioPorts: [],
});
