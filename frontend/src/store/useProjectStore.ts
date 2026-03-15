// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Project Store with Zundo Undo/Redo Middleware
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { create } from 'zustand';
import { temporal } from 'zundo';
import { v4 as uuid } from 'uuid';
import type {
    RobotConfig, RobotIdentity, McuConfig, IoBoardConfig,
    WheelConfig, SensorConfig, IOConfig, DriveType,
    ProjectSnapshot, AmrProject, ProjectMeta, ChassisConfig
} from './types';
import {
    defaultRobotConfig,
} from './types';
import { runValidation } from '../services/validationEngine';
import type { ValidationResult } from './types';

// ━━━ Default wheel factory ━━━
function makeDefaultWheels(driveType: DriveType): WheelConfig[] {
    const base = (
        id: string, 
        label: string, 
        type: WheelConfig['type'], 
        orientation: WheelConfig['orientation'], 
        x: number, y: number, z: number = 0, yaw: number = 0
    ): WheelConfig => {
        let components: WheelConfig['components'] = [];
        const baseBus = 'CAN0';
        const startIdMap: Record<string, number> = { 'fl': 10, 'fr': 20, 'rl': 30, 'rr': 40, 'sc': 10 };
        const baseId = startIdMap[id] || 10;

        if (type === 'VERTICAL_STEER' || type === 'HORIZONTAL_STEER') {
            components = [
                { 
                    role: 'DRIVE_DRIVER', driverModel: 'RA-DR/D-48/80S2B-411BH3', canBus: baseBus, canNodeId: baseId, motorPolarity: 'FORWARD',
                    ratedVoltage: 48, ratedCurrent: 80, ratedSpeed: 3000, gearRatio: 25, encoderType: 'ABSOLUTE', encoderResolution: 17
                },
                { 
                    role: 'STEER_DRIVER', driverModel: 'RA-DR/D-48/25DB-311BH3', canBus: baseBus, canNodeId: baseId + 1, motorPolarity: 'FORWARD',
                    ratedVoltage: 48, ratedCurrent: 25, ratedSpeed: 3000, gearRatio: 30, encoderType: 'ABSOLUTE', encoderResolution: 17
                },
            ];
        } else if (type === 'DIFF_STEER') {
            components = [
                { 
                    role: 'DRIVE_DRIVER',  driverModel: 'RA-DR/D-48/25DB-311BH3', canBus: baseBus, canNodeId: baseId, motorPolarity: 'FORWARD',
                    ratedVoltage: 48, ratedCurrent: 25, ratedSpeed: 3000, gearRatio: 20, encoderType: 'ABSOLUTE', encoderResolution: 17
                },
                { 
                    role: 'DRIVE_DRIVER', driverModel: 'RA-DR/D-48/25DB-311BH3', canBus: baseBus, canNodeId: baseId + 1, motorPolarity: 'FORWARD',
                    ratedVoltage: 48, ratedCurrent: 25, ratedSpeed: 3000, gearRatio: 20, encoderType: 'ABSOLUTE', encoderResolution: 17
                },
                { 
                    role: 'STEER_ENCODER', driverModel: 'HIK_ENCODER_H8', canBus: baseBus, canNodeId: baseId + 2, motorPolarity: 'FORWARD',
                    encoderType: 'ABSOLUTE', encoderResolution: 17
                },
            ];
        } else {
            components = [
                { 
                    role: 'DRIVE_DRIVER', driverModel: 'RA-DR/D-48/25DB-311BH3', canBus: baseBus, canNodeId: baseId, motorPolarity: 'FORWARD',
                    ratedVoltage: 48, ratedCurrent: 25, ratedSpeed: 3000, gearRatio: 15, encoderType: 'ABSOLUTE', encoderResolution: 17
                },
            ];
        }

        return {
            id: uuid(), label, type, mountX: x, mountY: y, mountZ: z, mountYaw: yaw, orientation,
            diameter: 200, track: 650,
            components,
            headOffsetIdle: 30, tailOffsetIdle: 30, leftOffsetIdle: 30, rightOffsetIdle: 30,
            maxVelocityIdle: 1500, maxAccIdle: 800, maxDecIdle: 800,
            headOffsetFull: 40, tailOffsetFull: 40, leftOffsetFull: 40, rightOffsetFull: 40,
            maxVelocityFull: 1200, maxAccFull: 500, maxDecFull: 500,
            zeroPos: 0, leftLimit: -180, rightLimit: 180,
        };
    };

    switch (driveType) {
        case 'DIFFERENTIAL':
            return [
                base('fl', 'Left Wheel', 'STANDARD_DIFF', 'FRONT_LEFT', 0, 350),
                base('fr', 'Right Wheel', 'STANDARD_DIFF', 'FRONT_RIGHT', 0, -350),
            ];
        case 'SINGLE_STEER':
            return [
                base('sc', 'Steer Wheel', 'VERTICAL_STEER', 'CENTER', 300, 0),
                base('rl', 'Left Castor', 'STANDARD_DIFF', 'REAR_LEFT', -600, 300),
                base('rr', 'Right Castor', 'STANDARD_DIFF', 'REAR_RIGHT', -600, -300),
            ];
        case 'DUAL_STEER':
            return [
                base('fl', 'Front Steer', 'VERTICAL_STEER', 'FRONT_CENTER', 400, 0),
                base('fr', 'Rear Steer', 'VERTICAL_STEER', 'REAR_CENTER', -400, 0),
            ];
        case 'QUAD_STEER':
            return [
                base('fl', 'Front Left', 'VERTICAL_STEER', 'FRONT_LEFT', 450, 350),
                base('fr', 'Front Right', 'VERTICAL_STEER', 'FRONT_RIGHT', 450, -350),
                base('rl', 'Rear Left', 'VERTICAL_STEER', 'REAR_LEFT', -450, 350),
                base('rr', 'Rear Right', 'VERTICAL_STEER', 'REAR_RIGHT', -450, -350),
            ];
        case 'MECANUM_4':
            return [
                base('fl', 'FL Mecanum', 'STANDARD_DIFF', 'FRONT_LEFT', 300, 300),
                base('fr', 'FR Mecanum', 'STANDARD_DIFF', 'FRONT_RIGHT', 300, -300),
                base('rl', 'RL Mecanum', 'STANDARD_DIFF', 'REAR_LEFT', -300, 300),
                base('rr', 'RR Mecanum', 'STANDARD_DIFF', 'REAR_RIGHT', -300, -300),
            ];
        case 'OMNI_3':
            return [
                base('fl', 'Omni Front', 'STANDARD_DIFF', 'FRONT_CENTER', 400, 0, 0, 0),
                base('fr', 'Omni Left', 'STANDARD_DIFF', 'REAR_LEFT', -200, 350, 0, 120),
                base('rl', 'Omni Right', 'STANDARD_DIFF', 'REAR_RIGHT', -200, -350, 0, 240),
            ];
    }
}

// ━━━ Store interface ━━━
export interface ProjectState {
    // Project
    meta: ProjectMeta;
    config: RobotConfig;
    snapshots: ProjectSnapshot[];
    isDirty: boolean;          // unsaved changes flag
    validation: ValidationResult;

    // Identity & Chassis actions
    setIdentity: (data: Partial<RobotIdentity>) => void;
    updateChassis: (data: Partial<ChassisConfig>) => void;
    setDriveTypeImmediate: (type: DriveType) => void; // after confirmation

    // MCU
    setMcu: (data: Partial<McuConfig>) => void;

    // IO Boards
    addIoBoard: (board: Pick<IoBoardConfig, 'model' | 'canBus' | 'canNodeId'>) => void;
    removeIoBoard: (id: string) => void;

    // Wheels
    updateWheel: (id: string, data: Partial<WheelConfig>) => void;

    // Sensors
    addSensor: (sensor: Omit<SensorConfig, 'id' | 'label'>) => void;
    removeSensor: (id: string) => void;
    updateSensor: (id: string, data: Partial<SensorConfig>) => void;

    // IO Ports
    addIO: (io: Omit<IOConfig, 'id'>) => void;
    removeIO: (id: string) => void;

    // Project
    createSnapshot: (label: string) => void;
    loadProject: (project: AmrProject) => void;
    resetProject: () => void;
}

function validate(config: RobotConfig): ValidationResult {
    return runValidation(config);
}

const INITIAL_CONFIG = defaultRobotConfig();
INITIAL_CONFIG.wheels = makeDefaultWheels('DIFFERENTIAL');

const INITIAL_META: ProjectMeta = {
    projectId: uuid(),
    projectName: '未命名项目',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    author: '',
    templateOrigin: 'blank',
    formatVersion: '1.0',
};

export const useProjectStore = create<ProjectState>()(
    temporal(
        (set) => ({
            meta: INITIAL_META,
            config: INITIAL_CONFIG,
            snapshots: [],
            isDirty: false,
            validation: validate(INITIAL_CONFIG),

            setIdentity: (data) => set((s) => {
                const identity = { ...s.config.identity, ...data };
                const config = { ...s.config, identity };
                return { config, isDirty: true, validation: validate(config) };
            }),

            updateChassis: (data) => set((s) => {
                let chassis = { ...s.config.identity.chassis, ...data };
                
                // Auto-calculate motion center if length/width changes
                if (data.length || data.width) {
                    const l = chassis.length;
                    const w = chassis.width;
                    chassis = {
                        ...chassis,
                        headOffsetIdle: l / 2, tailOffsetIdle: l / 2,
                        leftOffsetIdle: w / 2, rightOffsetIdle: w / 2,
                        headOffsetFull: l / 2, tailOffsetFull: l / 2,
                        leftOffsetFull: w / 2, rightOffsetFull: w / 2,
                    };
                }

                const identity = { ...s.config.identity, chassis };
                const config = { ...s.config, identity };
                return { config, isDirty: true, validation: validate(config) };
            }),

            setDriveTypeImmediate: (type) => set((s) => {
                const identity = { ...s.config.identity, driveType: type };
                const wheels = makeDefaultWheels(type);
                const config = { ...s.config, identity, wheels };
                return { config, isDirty: true, validation: validate(config) };
            }),

            setMcu: (data) => set((s) => {
                const newMcu = { ...s.config.mcu, ...data };
                
                // Auto-detect onboard modules and resources based on model specifications
                if (data.model) {
                    // Common resources (User confirmed Ethernet*4, Speaker*1)
                    newMcu.ethPorts = ['ETH0', 'ETH1', 'ETH2', 'ETH3'];
                    newMcu.speakerPorts = ['SPK0'];

                    // Model specific logic
                    if (data.model.startsWith('RA-MC-R318')) {
                        newMcu.hasGyro = true;
                        newMcu.hasTopCamera = data.model.includes('AT');
                        newMcu.hasDownCamera = data.model.includes('AD');
                        newMcu.canBuses = ['CAN_1', 'CAN_2', 'CAN_3']; // Corrected based on R318AT.json
                        newMcu.rs232Ports = ['UART0', 'UART1'];
                        newMcu.rs485Ports = ['RS485_1', 'RS485_2'];
                    } else if (data.model.startsWith('RA-MC-R349')) {
                        newMcu.hasGyro = true;
                        newMcu.hasTopCamera = false;
                        newMcu.hasDownCamera = data.model.includes('AD');
                        newMcu.canBuses = ['CAN_1', 'CAN_2', 'CAN_3']; // Assumption consistent with R318
                        newMcu.rs232Ports = ['UART0'];
                        newMcu.rs485Ports = ['RS485_1', 'RS485_2', 'RS485_3'];
                        // Note: R349 also has RS422, but we'll map common serial ports for now
                    }
                }

                // Install type logic
                if (data.installType === 'HORIZONTAL') {
                    newMcu.roll = 0;
                    newMcu.pitch = 0;
                } else if (data.installType === 'VERTICAL') {
                    newMcu.roll = 90;
                    newMcu.pitch = 0;
                }

                const config = { ...s.config, mcu: newMcu };
                return { config, isDirty: true, validation: runValidation(config) };
            }),

            addIoBoard: (board: Pick<IoBoardConfig, 'model' | 'canBus' | 'canNodeId'>) => set((s) => {
                const existing = s.config.ioBoards.length;
                
                // IO Board Resource Library (Extracted from JSON specs)
                const library: Record<string, Partial<IoBoardConfig>> = {
                    'RA-IC/I-F-1R6BH0': {
                        canBuses: ['CAN_1'],
                        diPorts: Array.from({ length: 26 }, (_, i) => `DI_${i + 1}`),
                        doPorts: Array.from({ length: 6 }, (_, i) => `DO_${i + 1}`),
                        aiPorts: Array.from({ length: 7 }, (_, i) => `AI_${i + 1}`),
                    },
                    'RA-EI/I-A-14400AH0': {
                        canBuses: ['CAN_1'],
                        diPorts: ['DI_1', 'DI_2', 'DI_3', 'DI_4'],
                        doPorts: ['DO_1', 'DO_2', 'DO_3', 'DO_4'],
                        aiPorts: [],
                    },
                    'RA-EI/I-A-18A00BH5': {
                        canBuses: ['CAN_1'],
                        diPorts: Array.from({ length: 8 }, (_, i) => `DI_${i + 1}`),
                        doPorts: Array.from({ length: 10 }, (_, i) => `DO_${i + 1}`),
                        aiPorts: [],
                    },
                    'RA-EI/I-B-500A5AH1': {
                        canBuses: ['CAN_1'],
                        diPorts: [],
                        doPorts: [],
                        aiPorts: Array.from({ length: 10 }, (_, i) => `AI_${i + 1}`),
                    },
                    'RA-IC/I-A-1A3BH0': {
                        canBuses: ['CAN_1'],
                        diPorts: Array.from({ length: 10 }, (_, i) => `DI_${i + 1}`),
                        doPorts: Array.from({ length: 5 }, (_, i) => `DO_${i + 1}`),
                        aiPorts: [],
                    },
                    'RA-IC/I-A-1C0AH1': {
                        canBuses: ['CAN_1'],
                        diPorts: Array.from({ length: 12 }, (_, i) => `DI_${i + 1}`),
                        doPorts: Array.from({ length: 9 }, (_, i) => `DO_${i + 1}`),
                        aiPorts: [],
                    },
                    'RA-IC/I-A-1C0BH0': {
                        canBuses: ['CAN_1'],
                        diPorts: Array.from({ length: 12 }, (_, i) => `DI_${i + 1}`),
                        doPorts: Array.from({ length: 9 }, (_, i) => `DO_${i + 1}`),
                        aiPorts: [],
                    },
                    'RA-IC/I-A-1E3BH0': {
                        canBuses: ['CAN_1', 'CAN_2'],
                        diPorts: Array.from({ length: 12 }, (_, i) => `DI_${i + 1}`),
                        doPorts: Array.from({ length: 9 }, (_, i) => `DO_${i + 1}`),
                        aiPorts: [],
                    },
                    'RA-IC/I-C-140AH1': {
                        canBuses: ['CAN_1'],
                        diPorts: Array.from({ length: 4 }, (_, i) => `DI_${i + 1}`),
                        doPorts: Array.from({ length: 7 }, (_, i) => `DO_${i + 1}`),
                        aiPorts: [],
                    },
                    'RA-IC/I-C-140BH0': {
                        canBuses: ['CAN_1'],
                        diPorts: Array.from({ length: 4 }, (_, i) => `DI_${i + 1}`),
                        doPorts: Array.from({ length: 7 }, (_, i) => `DO_${i + 1}`),
                        aiPorts: [],
                    },
                    'RA-IC/I-D-120BH0': {
                        canBuses: ['CAN_1'],
                        diPorts: ['DI_1', 'DI_2'],
                        doPorts: Array.from({ length: 5 }, (_, i) => `DO_${i + 1}`),
                        aiPorts: Array.from({ length: 3 }, (_, i) => `AI_${i + 1}`),
                    },
                    'RA-EI/F-C-1H2AH0': {
                        canBuses: ['CAN_1'],
                        diPorts: ['DI_1', 'DI_2', 'DI_3'],
                        doPorts: Array.from({ length: 5 }, (_, i) => `DO_${i + 1}`),
                        aiPorts: [],
                    },
                    'RA-EI/F-C-1S1AH0': {
                        canBuses: ['CAN_1'],
                        diPorts: [],
                        doPorts: [],
                        aiPorts: [],
                    }
                };

                const resources = library[board.model] || {
                    canBuses: ['CAN_1'],
                    diPorts: [],
                    doPorts: [],
                    aiPorts: []
                };

                const newBoard: IoBoardConfig = {
                    id: uuid(),
                    label: `IO-${board.model.split('/')[1] || board.model}-${existing + 1}`,
                    ...board,
                    ...resources as any,
                };
                const config = { ...s.config, ioBoards: [...s.config.ioBoards, newBoard] };
                return { config, isDirty: true, validation: validate(config) };
            }),

            removeIoBoard: (id) => set((s) => {
                const config = { ...s.config, ioBoards: s.config.ioBoards.filter(b => b.id !== id) };
                return { config, isDirty: true, validation: validate(config) };
            }),

            updateWheel: (id, data) => set((s) => {
                const wheels = s.config.wheels.map(w => w.id === id ? { ...w, ...data } : w);
                const config = { ...s.config, wheels };
                return { config, isDirty: true, validation: validate(config) };
            }),

            addSensor: (sensor) => set((s) => {
                const typeCount = s.config.sensors.filter(x => x.type === sensor.type).length;
                const newSensor: SensorConfig = {
                    id: uuid(),
                    label: `${sensor.type} #${typeCount + 1}`,
                    ...sensor,
                };
                const config = { ...s.config, sensors: [...s.config.sensors, newSensor] };
                return { config, isDirty: true, validation: validate(config) };
            }),

            removeSensor: (id) => set((s) => {
                const config = { ...s.config, sensors: s.config.sensors.filter(x => x.id !== id) };
                return { config, isDirty: true, validation: validate(config) };
            }),

            updateSensor: (id, data) => set((s) => {
                const sensors = s.config.sensors.map(x => x.id === id ? { ...x, ...data } : x);
                const config = { ...s.config, sensors };
                return { config, isDirty: true, validation: validate(config) };
            }),

            addIO: (io) => set((s) => {
                const newIO: IOConfig = { id: uuid(), ...io };
                const config = { ...s.config, ioPorts: [...s.config.ioPorts, newIO] };
                return { config, isDirty: true, validation: validate(config) };
            }),

            removeIO: (id) => set((s) => {
                const config = { ...s.config, ioPorts: s.config.ioPorts.filter(x => x.id !== id) };
                return { config, isDirty: true, validation: validate(config) };
            }),

            createSnapshot: (label) => set((s) => {
                const snapshot: ProjectSnapshot = {
                    snapshotId: uuid(), label,
                    createdAt: new Date().toISOString(),
                    config: JSON.parse(JSON.stringify(s.config)),
                };
                return { snapshots: [...s.snapshots, snapshot] };
            }),

            loadProject: (project) => set(() => {
                const config = project.config;
                return {
                    meta: project.meta,
                    config,
                    snapshots: project.snapshots ?? [],
                    isDirty: false,
                    validation: validate(config),
                };
            }),

            resetProject: () => {
                const fresh = defaultRobotConfig();
                fresh.wheels = makeDefaultWheels('DIFFERENTIAL');
                set({
                    meta: { ...INITIAL_META, projectId: uuid(), createdAt: new Date().toISOString(), modifiedAt: new Date().toISOString() },
                    config: fresh,
                    snapshots: [],
                    isDirty: false,
                    validation: validate(fresh),
                });
                useProjectStore.temporal.getState().clear();
            },
        }),
        {
            limit: 50,
            // Only track config changes in undo history (not meta/dirty/validation)
            partialize: (state) => ({ config: state.config }),
        }
    )
);

// Export undo/redo helpers
export function useUndoRedo() {
    const temporalStore = useProjectStore.temporal.getState();
    return {
        undo: temporalStore.undo,
        redo: temporalStore.redo,
        canUndo: temporalStore.pastStates.length > 0,
        canRedo: temporalStore.futureStates.length > 0,
        pastCount: temporalStore.pastStates.length,
        clear: temporalStore.clear,
    };
}
