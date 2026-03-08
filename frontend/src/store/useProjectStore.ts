// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Project Store with Zundo Undo/Redo Middleware
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { create } from 'zustand';
import { temporal } from 'zundo';
import { v4 as uuid } from 'uuid';
import type {
    RobotConfig, RobotIdentity, McuConfig, IoBoardConfig,
    WheelConfig, SensorConfig, IOConfig, DriveType,
    ProjectSnapshot, AmrProject, ProjectMeta
} from './types';
import {
    defaultRobotConfig,
} from './types';
import { runValidation } from '../services/validationEngine';
import type { ValidationResult } from './types';

// ━━━ Default wheel factory ━━━
function makeDefaultWheels(driveType: DriveType): WheelConfig[] {
    const base = (id: string, label: string, orientation: WheelConfig['orientation'], x: number, y: number): WheelConfig => ({
        id: uuid(), label, mountX: x, mountY: y, mountYaw: 0, orientation,
        headOffsetIdle: 100, tailOffsetIdle: 100, leftOffsetIdle: 100, rightOffsetIdle: 100,
        maxVelocityIdle: 1500, maxAccIdle: 800, maxDecIdle: 800,
        headOffsetFull: 100, tailOffsetFull: 100, leftOffsetFull: 100, rightOffsetFull: 100,
        maxVelocityFull: 1200, maxAccFull: 500, maxDecFull: 500,
        driverModel: 'ELMO_GOLD', canBus: 'CAN0', canNodeId: id === 'fl' ? 1 : id === 'fr' ? 2 : id === 'rl' ? 3 : 4,
        motorPolarity: 'FORWARD',
        zeroPos: 0, leftLimit: -90, rightLimit: 90,
    });

    switch (driveType) {
        case 'DIFFERENTIAL':
            return [
                base('fl', 'Left Drive Motor', 'FRONT_LEFT', 0, 350),
                base('fr', 'Right Drive Motor', 'FRONT_RIGHT', 0, -350),
            ];
        case 'SINGLE_STEER':
            return [base('fl', 'Steer Drive', 'REAR_CENTER', -400, 0)];
        case 'DUAL_STEER':
            return [
                base('fl', 'Front Steer', 'FRONT_CENTER', 400, 0),
                base('fr', 'Rear Steer', 'REAR_CENTER', -400, 0),
            ];
        case 'QUAD_STEER':
            return [
                base('fl', 'Front Left', 'FRONT_LEFT', 450, 350),
                base('fr', 'Front Right', 'FRONT_RIGHT', 450, -350),
                base('rl', 'Rear Left', 'REAR_LEFT', -450, 350),
                base('rr', 'Rear Right', 'REAR_RIGHT', -450, -350),
            ];
        case 'MECANUM_4':
            return [
                base('fl', 'FL Mecanum', 'FRONT_LEFT', 300, 300),
                base('fr', 'FR Mecanum', 'FRONT_RIGHT', 300, -300),
                base('rl', 'RL Mecanum', 'REAR_LEFT', -300, 300),
                base('rr', 'RR Mecanum', 'REAR_RIGHT', -300, -300),
            ];
        case 'OMNI_3':
            return [
                base('fl', 'Omni Front', 'FRONT_CENTER', 400, 0),
                base('fr', 'Omni Left', 'REAR_LEFT', -200, 350),
                base('rl', 'Omni Right', 'REAR_RIGHT', -200, -350),
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

    // Identity actions
    setIdentity: (data: Partial<RobotIdentity>) => void;
    setDriveTypeImmediate: (type: DriveType) => void; // after confirmation

    // MCU
    setMcu: (data: Partial<McuConfig>) => void;

    // IO Boards
    addIoBoard: (board: Omit<IoBoardConfig, 'id' | 'label'>) => void;
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

            setDriveTypeImmediate: (type) => set((s) => {
                const identity = { ...s.config.identity, driveType: type };
                const wheels = makeDefaultWheels(type);
                const config = { ...s.config, identity, wheels };
                return { config, isDirty: true, validation: validate(config) };
            }),

            setMcu: (data) => set((s) => {
                const mcu = { ...s.config.mcu, ...data };
                const config = { ...s.config, mcu };
                return { config, isDirty: true, validation: validate(config) };
            }),

            addIoBoard: (board) => set((s) => {
                const existing = s.config.ioBoards.length;
                const newBoard: IoBoardConfig = {
                    id: uuid(),
                    label: `IO-${board.model.split('_')[0]}-${existing + 1}`,
                    ...board,
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
