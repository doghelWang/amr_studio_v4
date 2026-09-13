/**
 * core/resourceAdapter.ts
 * =======================
 * AMR Studio Pro V4 - 资源适配器
 * 用于将前端提交的平面组件结构，翻译映射为符合 CModel (.model) 协议要求的嵌套树状结构，并做兜底默认值补充。
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';
import { MODULE_RESOURCES_DIR } from './paths';


// 工业级标准底盘元数据模版 (CR-10)
export const CHASSIS_GENERAL_ATTR_TEMPLATE = {
  moduleName: { key: "module_name", type: "DATA_STRING", desc: "模块名称", boolParse: true },
  moduleDesc: { key: "module_desc", type: "DATA_STRING", stringValue: "通用底盘", desc: "模块描述", boolParse: true },
  moduleUuid: { key: "module_uuid", type: "DATA_STRING", desc: "模块Uuid", boolParse: true, boolHide: true },
  moduleDscType: { key: "module_dsc_type", type: "DATA_UINT32", uint32Value: 0, desc: "模块描述类型", boolParse: true, boolHide: true },
  versionInfo: { key: "version_info", type: "DATA_STRING", stringValue: "1.0.0", desc: "版本信息", boolParse: true },
  module3dIcon: { key: "module_3d_icon", type: "DATA_STRING", stringValue: "chassis.png", desc: "3D图标", boolParse: true, boolHide: true },
  subSysType: {
    key: "sub_sys_type", type: "DATA_COMBOX", 
    comboType: { typeKey: "ChassisSys", typeDesc: "底盘系统" },
    desc: "子系统", boolParse: true
  },
  mainModuleType: {
    key: "main_module_type", type: "DATA_COMBOX", 
    comboType: { typeKey: "chassis", typeDesc: "底盘" },
    desc: "主类型", boolParse: true
  },
  subModuleType: {
    key: "sub_module_type", type: "DATA_COMBOX",
    comboType: { typeKey: "steerChassis", typeDesc: "舵轮底盘" },
    desc: "子类型", boolParse: true
  },
  moduleType: { key: "module_type", type: "DATA_STRING", stringValue: "CHASSIS", desc: "模块型号", boolParse: true },
  moduleSupplier: { key: "module_supplier", type: "DATA_STRING", stringValue: "Standard", desc: "供应商", boolParse: true },
  moduleWeight: { key: "module_weight", type: "DATA_DOUBLE", doubleValue: 50.0, desc: "质量(kg)", boolParse: true },
  modulePower: { key: "module_power", type: "DATA_DOUBLE", doubleValue: 100.0, desc: "功率(W)", boolParse: true },
  moduleShape: { key: "module_shape", shapeType: "ENUM_BOX", box: { sizeLen: 100, sizeWidth: 100, sizeHeight: 100 }, desc: "底盘形状", boolParse: true }
};

export const CATEGORY_TO_TYPE_KEY: Record<string, { key: string; desc: string }> = {
  'CHASSIS':               { key: 'chassis',           desc: "底盘" },
  'DRIVEWHEEL':            { key: 'driveWheel',        desc: "驱动轮" },
  'DRIVER':                { key: 'driver',            desc: "驱动器" },
  'MOTOR':                 { key: 'PMSMMotor',         desc: "永磁同步电机" },
  'MAINCPU':               { key: 'mainCPU',           desc: "核心主控" },
  'INTERGRATEDCONTROLLER': { key: 'mainCPU',           desc: "核心主控" },
  'SENSOR':                { key: 'sensor',            desc: "感知传感器" },
  'BATTERY':               { key: 'battery',           desc: "能量电池" },
  'BUTTON':                { key: 'button',            desc: "交互按钮" },
  'LIGHT':                 { key: 'light',             desc: "指示灯光" },
  'IO':                    { key: 'extendedlnterface', desc: "接口扩展模块" },
  'IO_BOARD':              { key: 'extendedlnterface', desc: "接口扩展模块" },
  'EXTENDEDLNTERFACE':     { key: 'extendedlnterface', desc: "接口扩展模块" },
  'EXTENDEDINTERFACE':     { key: 'extendedlnterface', desc: "接口扩展模块" },
};

export const CATEGORY_TO_SUBSYS: Record<string, { key: string; desc: string }> = {
  'CHASSIS':               { key: 'ChassisSys',      desc: "底盘系统" },
  'DRIVEWHEEL':            { key: 'ChassisSys',      desc: "底盘系统" }, 
  'DRIVER':                { key: 'DriverSys',       desc: "驱动系统" },
  'MOTOR':                 { key: 'DriverSys',       desc: "驱动系统" },
  'MAINCPU':               { key: 'ControlSys',      desc: "控制系统" },
  'INTERGRATEDCONTROLLER': { key: 'ControlSys',      desc: "控制系统" },
  'SENSOR':                { key: 'SensorSys',       desc: "传感器系统" },
  'BATTERY':               { key: 'EnergySys',       desc: "能量系统" },
  'BUTTON':                { key: 'InteractiveSys',  desc: "交互系统" },
  'LIGHT':                 { key: 'InteractiveSys',  desc: "交互系统" },
  'IO':                    { key: 'ControlSys',      desc: "控制系统" },
  'IO_BOARD':              { key: 'ControlSys',      desc: "控制系统" },
  'EXTENDEDLNTERFACE':     { key: 'ControlSys',      desc: "控制系统" },
};

export function loadModuleTemplate(componentType: string): any | null {
  try {
    const tplPath = path.join(MODULE_RESOURCES_DIR, `${componentType}.json`);
    if (fs.existsSync(tplPath)) {
      const raw = fs.readFileSync(tplPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

export function mapAttributeToCmodel(a: any, isAbility = false): any {
  let attrType = a.type || "DATA_STRING";
  if (isAbility) {
    if (attrType === "DATA_FIXED_E") {
      attrType = "FIXED_E";
    } else if (attrType === "DATA_COMBOX") {
      attrType = "DATA_COMBOX_E";
    }
  }

  const base: any = {
    key: a.key || "",
    type: attrType,
    desc: a.desc || a.describer || "",
    unit: a.unit || "",
    boolParse: a.boolParse !== undefined ? a.boolParse : true,
    boolHide: a.boolHide !== undefined ? a.boolHide : false,
    boolBasic: a.boolBasic !== undefined ? a.boolBasic : true,
    boolMustfill: a.boolMustfill !== undefined ? a.boolMustfill : false,
    boolNoeditable: a.boolNoeditable !== undefined ? a.boolNoeditable : false,
    fixedSource: a.fixedSource || []
  };

  const val = a.value;
  if (val !== undefined && val !== null) {
    if (attrType === "DATA_DOUBLE") base.doubleValue = parseFloat(val);
    else if (attrType === "DATA_INT32") base.int32Value = parseInt(val, 10);
    else if (attrType === "DATA_BOOL") base.boolValue = !!val;
    else if (attrType === "DATA_STRING" || attrType === "DATA_FIXED_E") base.stringValue = String(val);
    else if (attrType === "DATA_COMBOX") {
      const combo = a.comboType || a.combo_type;
      if (combo) {
        base.comboType = {
          typeKey: combo.typeKey || combo.type_key || "",
          typeDesc: combo.typeDesc || combo.type_desc || "",
          typeGroups: []
        };
        const groups = combo.typeGroups || combo.type_groups || [];
        for (const g of groups) {
          const group: any = {
            key: g.key,
            desc: g.desc || ""
          };
          const sk = isAbility ? "arrayAttr" : "arrayCmobEle";
          const ssk = isAbility ? "arrayAttr" : (g.arrayCmobEle ? "arrayCmobEle" : "array_cmob_ele");
          if (g[ssk]) {
            group[sk] = g[ssk].map((sub: any) => mapAttributeToCmodel(sub, isAbility));
          }
          base.comboType.typeGroups.push(group);
        }
      }
    }
  }
  return base;
}

export function mapComponentToCmodel(c: any, identity?: any): any {
  let category = c.category || "";
  const compType = c.type || "";
  const compName = (c.name || "").trim();
  const compUuid = c.id || "";

  // 接口扩展板的语义推断 (D-0)
  if (!category || category === "EXTENDEDLNTERFACE") {
    const nameUpper = compName.toUpperCase();
    if (["INTERFACE", "IO-", "BOARD", "IOMODULE"].some(k => nameUpper.includes(k))) {
      category = "IO";
    }
  }

  console.log(`DEBUG_ADAPTER: Mapping ${compName}, Category: ${category}, Type: ${compType}`);

  const isChassis = category === "CHASSIS" || c.id === "chassis-root";
  const template = isChassis ? null : loadModuleTemplate(compType);
  
  let genAttr: any = {};
  if (template) {
    genAttr = JSON.parse(JSON.stringify(template.generalAttr || {}));
    if (genAttr.moduleName) {
      genAttr.moduleName.stringValue = compName;
    } else {
      genAttr.moduleName = { key: "module_name", type: "DATA_STRING", stringValue: compName, desc: "模块名称", boolParse: true };
    }
    if (genAttr.moduleUuid) {
      genAttr.moduleUuid.stringValue = compUuid;
    } else {
      genAttr.moduleUuid = { key: "module_uuid", type: "DATA_STRING", stringValue: compUuid, desc: "模块Uuid", boolParse: true, boolHide: true };
    }
  } else if (isChassis) {
    genAttr = JSON.parse(JSON.stringify(CHASSIS_GENERAL_ATTR_TEMPLATE));
    genAttr.moduleName.stringValue = "chassis_diff";
    genAttr.moduleUuid.stringValue = c.id || "chassis-root";
    if (identity) {
      genAttr.moduleShape = {
        key: "module_shape", shapeType: "ENUM_BOX", desc: "底盘形状", boolParse: true,
        box: {
          sizeLen: parseFloat(identity.chassisLength || 100),
          sizeWidth: parseFloat(identity.chassisWidth || 100),
          sizeHeight: parseFloat(identity.chassisHeight || 100)
        }
      };
    }
  } else {
    const typeCfg = CATEGORY_TO_TYPE_KEY[category.toUpperCase()] || { key: "unknown", desc: "未知" };
    genAttr = {
      moduleName: { key: "module_name", type: "DATA_STRING", stringValue: compName, desc: "模块名称", boolParse: true },
      moduleDesc: { key: "module_desc", type: "DATA_STRING", stringValue: compName, desc: "模块描述", boolParse: true },
      moduleUuid: { key: "module_uuid", type: "DATA_STRING", stringValue: compUuid, desc: "模块Uuid", boolParse: true, boolHide: true },
      versionInfo: { key: "version_info", type: "DATA_STRING", stringValue: "V1.0", desc: "版本信息", boolParse: true, boolNoeditable: true },
      mainModuleType: { key: "main_module_type", type: "DATA_COMBOX", comboType: { typeKey: typeCfg.key, typeDesc: typeCfg.desc }, boolParse: true, desc: "主类型" },
      subModuleType: { key: "sub_module_type", type: "DATA_COMBOX", comboType: { typeKey: typeCfg.key, typeDesc: typeCfg.desc }, boolParse: true, desc: "子类型" },
      moduleShape: { shapeType: "ENUM_BOX", box: { sizeLen: 100, sizeWidth: 100, sizeHeight: 100 } }
    };
  }

  // 子系统注入校验 (CR-09)
  if (!genAttr.subSysType || !genAttr.subSysType.comboType?.typeDesc) {
    const subsysCfg = CATEGORY_TO_SUBSYS[category.toUpperCase()] || { key: "UnclassifiedSys", desc: "未分类系统" };
    genAttr.subSysType = {
      key: "sub_sys_type", type: "DATA_COMBOX",
      comboType: { typeKey: subsysCfg.key, typeDesc: subsysCfg.desc }, 
      boolParse: true, desc: "子系统"
    };
  }
  
  if (!genAttr.mainModuleType || !genAttr.mainModuleType.comboType?.typeDesc) {
    const typeCfg = CATEGORY_TO_TYPE_KEY[category.toUpperCase()] || { key: "", desc: "" };
    if (typeCfg.key) {
      genAttr.mainModuleType = {
        key: "main_module_type", type: "DATA_COMBOX", 
        comboType: { typeKey: typeCfg.key, typeDesc: typeCfg.desc }, 
        boolParse: true, desc: "主类型"
      };
    }
  }
  
  if (!genAttr.subModuleType || !genAttr.subModuleType.comboType?.typeDesc) {
    if (isChassis) {
      genAttr.subModuleType = {
        key: "sub_module_type", type: "DATA_COMBOX",
        comboType: { typeKey: "steerChassis", typeDesc: "舵轮底盘" }, 
        boolParse: true, desc: "子类型"
      };
    } else if (category.toUpperCase() === 'DRIVEWHEEL') {
      genAttr.subModuleType = {
        key: "sub_module_type", type: "DATA_COMBOX",
        comboType: { typeKey: "horizontalSteerWheel", typeDesc: "水平旋转舵轮" }, 
        boolParse: true, desc: "子类型"
      };
    } else if (['IO', 'IO_BOARD', 'EXTENDEDLNTERFACE'].includes(category.toUpperCase())) {
      genAttr.subModuleType = {
        key: "sub_module_type", type: "DATA_COMBOX",
        comboType: { typeKey: "IOModule", typeDesc: "接口扩展模块" }, 
        boolParse: true, desc: "子类型"
      };
    } else {
      const typeCfg = CATEGORY_TO_TYPE_KEY[category.toUpperCase()] || { key: "unknown", desc: "未知" };
      genAttr.subModuleType = {
        key: "sub_module_type", type: "DATA_COMBOX",
        comboType: { typeKey: typeCfg.key, typeDesc: typeCfg.desc }, 
        boolParse: true, desc: "子类型"
      };
    }
  }
  
  if (!genAttr.moduleShape) {
    genAttr.moduleShape = { shapeType: "ENUM_BOX", box: { sizeLen: 100, sizeWidth: 100, sizeHeight: 100 } };
  }
  if (!genAttr.versionInfo) {
    genAttr.versionInfo = { key: "version_info", type: "DATA_STRING", stringValue: "V1.0", desc: "版本信息", boolParse: true, boolNoeditable: true };
  }
  if (!genAttr.moduleType) {
    genAttr.moduleType = { key: "module_type", type: "DATA_STRING", stringValue: category.toUpperCase(), desc: "模块型号", boolParse: true };
  }

  const extendParams = [
    { key: "parentNodeUuid", type: "DATA_COMBOX", comboType: { typeKey: c.parentNodeUuid || "", typeDesc: "" }, desc: "从属机构" },
    { key: "locCoordX", type: "DATA_DOUBLE", doubleValue: parseFloat(c.mountX || 0), doubleMaxvalue: 9999.0, doubleMinvalue: -9999.0, unit: "mm", desc: "X坐标" },
    { key: "locCoordY", type: "DATA_DOUBLE", doubleValue: parseFloat(c.mountY || 0), doubleMaxvalue: 9999.0, doubleMinvalue: -9999.0, unit: "mm", desc: "Y坐标" },
    { key: "locCoordZ", type: "DATA_DOUBLE", doubleValue: parseFloat(c.mountZ || 0), doubleMaxvalue: 9999.0, doubleMinvalue: -9999.0, unit: "mm", desc: "Z坐标" },
    { key: "locCoordROLL", type: "DATA_DOUBLE", doubleValue: parseFloat(c.mountRoll || 0), doubleMaxvalue: 360.0, doubleMinvalue: -360.0, unit: "°", desc: "ROLL" },
    { key: "locCoordPITCH", type: "DATA_DOUBLE", doubleValue: parseFloat(c.mountPitch || 0), doubleMaxvalue: 360.0, doubleMinvalue: -360.0, unit: "°", desc: "PITCH" },
    { key: "locCoordYAW", type: "DATA_DOUBLE", doubleValue: parseFloat(c.mountYaw || 0), doubleMaxvalue: 360.0, doubleMinvalue: -360.0, unit: "°", desc: "YAW" }
  ];

  const privAttrsForPb = (c.privateAttrs || []).map((g: any) => ({
    key: g.key,
    desc: g.desc || "",
    arrayBaseEle: (g.elements || []).map((e: any) => mapAttributeToCmodel(e, false))
  }));

  const frontendInterfaces = c.interfaces || [];
  const templateInterfaceGroups = frontendInterfaces.map((i: any) => ({
    key: i.key || "",
    type: i.type || "",
    path: i.path || "",
    desc: i.desc || "",
    interfaceUuid: i.interfaceUuid || "",
    linkedInterfaceUuid: i.linkedInterfaceUuid || []
  }));

  return {
    generalAttr: genAttr,
    privateAttr: { privateAttrs: privAttrsForPb },
    interfaceAbility: c.interfaceAbility || { busInterfaceAbility: [] },
    interfaceParams: { interfaceGroup: templateInterfaceGroups },
    structParam: { extendParams }
  };
}

export function mapModuleGroup(comp: any, allComponents: any[], identity?: any): any {
  const children = allComponents.filter((c: any) => c.parentNodeUuid === comp.id);
  let groupName = comp.name || "chassis_diff";
  if (comp.id === "chassis-root") {
    groupName = "chassis_diff";
  } else {
    groupName = (comp.name || "ModuleGroup").replace("module_", "").trim();
  }


  return {
    moduleGroupName: groupName,
    moduleGroupUuid: comp.id || "",
    moduleComponets: [mapComponentToCmodel(comp, identity)],
    moreModuleInfo: children.map(c => mapModuleGroup(c, allComponents, identity))
  };
}

export function frontendToCompDesc(config: any): any {
  const identity = config.identity || {};
  const components = config.components || [];
  const rootComps = components.filter((c: any) => !c.parentNodeUuid);
  
  return {
    moduleGroupName: identity.robotName || "Robot",
    modelVersion: "",
    moreModuleInfo: rootComps.map((c: any) => mapModuleGroup(c, components, identity))
  };
}


export function exportAbilities(abilities: any): any {
  if (!abilities) return { version: "V1.0", componentAbility: [], functionAbility: [] };
  
  const functionAbility = (abilities.functionAbility || []).map((f: any) => ({
    type: f.type || "",
    desc: f.desc || "",
    tips: f.tips || "",
    childFunction: (f.childFunction || []).map((cf: any) => ({
      type: cf.type || cf.key || "",
      desc: cf.desc || "",
      tips: cf.tips || "",
      key: cf.key || "",
      attr: (cf.attr || []).map((a: any) => mapAttributeToCmodel(a, true)),
      cloneEnable: !!cf.cloneEnable
    }))
  }));

  return {
    version: abilities.version || "V1.0",
    componentAbility: abilities.componentAbility || [],
    functionAbility
  };
}

export async function xmlToComponentJson(xmlPath: string): Promise<any> {
  try {
    const content = await fs.promises.readFile(xmlPath, 'utf-8');
    const parsed = await parseStringPromise(content);
    if (!parsed || !parsed.ModuleGroup) {
      return { moduleGroupName: "Unknown", module_componets: [] };
    }
    const root = parsed.ModuleGroup;
    const components: any[] = [];
    
    // Find all Component tags
    const compList = root.Component || [];
    for (const comp of compList) {
      const compAttr = comp.$ || {};
      const identity = comp.Identity ? comp.Identity[0] : null;
      const identityAttr = identity ? (identity.$ || {}) : {};
      const name = identityAttr.name || "Unknown";
      
      components.push({
        generalAttr: {
          moduleName: { stringValue: name.trim() },
          subSysType: { comboType: { typeKey: compAttr.category || "" } }
        }
      });
    }
    return {
      moduleGroupName: root.$?.name || "Unknown",
      module_componets: components
    };
  } catch (e) {
    console.error("xmlToComponentJson error for " + xmlPath, e);
    return { moduleGroupName: "Unknown", module_componets: [] };
  }
}

