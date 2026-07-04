/**
 * mappingRegistry.ts
 * ==================
 * AMR Studio Pro V4 - 元数据映射表
 * 用于 CModel (Protobuf) 到 Reference JSON (Property Object) 的精确转换。
 */

export interface MappingMeta {
  key: string;
  type: string;
  desc: string;
  unit?: string;
  boolParse?: boolean;
  boolHide?: boolean;
  boolBasic?: boolean;
  boolMustfill?: boolean;
  boolNoeditable?: boolean;
  stringValue?: string;
  int32Value?: number;
  doubleValue?: number;
  boolValue?: boolean;
  comboType?: {
    typeKey: string;
    typeDesc?: string;
    typeGroups?: any[];
  };
}

// 通用属性映射 (generalAttr)
export const GENERAL_ATTR_MAP: Record<string, MappingMeta> = {
  moduleName: { key: "module_name", type: "DATA_STRING", desc: "模块名称", boolParse: true },
  moduleDesc: { key: "module_desc", type: "DATA_STRING", desc: "模块描述", boolParse: true },
  moduleUuid: { key: "module_uuid", type: "DATA_STRING", desc: "模块Uuid", boolParse: true, boolHide: true },
  versionInfo: { key: "version_info", type: "DATA_STRING", desc: "版本信息", boolParse: true, boolNoeditable: true },
  module3dIcon: { key: "module_3d_icon", type: "DATA_STRING", desc: "3D模型", boolParse: true },
  subSysType: { key: "sub_sys_type", type: "DATA_COMBOX", desc: "子系统", boolParse: true },
  mainModuleType: { key: "main_module_type", type: "DATA_COMBOX", desc: "主类型", boolParse: true },
  subModuleType: { key: "sub_module_type", type: "DATA_COMBOX", desc: "子类型", boolParse: true },
  venderName: { key: "vender_name", type: "DATA_COMBOX", desc: "供应商", boolParse: true },
  moduleDscType: { key: "module_dsc_type", type: "DATA_COMBOX", desc: "设备型号", boolParse: true },
  moduleIcon: { key: "module_icon", type: "DATA_STRING", desc: "模块图片", boolParse: true },
  moduleShape: { key: "module_shape", type: "DATA_SHAPE", desc: "模块外形" },
  material_code: { key: "material_code", type: "DATA_STRING", desc: "物料代码", boolParse: true, boolHide: true },
  module_srcname: { key: "module_srcname", type: "DATA_STRING", desc: "模块原始名称", boolParse: true },
  module_alias: { key: "module_alias", type: "DATA_STRING", desc: "模块别名", boolParse: true }
};

// 私有属性映射 (privateAttr)
export const PRIVATE_ATTR_MAP: Record<string, MappingMeta> = {
  // 运动中心参数
  "headOffset(Idle)": { key: "headOffset(Idle)", type: "DATA_DOUBLE", unit: "mm", desc: "距离车头距离（空载）", boolNoeditable: true, boolMustfill: true, boolBasic: true },
  "tailOffset(Idle)": { key: "tailOffset(Idle)", type: "DATA_DOUBLE", unit: "mm", desc: "距离车尾距离（空载）", boolNoeditable: true, boolMustfill: true, boolBasic: true },
  "leftOffset(Idle)": { key: "leftOffset(Idle)", type: "DATA_DOUBLE", unit: "mm", desc: "距离左侧距离（空载）", boolNoeditable: true, boolMustfill: true, boolBasic: true },
  "rightOffset(Idle)": { key: "rightOffset(Idle)", type: "DATA_DOUBLE", unit: "mm", desc: "距离右侧距离（空载）", boolNoeditable: true, boolMustfill: true, boolBasic: true },
  "headOffset (Full Load)": { key: "headOffset (Full Load)", type: "DATA_DOUBLE", unit: "mm", desc: "距离车头距离（满载）", boolNoeditable: true, boolMustfill: true, boolBasic: true },
  "tailOffset (Full Load)": { key: "tailOffset (Full Load)", type: "DATA_DOUBLE", unit: "mm", desc: "距离车尾距离（满载）", boolNoeditable: true, boolMustfill: true, boolBasic: true },
  "leftOffset (Full Load)": { key: "leftOffset (Full Load)", type: "DATA_DOUBLE", unit: "mm", desc: "距离左侧距离（满载）", boolNoeditable: true, boolMustfill: true, boolBasic: true },
  "rightOffset (Full Load)": { key: "rightOffset (Full Load)", type: "DATA_DOUBLE", unit: "mm", desc: "距离右侧距离（满载）", boolNoeditable: true, boolMustfill: true, boolBasic: true },
  
  // 底盘参数
  "wheelsNum": { key: "wheelsNum", type: "DATA_INT32", unit: "个", desc: "轮组个数", boolNoeditable: true, boolMustfill: true, boolBasic: true },
  "maxSpeed(Idle)": { key: "maxSpeed(Idle)", type: "DATA_DOUBLE", unit: "mm/s", desc: "最大速度（空载）", boolMustfill: true },
  "maxAcceleration(Idle)": { key: "maxAcceleration(Idle)", type: "DATA_DOUBLE", unit: "mm/s2", desc: "最大线加速度（空载）", boolMustfill: true },
  "maxDeceleration(Idle)": { key: "maxDeceleration(Idle)", type: "DATA_DOUBLE", unit: "mm/s2", desc: "最大线减速度（空载）", boolMustfill: true },
  "rotateDiameter": { key: "rotateDiameter", type: "DATA_DOUBLE", unit: "mm", desc: "旋转直径", boolMustfill: true },
  
  // 轮组属性
  "wheelRadius": { key: "wheelRadius", type: "DATA_DOUBLE", unit: "mm", desc: "轮半径", boolMustfill: true, boolBasic: true },
  "wheelSpace": { key: "wheelSpace", type: "DATA_DOUBLE", unit: "mm", desc: "轮间距", boolMustfill: true },

  // 电机
  "gearRatio": { key: "gearRatio", type: "DATA_DOUBLE", desc: "减速比", boolMustfill: true },
  "RPM": { key: "RPM", type: "DATA_INT32", unit: "RPM", desc: "电机额定转速", boolMustfill: true },
  "torque": { key: "torque", type: "DATA_DOUBLE", unit: "N*m", desc: "额定扭矩" },
  
  // 驱动器
  "chipPlatform": { key: "chipPlatform", type: "DATA_STRING", desc: "芯片平台", boolHide: true, boolMustfill: true, boolBasic: true },
  "softwareSpec": { key: "softwareSpec", type: "DATA_STRING", desc: "软件规格", boolMustfill: true, boolBasic: true },
  "type": { key: "type", type: "DATA_COMBOX", desc: "驱动类型" }
};

// 结构与关联参数 (structParam / locCoord)
export const STRUCT_PARAM_MAP: Record<string, MappingMeta> = {
  parentNodeUuid: { key: "parentNodeUuid", type: "DATA_COMBOX", desc: "从属机构", boolParse: true },
  locCoordX: { key: "locCoordX", type: "DATA_DOUBLE", unit: "mm", desc: "X坐标", boolParse: true, boolMustfill: true },
  locCoordY: { key: "locCoordY", type: "DATA_DOUBLE", unit: "mm", desc: "Y坐标", boolParse: true, boolMustfill: true },
  locCoordZ: { key: "locCoordZ", type: "DATA_DOUBLE", unit: "mm", desc: "Z坐标", boolParse: true, boolMustfill: true },
  locCoordROLL: { key: "locCoordROLL", type: "DATA_DOUBLE", unit: "°", desc: "翻滚角", boolParse: true, boolMustfill: true },
  locCoordYAW: { key: "locCoordYAW", type: "DATA_DOUBLE", unit: "°", desc: "偏航角", boolParse: true, boolMustfill: true },
  locCoordPITCH: { key: "locCoordPITCH", type: "DATA_DOUBLE", unit: "°", desc: "俯仰角", boolParse: true, boolMustfill: true },

  // 传感器
  model: { key: "model", type: "DATA_COMBOX", desc: "型号", boolMustfill: true },
  ip: { key: "ip", type: "DATA_STRING", desc: "IP地址" },
  port: { key: "port", type: "DATA_INT32", desc: "端口" },
  
  // Other Common Params
  material_code: { key: "material_code", type: "DATA_STRING", desc: "物料代码", boolParse: true, boolHide: true },
  module_srcname: { key: "module_srcname", type: "DATA_STRING", stringValue: "", desc: "模块原始名称", boolParse: true },
  module_alias: { key: "module_alias", type: "DATA_STRING", stringValue: "", desc: "模块别名", boolParse: true },
  module_3d_icon: { key: "module_3d_icon", type: "DATA_STRING", desc: "3D模型", boolParse: true }
};

function unwrap(val: any): any {
  if (Array.isArray(val) && val.length === 1) {
    return unwrap(val[0]);
  }
  return val;
}

export function toPropertyObject(keyOrMeta: string | Record<string, any>, value: any): MappingMeta | null {
  /**
   * 根据 Key(str) 或 元数据(dict) 以及 原始值 构造详细的属性对象
   */
  const unwrappedValue = unwrap(value);
  if (unwrappedValue === undefined || unwrappedValue === null) {
    if (unwrappedValue !== 0 && unwrappedValue !== "") {
      return null;
    }
  }

  let meta: MappingMeta | null = null;
  if (typeof keyOrMeta === "object" && keyOrMeta !== null) {
    meta = { ...keyOrMeta } as MappingMeta;
  } else {
    // 查找元数据
    for (const mapping of [GENERAL_ATTR_MAP, PRIVATE_ATTR_MAP, STRUCT_PARAM_MAP]) {
      if (keyOrMeta in mapping) {
        meta = { ...mapping[keyOrMeta] };
        break;
      }
    }
  }

  if (!meta) {
    const keyStr = String(keyOrMeta);
    return { key: keyStr, type: "DATA_STRING", stringValue: String(unwrappedValue), desc: keyStr };
  }

  // 根据类型填充值
  const pType = meta.type;
  if (unwrappedValue === undefined || unwrappedValue === null) {
    return meta; // Return defaults
  }

  if (pType === "DATA_STRING") {
    meta.stringValue = String(unwrappedValue);
  } else if (pType === "DATA_INT32") {
    meta.int32Value = Number(unwrappedValue);
  } else if (pType === "DATA_DOUBLE") {
    meta.doubleValue = Number(unwrappedValue);
  } else if (pType === "DATA_BOOL") {
    meta.boolValue = Boolean(unwrappedValue);
  } else if (pType === "DATA_COMBOX") {
    if (typeof unwrappedValue === "object" && unwrappedValue !== null) {
      // 保持非数字键
      for (const [k, v] of Object.entries(unwrappedValue)) {
        if (isNaN(Number(k))) {
          (meta as any)[k] = v;
        }
      }
    } else {
      meta.comboType = { typeKey: String(unwrappedValue) };
    }
  }

  return meta;
}
