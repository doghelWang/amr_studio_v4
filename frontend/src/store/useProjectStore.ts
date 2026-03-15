// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Project Store with Persistence & Undo/Redo
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { create } from 'zustand';
import { temporal } from 'zundo';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type {
    RobotConfig, RobotIdentity, McuConfig, IoBoardConfig,
    WheelConfig, SensorConfig, IOConfig, DriveType,
    ProjectSnapshot, AmrProject, ProjectMeta, ChassisConfig
} from './types';
import { defaultRobotConfig, IO_BOARD_MODELS } from './types';
import { runValidation } from '../services/validationEngine';
import type { ValidationResult } from './types';

// ━━━ Default wheel factory ━━━
function makeDefaultWheels(driveType: DriveType): WheelConfig[] {
    const base = (_id: string, name: string, alias: string, type: WheelConfig['type'], orientation: WheelConfig['orientation'], x: number, y: number): WheelConfig => ({
        id: uuid(), name, alias, label: name, type, mountX: x, mountY: y, mountZ: 0, mountYaw: 0, orientation,
        diameter: 200, track: 650,
        components: [
            { 
                role: 'DRIVE_DRIVER', driverModel: 'RA-DR/D-48/25DB-311BH3', canBus: 'CAN_1', canNodeId: 10, motorPolarity: 'FORWARD',
                ratedVoltage: 48, gearRatio: 25, encoderType: 'INCREMENTAL', encoderResolution: 2500, hasBrake: false
            }
        ],
        headOffsetIdle: 30, tailOffsetIdle: 30, leftOffsetIdle: 30, rightOffsetIdle: 30,
        maxVelocityIdle: 1500, maxAccIdle: 800, maxDecIdle: 800,
        headOffsetFull: 40, tailOffsetFull: 40, leftOffsetFull: 40, rightOffsetFull: 40,
        maxVelocityFull: 1200, maxAccFull: 500, maxDecFull: 500,
        zeroPos: 0, leftLimit: -180, rightLimit: 180,
    });

    switch (driveType) {
        case 'DIFFERENTIAL': return [
            base('fl', 'Wheel_L', '左驱动轮', 'STANDARD_DIFF', 'FRONT_LEFT', 0, 350), 
            base('fr', 'Wheel_R', '右驱动轮', 'STANDARD_DIFF', 'FRONT_RIGHT', 0, -350)
        ];
        default: return [base('sc', 'Wheel_Steer', '舵轮', 'VERTICAL_STEER', 'CENTER', 400, 0)];
    }
}

// ━━━ Default private attributes for sensors ━━━
function getDefaultPrivateAttrs(type: SensorConfig['type']): Record<string, any> {
    switch (type) {
        case 'LASER_2D':
        case 'LASER_3D':
            return {
                scanRangeHorizonStart: 0,
                scanRangeHorizonEnd: 360,
                actualScanRangeHorizonStart: 0,
                actualScanRangeHorizonEnd: 360,
                needCalib: false,
                reflectThreshold: 0,
                frameRate: 15,
            };
        case 'BARCODE':
            return {
                focalLength: 0,
                exposure: 0,
                needCalib: false,
                resolutionW: 1280,
                resolutionH: 960,
            };
        case 'CAMERA_BINOCULAR':
            return {
                focalLength: 0,
                exposure: 0,
                needCalib: false,
                resolutionW: 1280,
                resolutionH: 720,
            };
        case 'IMU':
            return {
                yawRangeMin: -180,
                yawRangeMax: 180,
            };
        default:
            return {};
    }
}

const INITIAL_CONFIG = defaultRobotConfig();
INITIAL_CONFIG.wheels = makeDefaultWheels('DIFFERENTIAL');

const INITIAL_META: ProjectMeta = {
    projectId: uuid(),
    projectName: '未命名项目',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    author: 'Engineer',
    templateOrigin: 'blank',
    formatVersion: '1.0',
};

// ━━━ Spec-driven MCU Resource Locking ━━━
function getMcuResources(model: string): Partial<McuConfig> {
    const res: Partial<McuConfig> = {
        hasGyro: true,
        hasTopCamera: false,
        hasDownCamera: false,
        canBuses: ['CAN_1', 'CAN_2', 'CAN_3'],
        ethPorts: ['ETH0', 'ETH1', 'ETH2', 'ETH3'],
    };

    if (model.includes('R318AD')) {
        res.hasTopCamera = true;
    } else if (model.includes('R349AD')) {
        res.hasTopCamera = true;
        res.hasDownCamera = true;
        res.canBuses = ['CAN_1', 'CAN_2', 'CAN_3', 'CAN_4']; // Expanded CAN for R349
    } else if (model.includes('R318BN')) {
        res.hasGyro = false; // Example variation
    }
    return res;
}

export interface ProjectState {
    meta: ProjectMeta;
    config: RobotConfig;
    snapshots: ProjectSnapshot[];
    isDirty: boolean;
    validation: ValidationResult;

    setIdentity: (data: Partial<RobotIdentity>) => void;
    updateChassis: (data: Partial<ChassisConfig>) => void;
    setDriveTypeImmediate: (type: DriveType) => void;
    setMcu: (data: Partial<McuConfig>) => void;
    updateWheel: (id: string, data: Partial<WheelConfig>) => void;
    addSensor: (sensor: Omit<SensorConfig, 'id'>) => string;
    removeSensor: (id: string) => void;
    updateSensor: (id: string, data: Partial<SensorConfig>) => void;
    
    // Missing IO Board & IO actions
    addIoBoard: (board: Pick<IoBoardConfig, 'model' | 'canBus' | 'canNodeId'>) => void;
    removeIoBoard: (id: string) => void;
    addIO: (io: Omit<IOConfig, 'id'>) => void;
    removeIO: (id: string) => void;

    loadProject: (project: AmrProject) => void;
    resetProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        temporal(
            (set) => ({
                meta: INITIAL_META,
                config: INITIAL_CONFIG,
                snapshots: [],
                isDirty: false,
                validation: runValidation(INITIAL_CONFIG),

                setIdentity: (data) => set((s) => {
                    const config = { ...s.config, identity: { ...s.config.identity, ...data } };
                    return { config, isDirty: true, validation: runValidation(config) };
                }),

                updateChassis: (data) => set((s) => {
                    const chassis = { ...s.config.identity.chassis, ...data };
                    const config = { ...s.config, identity: { ...s.config.identity, chassis } };
                    return { config, isDirty: true, validation: runValidation(config) };
                }),

                setDriveTypeImmediate: (type) => set((s) => {
                    const config = { ...s.config, identity: { ...s.config.identity, driveType: type }, wheels: makeDefaultWheels(type) };
                    return { config, isDirty: true, validation: runValidation(config) };
                }),

                setMcu: (data) => set((s) => {
                    let mcu = { ...s.config.mcu, ...data };
                    // If model changed, update resources
                    if (data.model && data.model !== s.config.mcu.model) {
                        mcu = { ...mcu, ...getMcuResources(data.model) };
                    }
                    const config = { ...s.config, mcu };
                    return { config, isDirty: true, validation: runValidation(config) };
                }),

                updateWheel: (id, data) => set((s) => {
                    const wheels = s.config.wheels.map(w => w.id === id ? { ...w, ...data } : w);
                    const config = { ...s.config, wheels };
                    return { config, isDirty: true, validation: runValidation(config) };
                }),

                addSensor: (sensor) => {
                    const id = uuid();
                    set((s) => {
                        const typeCount = s.config.sensors.filter(x => x.type === sensor.type).length + 1;
                        const defaultName = `${sensor.type}_${typeCount}`;
                        
                        const newSensor: SensorConfig = { 
                            ...sensor,
                            id, 
                            name: sensor.name || defaultName,
                            alias: sensor.alias || '',
                            label: sensor.label || sensor.name || defaultName,
                            privateAttrs: {
                                ...getDefaultPrivateAttrs(sensor.type),
                                ...(sensor.privateAttrs || {})
                            }
                        } as SensorConfig;
                        const config = { ...s.config, sensors: [...s.config.sensors, newSensor] };
                        return { config, isDirty: true, validation: runValidation(config) };
                    });
                    return id;
                },

                removeSensor: (id) => set((s) => {
                    const config = { ...s.config, sensors: s.config.sensors.filter(x => x.id !== id) };
                    return { config, isDirty: true, validation: runValidation(config) };
                }),

                updateSensor: (id, data) => set((s) => {
                    const sensors = s.config.sensors.map(x => x.id === id ? { ...x, ...data } : x);
                    const config = { ...s.config, sensors };
                    return { config, isDirty: true, validation: runValidation(config) };
                }),

                addIoBoard: (board) => set((s) => {
                    const typeCount = s.config.ioBoards.length + 1;
                    const defaultName = `IO_${typeCount}`;
                    const newBoard: IoBoardConfig = { 
                        id: uuid(), 
                        name: defaultName,
                        alias: '',
                        label: defaultName,
                        model: board.model,
                        canBus: board.canBus,
                        canNodeId: board.canNodeId,
                        canBuses: [], diPorts: Array(IO_BOARD_MODELS[board.model] || 8).fill(''), 
                        doPorts: [], aiPorts: [] 
                    };
                    const config = { ...s.config, ioBoards: [...s.config.ioBoards, newBoard] };
                    return { config, isDirty: true, validation: runValidation(config) };
                }),

                removeIoBoard: (id) => set((s) => {
                    const config = { ...s.config, ioBoards: s.config.ioBoards.filter(b => b.id !== id) };
                    return { config, isDirty: true, validation: runValidation(config) };
                }),

                addIO: (io) => set((s) => {
                    const newIO: IOConfig = { id: uuid(), ...io };
                    const config = { ...s.config, ioPorts: [...s.config.ioPorts, newIO] };
                    return { config, isDirty: true, validation: runValidation(config) };
                }),

                removeIO: (id) => set((s) => {
                    const config = { ...s.config, ioPorts: s.config.ioPorts.filter(x => x.id !== id) };
                    return { config, isDirty: true, validation: runValidation(config) };
                }),

                loadProject: (project) => set({
                    meta: project.meta,
                    config: project.config,
                    snapshots: project.snapshots ?? [],
                    isDirty: false,
                    validation: runValidation(project.config),
                }),

                resetProject: () => set({
                    meta: { ...INITIAL_META, projectId: uuid() },
                    config: INITIAL_CONFIG,
                    snapshots: [],
                    isDirty: false,
                    validation: runValidation(INITIAL_CONFIG),
                }),
            }),
            {
                limit: 50,
                partialize: (state) => ({ config: state.config }),
            }
        ),
        {
            name: 'amr-studio-v4-storage',
            partialize: (state) => ({ meta: state.meta, config: state.config }),
        }
    )
);

export function useUndoRedo() {
    const temporalStore = useProjectStore.temporal.getState();
    return {
        undo: (steps?: number) => temporalStore.undo(steps),
        redo: (steps?: number) => temporalStore.redo(steps),
        canUndo: temporalStore.pastStates.length > 0,
        canRedo: temporalStore.futureStates.length > 0,
    };
}
