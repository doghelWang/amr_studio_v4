/**
 * Zero-Omission Data Model for AMR Studio V4.
 * Precisely aligned with controller_model_comp_desc.proto
 */
export type AttributeDataType = 'DATA_BYTES' | 'DATA_STRING' | 'DATA_IP' | 'DATA_BOOL' | 'DATA_INT32' | 'DATA_UINT32' | 'DATA_INT64' | 'DATA_UINT64' | 'DATA_FLOAT' | 'DATA_DOUBLE' | 'DATA_COMBOX' | 'DATA_FIXED_E';
export interface SmartAttribute {
    key: string;
    desc: string;
    type: AttributeDataType;
    value: any;
    maxValue?: number;
    minValue?: number;
    unit?: string;
    boolParse?: boolean;
    boolHide?: boolean;
    boolNoeditable?: boolean;
    boolMustfill?: boolean;
    boolBasic?: boolean;
    fixedSource?: string[];
    comboType?: {
        typeKey: string;
        typeDesc?: string;
        typeGroups?: Array<{
            key: string;
            desc: string;
            arrayCmobEle?: SmartAttribute[];
        }>;
    };
    arrayCmobEle?: SmartAttribute[];
    group?: string;
}
export interface AttributeGroup {
    key: string;
    desc: string;
    elements: SmartAttribute[];
    boolDeprecated?: boolean;
}
export interface InterfaceConfig {
    key: string;
    type: string;
    path?: string;
    desc?: string;
    label?: string;
    interfaceUuid: string;
    linkedInterfaceUuid?: string[];
    linkAttrs?: Array<{
        key: string;
        desc: string;
    }>;
    interfaceAttrs?: any;
    interfaceParams?: any;
}
export type MainModuleType = 'CHASSIS' | 'DRIVEWHEEL' | 'DRIVER' | 'ACTOR' | 'SENSOR' | 'SENSORPROCESSOR' | 'CONTROL' | 'MAINCPU' | 'INTERGRATEDCONTROLLER' | 'DRIVE' | 'BATTERY' | 'ENERGYCONTROLLER' | 'COMMUNICATION' | 'EXTENDEDLNTERFACE' | 'VISUAL' | 'NETWORK' | 'AUDIO' | 'BUTTON' | 'SCREEN' | 'LIGHT' | 'AUTOBODY' | 'MOTOR' | 'IO_BOARD';
export interface ComponentConfig {
    id: string;
    name: string;
    alias: string;
    type: string;
    category: MainModuleType;
    mainModuleTypeKey?: string;
    subModuleTypeKey?: string;
    parentNodeUuid: string | null;
    moduleGroupName?: string;
    moduleGroupUuid?: string;
    srcName?: string;
    mountX: number;
    mountY: number;
    mountZ: number;
    mountRoll: number;
    mountPitch: number;
    mountYaw: number;
    privateAttrs: AttributeGroup[];
    interfaceAbility?: any;
    interfaces: InterfaceConfig[];
    shape?: {
        type: 'SPHERE' | 'BOX' | 'CYLINDER';
        length?: number;
        width?: number;
        height?: number;
        diameter?: number;
    };
    frontendGroupKey?: string;
    functionalRole?: string;
    generalAttr?: any;
    rawStructParam?: any;
    disabled?: boolean;
    deprecated?: boolean;
}
export type DriveType = 'STANDARD_DIFF' | 'DUAL_STEER' | 'QUAD_STEER' | 'SINGLE_STEER';
export declare const DRIVE_TYPE_LABELS: Record<DriveType, string>;
export type NavigationMethod = 'LASER_SLAM' | 'REFLECTOR' | 'QR_CODE' | 'VISUAL_SLAM' | 'HYBRID';
export declare const NAV_METHOD_LABELS: Record<NavigationMethod, string>;
export interface RobotIdentity {
    robotName: string;
    version: string;
    materialCode: string;
    alias: string;
    venderName: string;
    selfWeight?: number;
    totalLoadWeight?: number;
    navigationMethod: NavigationMethod;
    driveType: DriveType;
    chassisShape: 'BOX' | 'CYLINDER';
    chassisLength: number;
    chassisWidth: number;
    chassisHeight: number;
    headOffset: number;
    tailOffset: number;
    leftOffset: number;
    rightOffset: number;
    headOffsetFull?: number;
    tailOffsetFull?: number;
    leftOffsetFull?: number;
    rightOffsetFull?: number;
    maxSpeed?: number;
    maxAccel?: number;
    maxDecel?: number;
    maxRotSpeed?: number;
    maxRotAccel?: number;
    maxSpeedFull?: number;
    maxAccelFull?: number;
    maxDecelFull?: number;
    maxRotSpeedFull?: number;
    maxRotAccelFull?: number;
    avoidMaxDec?: number;
    avoidMaxDecFull?: number;
    rotateMaxAngSpeed?: number;
    rotateMaxAngSpeedFull?: number;
    rotateMaxAngAcceleration?: number;
    rotateMaxAngAccelerationFull?: number;
}
export interface AbilityAttribute extends SmartAttribute {
    tips?: string;
    maxCount?: number;
    copyEnable?: boolean;
}
export interface AbilityArrayAttr {
    groupKey: string;
    groupName: string;
    boolMustfill?: boolean;
    attrParams: AbilityAttribute[];
}
export interface AbilityCommonAttr {
    key: string;
    type: 'COMBOX' | 'ARRAY';
    comboxParam?: {
        key: string;
        desc: string;
        tips?: string;
        comboxSource: 'NORMAL' | 'CUSTOM';
        options?: Array<{
            key: string;
            desc: string;
            arrayAttr?: AbilityArrayAttr[];
        }>;
        value?: string;
    };
    arrayParam?: AbilityArrayAttr;
    cloneEnable?: boolean;
}
export interface ChildAbility {
    type: string;
    desc: string;
    tips?: string;
    key: string;
    attr: AbilityCommonAttr[];
    cloneEnable?: boolean;
}
export interface FunctionAbility {
    type: string;
    desc: string;
    tips?: string;
    childFunction: ChildAbility[];
}
export interface ControllerAbility {
    version: string;
    functionAbility: FunctionAbility[];
    componentAbility?: any[];
}
export interface RobotConfig {
    identity: RobotIdentity;
    components: ComponentConfig[];
    abilities: ControllerAbility;
    functions?: any;
}
export interface ProjectMeta {
    projectId: string;
    projectName: string;
    createdAt: string;
    modifiedAt: string;
    author: string;
    templateOrigin: string;
    formatVersion: '1.0';
}
export interface ValidationIssue {
    severity: 'ERROR' | 'WARNING';
    message: string;
    nodeId?: string;
}
export type ElectricalConnectionKind = 'communication_bus' | 'io_signal' | 'power' | 'onboard' | 'audio_video' | 'unknown';
export interface ElectricalConnection {
    id: string;
    kind: ElectricalConnectionKind;
    interfaceType: string;
    sourceComponentId: string;
    sourceComponentName: string;
    sourceInterfaceUuid: string;
    sourceInterfaceKey: string;
    targetComponentId: string;
    targetComponentName: string;
    targetInterfaceUuid: string;
    targetInterfaceKey: string;
    direction: 'source_to_target' | 'target_to_source' | 'bidirectional' | 'unknown';
    diagnostics: string[];
}
export declare const getInterfaceKind: (type: string) => ElectricalConnectionKind;
export declare const buildConnections: (components: ComponentConfig[]) => ElectricalConnection[];
//# sourceMappingURL=types.d.ts.map