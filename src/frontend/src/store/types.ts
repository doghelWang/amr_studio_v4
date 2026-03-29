/**
 * Zero-Omission Data Model for AMR Studio V4.
 * Precisely aligned with controller_model_comp_desc.proto
 */

// ━━━ Matches MESSAGE_BASE_DATA_TYPE enum in proto ━━━
export type AttributeDataType =
    | 'DATA_BYTES'    // 0
    | 'DATA_STRING'   // 1
    | 'DATA_IP'       // 3
    | 'DATA_BOOL'     // 4
    | 'DATA_INT32'    // 5
    | 'DATA_UINT32'   // 6
    | 'DATA_INT64'    // 7
    | 'DATA_UINT64'   // 8
    | 'DATA_FLOAT'    // 9
    | 'DATA_DOUBLE'   // 10
    | 'DATA_COMBOX'   // 11
    | 'DATA_FIXED_E'; // 12

// ━━━ Matches Message_Base_Element ━━━
export interface SmartAttribute {
    key: string;
    desc: string;
    type: AttributeDataType;
    // Simplified typed value for frontend binding (maps to oneof_value)
    value: any;
    // Constraints (maps to oneof_maxValue / oneof_minValue)
    maxValue?: number;
    minValue?: number;
    unit?: string;
    // UI rendering flags from proto
    boolParse?: boolean;       // 是否需要解析
    boolHide?: boolean;        // 是否隐藏 (UI: skip rendering)
    boolNoeditable?: boolean;  // 是否不可编辑 (UI: read-only)
    boolMustfill?: boolean;    // 是否必填
    boolBasic?: boolean;       // 是否为基础信息
    // For DATA_FIXED_E
    fixedSource?: string[];
    // For DATA_COMBOX
    comboType?: {
        typeKey: string;
        typeDesc?: string;
        typeGroups?: Array<{ key: string; desc: string; arrayCmobEle?: SmartAttribute[] }>;
    };
    // Nested sub-attributes within a combo item
    arrayCmobEle?: SmartAttribute[];
    group?: string; // Added for categorization in UI
}

// ━━━ Matches Message_Base_Group_Element ━━━
export interface AttributeGroup {
    key: string;
    desc: string;
    elements: SmartAttribute[];  // maps to array_base_ele
    boolDeprecated?: boolean;
}

// ━━━ Matches Message_Interface_Param_Group ━━━
export interface InterfaceConfig {
    key: string;               // e.g. "CAN0", "ETH0"
    type: string;              // e.g. "CAN", "ETHERNET", "RS485", "NETWORK"
    path?: string;             // 指向接口的模块路径
    desc?: string;
    label?: string;            // [FIX] Added for UI display / ETH Injection
    interfaceUuid: string;     // Unique ID for this interface instance
    linkedInterfaceUuid?: string[]; // Connected peer UUIDs
    linkAttrs?: Array<{ key: string; desc: string }>;  // maps to link_attrs
    interfaceAttrs?: any;      // maps to interface_attrs (template)
    interfaceParams?: any;     // maps to interface_params (runtime)
}

// ━━━ Component Category ━━━
export type MainModuleType =
    | 'CHASSIS'               // chassis (底盘)
    | 'DRIVEWHEEL'            // driveWheel (驱动轮)
    | 'DRIVER'                // driver (驱动器)
    | 'ACTOR'                 // actor (执行器)
    | 'SENSOR'                // sensor (传感器)
    | 'SENSORPROCESSOR'       // sensorprocessor (传感器处理器)
    | 'CONTROL'               // control
    | 'MAINCPU'               // mainCPU (主控)
    | 'INTERGRATEDCONTROLLER' // intergratedcontroller (集成控制器)
    | 'DRIVE'                 // drive (驱动)
    | 'BATTERY'               // battery (电池)
    | 'ENERGYCONTROLLER'      // energycontroller (能量控制器)
    | 'COMMUNICATION'         // communication (通信)
    | 'EXTENDEDLNTERFACE'     // extendedlnterface (扩展接口)
    | 'VISUAL'                // visual (视觉)
    | 'NETWORK'               // network (网络)
    | 'AUDIO'                 // audio (音频)
    | 'BUTTON'                // button (按钮)
    | 'SCREEN'                // screen (屏幕)
    | 'LIGHT'                 // light (灯光)
    | 'AUTOBODY'              // autobody (车身)
    | 'MOTOR'                 // motor (电机)
    | 'IO_BOARD';             // io board


// ━━━ Matches Message_Module_Componets ━━━
export interface ComponentConfig {
    id: string;            // maps to generalAttr.module_uuid
    name: string;          // maps to generalAttr.module_name
    alias: string;
    type: string;          // Sub-type key (e.g. "diffChassis")
    category: MainModuleType;
    mainModuleTypeKey?: string; // e.g. "driveWheel", "sensor"
    subModuleTypeKey?: string;  // e.g. "diffSteerWheel", "laser"

    // Physical Hierarchy (from Message_Module_Info)
    parentNodeUuid: string | null;
    moduleGroupName?: string;
    moduleGroupUuid?: string;

    // Mounting pose (from structParam.extendParams)
    mountX: number;
    mountY: number;
    mountZ: number;
    mountRoll: number;
    mountPitch: number;
    mountYaw: number;

    // Private attributes (grouped, maps to Message_Module_Private_Attribute)
    privateAttrs: AttributeGroup[];

    // Interface capability (maps to interfaceAbility) — preserved losslessly
    interfaceAbility?: any;
    // Interface instances (maps to interfaceParams.interfaceGroup)
    interfaces: InterfaceConfig[];

    // Module shape (from generalAttr.module_shape)
    shape?: { type: 'SPHERE' | 'BOX' | 'CYLINDER'; length?: number; width?: number; height?: number; diameter?: number };

    // ISS-005 Front-End Only topological marker for coordinate symmetry and sync boundary rules
    frontendGroupKey?: string;

    // ISS-004 Functional role tag injected at creation time for sync role discrimination
    // Values: 'walk' | 'steer' | 'walk_left' | 'walk_right' | undefined
    functionalRole?: string;

    // Raw generalAttr preserved for lossless round-trip
    generalAttr?: any;
    // Raw structParam segments (e.g. segmented_limits_params)
    rawStructParam?: any;

    // Proto flags
    disabled?: boolean;     // maps to bool_disable
    deprecated?: boolean;   // maps to bool_deprecated
}

// ━━━ Drive & Navigation ━━━
export type DriveType = 'STANDARD_DIFF' | 'DUAL_STEER' | 'QUAD_STEER' | 'SINGLE_STEER';
export const DRIVE_TYPE_LABELS: Record<DriveType, string> = {
    STANDARD_DIFF: '标准差速 Differential',
    SINGLE_STEER: '单舵轮 Single Steer',
    DUAL_STEER: '双舵轮 Dual Steer',
    QUAD_STEER: '四舵轮 Quad Steer',
};

export type NavigationMethod = 'LASER_SLAM' | 'REFLECTOR' | 'QR_CODE' | 'VISUAL_SLAM' | 'HYBRID';
export const NAV_METHOD_LABELS: Record<NavigationMethod, string> = {
    LASER_SLAM: '激光 SLAM',
    REFLECTOR: '激光反射板',
    QR_CODE: '二维码',
    VISUAL_SLAM: '视觉 SLAM',
    HYBRID: '混合导航',
};

// ━━━ Robot Identity ━━━
export interface RobotIdentity {
    robotName: string;
    version: string;
    materialCode: string;
    alias: string;
    venderName: string;
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
    // Full-load motion center offsets (P3: optional, defaults to idle values when syncFullLoad=true)
    headOffsetFull?: number;
    tailOffsetFull?: number;
    leftOffsetFull?: number;
    rightOffsetFull?: number;

    // Performance (Added 0325)
    maxSpeed?: number;
    maxAccel?: number;
    maxDecel?: number;
    maxRotSpeed?: number;
    maxRotAccel?: number;
    
    // Full Load variants
    maxSpeedFull?: number;
    maxAccelFull?: number;
    maxDecelFull?: number;
    
    // Avoidance
    avoidMaxDec?: number;
    avoidMaxDecFull?: number;
    rotateMaxAngSpeed?: number;
    rotateMaxAngAcceleration?: number;
}

// ━━━ Ability Models (Matches controller_model_abi_set.proto) ━━━
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
        // Simplified for UI
        options?: Array<{ key: string; desc: string; arrayAttr?: AbilityArrayAttr[] }>;
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
    componentAbility?: any[]; // To preserve radar/motor entity lists
}

// ━━━ Top-Level Robot Config ━━━
export interface RobotConfig {
    identity: RobotIdentity;
    components: ComponentConfig[];
    abilities: ControllerAbility;
}

// ━━━ Project & Validation ━━━
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

// Removed legacy hardcoded CATEGORY_ATTRIBUTE_TEMPLATES to enforce strict CModel Schema inheritance.
