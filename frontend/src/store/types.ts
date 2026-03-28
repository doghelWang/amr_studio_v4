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

    // Raw generalAttr preserved for lossless round-trip
    generalAttr?: any;
    // Raw structParam segments (e.g. segmented_limits_params)
    rawStructParam?: any;

    // Proto flags
    disabled?: boolean;     // maps to bool_disable
    deprecated?: boolean;   // maps to bool_deprecated
}

// ━━━ Drive & Navigation ━━━
export type DriveType = 'STANDARD_DIFF' | 'DUAL_STEER' | 'QUAD_STEER' | 'OMNI_WHEEL' | 'SINGLE_STEER';
export const DRIVE_TYPE_LABELS: Record<DriveType, string> = {
    STANDARD_DIFF: '标准差速 Differential',
    SINGLE_STEER: '单舵轮 Single Steer',
    DUAL_STEER: '双舵轮 Dual Steer',
    QUAD_STEER: '四舵轮 Quad Steer',
    OMNI_WHEEL: '全向轮 Omni',
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

// ━━━ Attribute Templates for Initialization ━━━
export const CATEGORY_ATTRIBUTE_TEMPLATES: Record<string, SmartAttribute[]> = {
    CHASSIS: [
        // 运动中心参数 (Motion Center)
        { key: 'headOffset(Idle)', desc: '距离车头距离（空载）', type: 'DATA_DOUBLE', value: 738, unit: 'mm', boolMustfill: true, boolBasic: true, boolNoeditable: true, group: '运动中心参数' },
        { key: 'tailOffset(Idle)', desc: '距离车尾距离（空载）', type: 'DATA_DOUBLE', value: 738, unit: 'mm', boolMustfill: true, boolBasic: true, boolNoeditable: true, group: '运动中心参数' },
        { key: 'leftOffset(Idle)', desc: '距离左侧距离（空载）', type: 'DATA_DOUBLE', value: 531.5, unit: 'mm', boolMustfill: true, boolBasic: true, boolNoeditable: true, group: '运动中心参数' },
        { key: 'rightOffset(Idle)', desc: '距离右侧距离（空载）', type: 'DATA_DOUBLE', value: 531.5, unit: 'mm', boolMustfill: true, boolBasic: true, boolNoeditable: true, group: '运动中心参数' },
        { key: 'headOffset (Full Load)', desc: '距离车头距离（满载）', type: 'DATA_DOUBLE', value: 738, unit: 'mm', boolMustfill: true, boolBasic: true, boolNoeditable: true, group: '运动中心参数' },
        { key: 'tailOffset (Full Load)', desc: '距离车尾距离（满载）', type: 'DATA_DOUBLE', value: 738, unit: 'mm', boolMustfill: true, boolBasic: true, boolNoeditable: true, group: '运动中心参数' },
        { key: 'leftOffset (Full Load)', desc: '距离左侧距离（满载）', type: 'DATA_DOUBLE', value: 531.5, unit: 'mm', boolMustfill: true, boolBasic: true, boolNoeditable: true, group: '运动中心参数' },
        { key: 'rightOffset (Full Load)', desc: '距离右侧距离（满载）', type: 'DATA_DOUBLE', value: 531.5, unit: 'mm', boolMustfill: true, boolBasic: true, boolNoeditable: true, group: '运动中心参数' },

        // 底盘参数 (Standard)
        { key: 'wheelsNum', desc: '轮组个数', type: 'DATA_INT32', value: 1, unit: '个', boolMustfill: true, boolBasic: true, boolNoeditable: true, group: '底盘参数' },
        { key: 'maxSpeed(Idle)', desc: '最大速度（空载）', type: 'DATA_DOUBLE', value: 800, unit: 'mm/s', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'maxAcceleration(Idle)', desc: '最大线加速度（空载）', type: 'DATA_DOUBLE', value: 500, unit: 'mm/s2', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'maxDeceleration(Idle)', desc: '最大线减速度（空载）', type: 'DATA_DOUBLE', value: 400, unit: 'mm/s2', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'maxSpeed (Full Load)', desc: '最大速度（满载）', type: 'DATA_DOUBLE', value: 600, unit: 'mm/s', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'maxAcceleration (Full Load)', desc: '最大线加速度（满载）', type: 'DATA_DOUBLE', value: 200, unit: 'mm/s2', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'maxDeceleration (Full Load)', desc: '最大线减速度（满载）', type: 'DATA_DOUBLE', value: 200, unit: 'mm/s2', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'avoidMaxDec (Idle)', desc: '避障最大减速度（空载）', type: 'DATA_DOUBLE', value: 200, unit: 'mm/s2', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'avoidMaxDec (Full Load)', desc: '避障最大减速度（满载）', type: 'DATA_DOUBLE', value: 200, unit: 'mm/s2', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        
        { key: 'rotateMaxAngSpeed (Idle)', desc: '最大角速度（空载）', type: 'DATA_DOUBLE', value: 100, unit: '°/s', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'rotateMaxAngAcceleration (Idle)', desc: '最大角加速度（空载）', type: 'DATA_DOUBLE', value: 200, unit: '°/s2', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'rotateMaxAngDeceleration (Idle)', desc: '最大角减速度（空载）', type: 'DATA_DOUBLE', value: 100, unit: '°/s2', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'rotateMaxAngSpeed (Full Load)', desc: '最大角速度（满载）', type: 'DATA_DOUBLE', value: 200, unit: '°/s', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'rotateMaxAngAcceleration (Full Load)', desc: '最大角加速度（满载）', type: 'DATA_DOUBLE', value: 100, unit: '°/s2', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'rotateMaxAngDeceleration (Full Load)', desc: '最大角减速度（满载）', type: 'DATA_DOUBLE', value: 100, unit: '°/s2', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'avoidRotMaxAngDec (Idle)', desc: '避障最大旋转减速度（空载）', type: 'DATA_DOUBLE', value: 200, unit: '°/s2', boolMustfill: true, boolBasic: false, group: '底盘参数' },
        { key: 'avoidRotMaxAngDec (Full Load)', desc: '避障最大旋转减速度（满载）', type: 'DATA_DOUBLE', value: 200, unit: '°/s2', boolMustfill: true, boolBasic: false, group: '底盘参数' },

        { key: 'rotateDiameter', desc: '旋转直径', type: 'DATA_DOUBLE', value: 1063, unit: 'mm', boolMustfill: true, boolBasic: false, boolNoeditable: true, group: '底盘参数' },
        { key: 'totalLoadWeight', desc: '额定负载', type: 'DATA_DOUBLE', value: 0, unit: 'kg', boolMustfill: true, boolBasic: false, boolHide: true, group: '底盘参数' },
        { key: 'selfWeight', desc: '自重', type: 'DATA_DOUBLE', value: 0, unit: 'kg', boolMustfill: false, boolBasic: false, boolHide: true, group: '底盘参数' },

        // 轮组属性 (Wheel Topology)
        { key: 'wheelSpace', desc: '轮间距', type: 'DATA_DOUBLE', value: 900, unit: 'mm', boolMustfill: true, boolBasic: false, group: '轮组属性' },
        { key: 'locCoordNX', desc: '轴中心X坐标', type: 'DATA_DOUBLE', value: 0, unit: 'mm', boolHide: true, group: '轮组属性' },
        { key: 'locCoordNY', desc: '轴中心Y坐标', type: 'DATA_DOUBLE', value: 0, unit: 'mm', boolHide: true, group: '轮组属性' },
        { key: 'locCoordNZ', desc: '轴中心Z坐标', type: 'DATA_DOUBLE', value: 0, unit: 'mm', boolHide: true, group: '轮组属性' },
    ],
    DRIVEWHEEL: [
        { key: 'wheelRadius', desc: '轮有效半径', type: 'DATA_DOUBLE', value: 130, unit: 'mm', boolMustfill: true, boolBasic: true, group: '基本属性' },
        { key: 'wheelType', desc: '轮组类型', type: 'DATA_INT32', value: 1, boolMustfill: true, boolBasic: true, group: '基本属性' },
        { key: 'relateMotor', desc: '行走电机', type: 'DATA_FIXED_E', value: null, boolMustfill: false, boolBasic: false, group: '关联电机' },
    ],
    DRIVER: [
        { key: 'chipPlatform', desc: '芯片平台', type: 'DATA_STRING', value: 'R131', boolMustfill: true, boolBasic: true, boolHide: true, group: '控制板属性' },
        { key: 'softwareSpec', desc: '软件规格', type: 'DATA_STRING', value: 'NONE', boolMustfill: true, boolBasic: true, group: '控制板属性' },
        { key: 'busType', desc: '总线类型', type: 'DATA_COMBOX', value: 'CAN_BUS', boolMustfill: true, boolBasic: false, group: '控制板属性' },
        { key: 'overloadCapacity', desc: '过载能力', type: 'DATA_DOUBLE', value: 2.0, unit: '倍', boolMustfill: true, boolBasic: false, boolHide: true, group: '控制板属性' },
        { key: 'overloadTime', desc: '过载时长', type: 'DATA_DOUBLE', value: 3.0, unit: 'S', boolMustfill: true, boolBasic: false, boolHide: true, group: '控制板属性' },
        { key: 'ENCType', desc: '编码器类型', type: 'DATA_COMBOX', value: null, boolMustfill: true, boolBasic: true, group: '编码器属性' },
        { key: 'initMode', desc: '电机初始状态', type: 'DATA_COMBOX', value: null, boolMustfill: false, boolBasic: false, boolHide: true, group: '电机属性' },
    ],
    MOTOR: [
        { key: 'RPM', desc: '电机额定转速', type: 'DATA_INT32', value: 3000, unit: 'RPM', boolMustfill: true, boolBasic: true, group: '电机属性' },
        { key: 'gearRatio', desc: '减速比', type: 'DATA_DOUBLE', value: 25, boolMustfill: true, boolBasic: true, group: '电机属性' },
        { key: 'ratedCurr', desc: '额定电流', type: 'DATA_DOUBLE', value: 10, unit: 'A', boolBasic: false, group: '电机属性' },
        { key: 'bReverse', desc: '是否反向', type: 'DATA_BOOL', value: false, boolBasic: false, group: '电机属性' },
        { key: 'torque', desc: '额定扭矩', type: 'DATA_DOUBLE', value: 5, unit: 'N*m', boolBasic: false, group: '电机属性' },
        { key: 'bTemper', desc: '是否支持温度获取', type: 'DATA_BOOL', value: true, boolBasic: false, group: '电机属性' },
        { key: 'bHbrake', desc: '是否带抱闸', type: 'DATA_BOOL', value: true, boolBasic: false, group: '电机属性' },
    ],
    SENSOR: [
        { key: 'minRange', desc: '最小测距', type: 'DATA_DOUBLE', value: 0.05, unit: 'm', boolBasic: true },
        { key: 'maxRange', desc: '最大测距', type: 'DATA_DOUBLE', value: 30, unit: 'm', boolBasic: true },
        { key: 'fov', desc: '扫描角度', type: 'DATA_DOUBLE', value: 270, unit: 'deg', boolBasic: true },
        { key: 'needCalib', desc: '是否需要标定', type: 'DATA_BOOL', value: true, boolMustfill: true, boolHide: true },
    ],
    LASER: [
        { key: 'minRange', desc: '最小测距', type: 'DATA_DOUBLE', value: 0.05, unit: 'm' },
        { key: 'maxRange', desc: '最大测距', type: 'DATA_DOUBLE', value: 30, unit: 'm' },
        { key: 'fov', desc: '扫描角度', type: 'DATA_DOUBLE', value: 270, unit: 'deg' },
    ],
};
