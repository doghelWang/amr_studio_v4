import { create } from 'zustand';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Utility
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const generateId = () => Math.random().toString(36).substr(2, 9);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Control Board Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface McuConfig {
    model: string;
    canBuses: string[];   // e.g. ['CAN0', 'CAN1', 'CAN2']
    ethPorts: string[];   // e.g. ['ETH0', 'ETH1']
}

export interface IoBoardConfig {
    id: string;
    label: string;
    model: string;
    canBus: string;
    canNodeId: number;
    channelCount: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Wheel / Drive Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type DriveType = 'DIFF' | 'SINGLE_STEER' | 'DUAL_STEER' | 'QUAD_STEER' | 'MECANUM';
export type WheelOrientation = 'FRONT_LEFT' | 'FRONT_RIGHT' | 'REAR_LEFT' | 'REAR_RIGHT' | 'CENTER';

export interface WheelConfig {
    id: string;
    label: string;
    // Structural
    mountX: number;          // mm from chassis center
    mountY: number;          // mm from chassis center
    mountYaw: number;        // degrees
    orientation: WheelOrientation;
    // Electric Drive
    driverModel: string;
    canBus: string;
    canNodeId: number;
    motorPolarity: 'FORWARD' | 'REVERSE';
    // Kinematic
    headOffsetIdle: number;
    tailOffsetIdle: number;
    leftOffsetIdle: number;
    rightOffsetIdle: number;
    maxVelocity: number;
    maxAcc: number;
    maxDec: number;
    // Steer-specific
    zeroPos: number;
    leftLimit: number;
    rightLimit: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Sensor Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type SensorType = 'LASER_2D' | 'LASER_3D' | 'BARCODE' | 'CAMERA_BINOCULAR' | 'IMU';
export type SensorConnType = 'ETHERNET' | 'USB' | 'RS232' | 'SPI';

export interface SensorConfig {
    id: string;
    type: SensorType;
    model: string;
    label: string;
    // Usage
    usageNavi: boolean;
    usageObs: boolean;
    // Structural (6D mount pose)
    mountX: number;
    mountY: number;
    mountZ: number;
    mountYaw: number;
    mountPitch: number;
    mountRoll: number;
    // Electrical
    connType: SensorConnType;
    ipAddress: string;    // for ETHERNET
    port: number;         // for ETHERNET / RS232
    ethPort: string;      // which MCU eth port (ETH0 / ETH1 ...)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IO Port Mapping
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface IOConfig {
    id: string;
    port: string;
    logicBind: string;
    ioBoardId: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Default Helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const defaultWheels = (type: DriveType): WheelConfig[] => {
    const base = {
        driverModel: 'ELMO_GOLD', canBus: 'CAN0', canNodeId: 1,
        motorPolarity: 'FORWARD' as const,
        headOffsetIdle: 0, tailOffsetIdle: 0, leftOffsetIdle: 400, rightOffsetIdle: 400,
        maxVelocity: 1500, maxAcc: 1000, maxDec: 1500,
        zeroPos: 0, leftLimit: -90, rightLimit: 90, mountZ: 0, mountYaw: 0
    };
    if (type === 'DIFF') return [
        { ...base, id: generateId(), label: 'Left Drive Motor', mountX: 0, mountY: 400, mountYaw: 0, orientation: 'FRONT_LEFT', rightOffsetIdle: 0, canNodeId: 1 },
        { ...base, id: generateId(), label: 'Right Drive Motor', mountX: 0, mountY: -400, mountYaw: 0, orientation: 'FRONT_RIGHT', leftOffsetIdle: 0, canNodeId: 2 }
    ];
    if (type === 'SINGLE_STEER') return [
        { ...base, id: generateId(), label: 'Center Steer Wheel', mountX: 0, mountY: 0, orientation: 'CENTER', canNodeId: 1 }
    ];
    if (type === 'DUAL_STEER') return [
        { ...base, id: generateId(), label: 'Front Steer', mountX: 600, mountY: 0, orientation: 'FRONT_LEFT', canNodeId: 1 },
        { ...base, id: generateId(), label: 'Rear Steer', mountX: -600, mountY: 0, orientation: 'REAR_RIGHT', canNodeId: 2 }
    ];
    // QUAD_STEER / MECANUM
    return [
        { ...base, id: generateId(), label: 'Front Left', mountX: 500, mountY: 350, orientation: 'FRONT_LEFT', canNodeId: 1 },
        { ...base, id: generateId(), label: 'Front Right', mountX: 500, mountY: -350, orientation: 'FRONT_RIGHT', canNodeId: 2 },
        { ...base, id: generateId(), label: 'Rear Left', mountX: -500, mountY: 350, orientation: 'REAR_LEFT', canNodeId: 3 },
        { ...base, id: generateId(), label: 'Rear Right', mountX: -500, mountY: -350, orientation: 'REAR_RIGHT', canNodeId: 4 }
    ];
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Global App State
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface AppState {
    // Identity
    robotName: string;
    version: string;
    chassisLength: number;
    chassisWidth: number;
    setIdentity: (name: string, version: string, len: number, width: number) => void;

    // Control Boards
    mcu: McuConfig;
    setMcu: (mcu: McuConfig) => void;
    ioBoards: IoBoardConfig[];
    addIoBoard: (board: Omit<IoBoardConfig, 'id'>) => void;
    removeIoBoard: (id: string) => void;
    updateIoBoard: (id: string, data: Partial<IoBoardConfig>) => void;

    // Drive
    driveType: DriveType;
    setDriveType: (type: DriveType) => void;
    wheels: WheelConfig[];
    updateWheel: (id: string, data: Partial<WheelConfig>) => void;

    // Sensors
    sensors: SensorConfig[];
    addSensor: (sensor: Omit<SensorConfig, 'id'>) => void;
    removeSensor: (id: string) => void;
    updateSensor: (id: string, data: Partial<SensorConfig>) => void;

    // IO
    ioPorts: IOConfig[];
    addIO: (io: Omit<IOConfig, 'id'>) => void;
    removeIO: (id: string) => void;
    updateIO: (id: string, data: Partial<IOConfig>) => void;
}

export const useStore = create<AppState>((set) => ({
    robotName: 'Custom AMR',
    version: 'V1.0',
    chassisLength: 1200,
    chassisWidth: 800,
    setIdentity: (name, version, chassisLength, chassisWidth) =>
        set({ robotName: name, version, chassisLength, chassisWidth }),

    mcu: {
        model: 'RK3588_CTRL_BOARD',
        canBuses: ['CAN0', 'CAN1', 'CAN2'],
        ethPorts: ['ETH0', 'ETH1']
    },
    setMcu: (mcu) => set({ mcu }),
    ioBoards: [],
    addIoBoard: (board) => set((s) => ({ ioBoards: [...s.ioBoards, { ...board, id: generateId() }] })),
    removeIoBoard: (id) => set((s) => ({ ioBoards: s.ioBoards.filter(b => b.id !== id) })),
    updateIoBoard: (id, data) => set((s) => ({ ioBoards: s.ioBoards.map(b => b.id === id ? { ...b, ...data } : b) })),

    driveType: 'DIFF',
    setDriveType: (type) => set({ driveType: type, wheels: defaultWheels(type) }),
    wheels: defaultWheels('DIFF'),
    updateWheel: (id, data) => set((s) => ({ wheels: s.wheels.map(w => w.id === id ? { ...w, ...data } : w) })),

    sensors: [],
    addSensor: (sensor) => set((s) => ({ sensors: [...s.sensors, { ...sensor, id: generateId() }] })),
    removeSensor: (id) => set((s) => ({ sensors: s.sensors.filter(s => s.id !== id) })),
    updateSensor: (id, data) => set((s) => ({ sensors: s.sensors.map(s => s.id === id ? { ...s, ...data } : s) })),

    ioPorts: [],
    addIO: (io) => set((s) => ({ ioPorts: [...s.ioPorts, { ...io, id: generateId() }] })),
    removeIO: (id) => set((s) => ({ ioPorts: s.ioPorts.filter(io => io.id !== id) })),
    updateIO: (id, data) => set((s) => ({ ioPorts: s.ioPorts.map(io => io.id === id ? { ...io, ...data } : io) }))
}));
