/**
 * 类型定义文件 - 从 frontend/src/store/types.ts 复制关键类型
 * 这是测试运行器所需的最小类型集合
 */

export type MainModuleType =
  | 'CHASSIS' | 'DRIVEWHEEL' | 'DRIVER' | 'SENSOR'
  | 'MAINCPU' | 'IO_BOARD' | 'BATTERY' | 'BUTTON'
  | 'LIGHT' | 'ACTOR' | 'MOTOR' | 'UNKNOWN';

export type ComponentShape = {
  type: 'BOX' | 'CYLINDER' | 'SPHERE';
  length?: number;
  width?: number;
  height?: number;
  diameter?: number;
};

export interface SmartAttribute {
  key: string;
  desc: string;
  type: string;
  value?: any;
  unit?: string;
  maxValue?: number;
  minValue?: number;
  boolParse?: boolean;
  boolHide?: boolean;
  boolNoeditable?: boolean;
  boolMustfill?: boolean;
  boolBasic?: boolean;
  comboType?: {
    typeKey: string;
    typeDesc?: string;
    typeGroups?: Array<{
      key: string;
      desc: string;
      arrayCmobEle?: SmartAttribute[];
    }>;
  };
}

export interface AttributeGroup {
  key: string;
  desc: string;
  elements: SmartAttribute[];
}

export interface InterfaceConfig {
  key: string;
  type: string;
  path: string;
  desc: string;
  interfaceUuid: string;
  linkedInterfaceUuid?: string[];
  interfaceAttrs?: any;
  interfaceParams?: any;
}

export interface ComponentConfig {
  id: string;
  srcName: string;
  name: string;
  alias: string;
  type: string;
  category: MainModuleType;
  mainModuleTypeKey?: string;
  subModuleTypeKey?: string;
  mountX: number;
  mountY: number;
  mountZ: number;
  mountRoll: number;
  mountPitch: number;
  mountYaw: number;
  parentNodeUuid: string | null;
  moduleGroupName: string;
  moduleGroupUuid: string;
  privateAttrs: AttributeGroup[];
  interfaces: InterfaceConfig[];
  generalAttr?: any;
  shape?: ComponentShape;
  interfaceAbility?: any;
  rawStructParam?: any;
  disabled?: boolean;
  deprecated?: boolean;
}

export type DriveType = 'STANDARD_DIFF' | 'SINGLE_STEER' | 'DUAL_STEER' | 'QUAD_STEER';

export type ChassisShape = 'BOX' | 'CYLINDER';

export interface RobotIdentity {
  robotName: string;
  version?: string;
  navigationMethod?: string;
  driveType: DriveType;
  chassisShape: ChassisShape;
  // Shape dimensions
  chassisLength: number;
  chassisWidth: number;
  chassisHeight: number;
  // Motion center offsets - Idle
  headOffset: number;
  tailOffset: number;
  leftOffset: number;
  rightOffset: number;
  // Motion center offsets - Full Load
  headOffsetFull: number;
  tailOffsetFull: number;
  leftOffsetFull: number;
  rightOffsetFull: number;
  // Performance - Idle
  maxSpeed: number;
  maxAccel: number;
  maxDecel: number;
  avoidMaxDec: number;
  rotateMaxAngSpeed: number;
  rotateMaxAngAcceleration: number;
  // Performance - Full Load
  maxSpeedFull: number;
  maxAccelFull: number;
  maxDecelFull: number;
  avoidMaxDecFull: number;
  // General
  selfWeight?: number;
  totalLoadWeight?: number;
  powerSlots?: Record<string, string>;
}

export interface ControllerAbility {
  version: string;
  functionAbility?: any[];
  componentAbility?: any[];
}

export interface RobotConfig {
  id: string;
  name: string;
  description: string;
  components: ComponentConfig[];
  identity: RobotIdentity;
  abilities: ControllerAbility;
  selectedComponentId: string | null;
  validationErrors: any[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}
