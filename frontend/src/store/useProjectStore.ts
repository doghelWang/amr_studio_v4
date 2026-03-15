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
import { defaultRobotConfig } from './types';
import { runValidation } from '../services/validationEngine';
import type { ValidationResult } from './types';

// ━━━ Default wheel factory ━━━
function makeDefaultWheels(driveType: DriveType): WheelConfig[] {
    const base = (_id: string, label: string, type: WheelConfig['type'], orientation: WheelConfig['orientation'], x: number, y: number): WheelConfig => ({
        id: uuid(), label, type, mountX: x, mountY: y, mountZ: 0, mountYaw: 0, orientation,
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
        case 'DIFFERENTIAL': return [base('fl', 'Left Wheel', 'STANDARD_DIFF', 'FRONT_LEFT', 0, 350), base('fr', 'Right Wheel', 'STANDARD_DIFF', 'FRONT_RIGHT', 0, -350)];
        default: return [base('sc', 'Main Steer', 'VERTICAL_STEER', 'CENTER', 400, 0)];
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
                    const config = { ...s.config, mcu: { ...s.config.mcu, ...data } };
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
                        const newSensor = { id, ...sensor } as SensorConfig;
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
                    const newBoard: IoBoardConfig = { id: uuid(), label: `IO-${board.model}`, ...board, canBuses: [], diPorts: [], doPorts: [], aiPorts: [] };
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
