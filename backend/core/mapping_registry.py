"""
mapping_registry.py
===================
AMR Studio Pro V4 - 元数据映射表

用于由于 CModel (Protobuf) 到 Reference JSON (Property Object) 的精确转换。
"""

# 通用属性映射 (generalAttr)
GENERAL_ATTR_MAP = {
    "moduleName": {"key": "module_name", "type": "DATA_STRING", "desc": "模块名称", "boolParse": True},
    "moduleDesc": {"key": "module_desc", "type": "DATA_STRING", "desc": "模块描述", "boolParse": True},
    "moduleUuid": {"key": "module_uuid", "type": "DATA_STRING", "desc": "模块Uuid", "boolParse": True, "boolHide": True},
    "versionInfo": {"key": "version_info", "type": "DATA_STRING", "desc": "版本信息", "boolParse": True, "boolNoeditable": True},
    "module3dIcon": {"key": "module_3d_icon", "type": "DATA_STRING", "desc": "3D模型", "boolParse": True},
    "subSysType": {"key": "sub_sys_type", "type": "DATA_COMBOX", "desc": "子系统", "boolParse": True},
    "mainModuleType": {"key": "main_module_type", "type": "DATA_COMBOX", "desc": "主类型", "boolParse": True},
    "subModuleType": {"key": "sub_module_type", "type": "DATA_COMBOX", "desc": "子类型", "boolParse": True},
    "venderName": {"key": "vender_name", "type": "DATA_COMBOX", "desc": "供应商", "boolParse": True},
    "moduleDscType": {"key": "module_dsc_type", "type": "DATA_COMBOX", "desc": "设备型号", "boolParse": True},
    "moduleIcon": {"key": "module_icon", "type": "DATA_STRING", "desc": "模块图片", "boolParse": True},
    "moduleShape": {"key": "module_shape", "type": "DATA_SHAPE", "desc": "模块外形"},
    "material_code": {"key": "material_code", "type": "DATA_STRING", "desc": "物料代码", "boolParse": True, "boolHide": True},
    "module_srcname": {"key": "module_srcname", "type": "DATA_STRING", "desc": "模块原始名称", "boolParse": True},
    "module_alias": {"key": "module_alias", "type": "DATA_STRING", "desc": "模块别名", "boolParse": True},
    "moduleUuid": {
        "key": "module_uuid",
        "type": "DATA_STRING",
        "desc": "模块Uuid",
        "boolParse": True,
        "boolHide": True
    },
    "versionInfo": {
        "key": "version_info",
        "type": "DATA_STRING",
        "desc": "版本信息",
        "boolParse": True,
        "boolNoeditable": True
    },
    "module3dIcon": {
        "key": "module_3d_icon",
        "type": "DATA_STRING",
        "desc": "3D模型",
        "boolParse": True
    },
    "subSysType": {
        "key": "sub_sys_type",
        "type": "DATA_COMBOX",
        "desc": "子系统",
        "boolParse": True
    },
    "mainModuleType": {
        "key": "main_module_type",
        "type": "DATA_COMBOX",
        "desc": "主类型",
        "boolParse": True
    },
    "subModuleType": {
        "key": "sub_module_type",
        "type": "DATA_COMBOX",
        "desc": "子类型",
        "boolParse": True
    },
    "venderName": {
        "key": "vender_name",
        "type": "DATA_COMBOX",
        "desc": "供应商",
        "boolParse": True
    },
    "moduleDscType": {
        "key": "module_dsc_type",
        "type": "DATA_COMBOX",
        "desc": "设备型号",
        "boolParse": True
    },
    "moduleIcon": {
        "key": "module_icon",
        "type": "DATA_STRING",
        "desc": "模块图片",
        "boolParse": True
    }
}

# 私有属性映射 (privateAttr)
PRIVATE_ATTR_MAP = {
    # 运动中心参数
    "headOffset(Idle)": {"key": "headOffset(Idle)", "type": "DATA_DOUBLE", "unit": "mm", "desc": "距离车头距离（空载）", "boolNoeditable": True, "boolMustfill": True, "boolBasic": True},
    "tailOffset(Idle)": {"key": "tailOffset(Idle)", "type": "DATA_DOUBLE", "unit": "mm", "desc": "距离车尾距离（空载）", "boolNoeditable": True, "boolMustfill": True, "boolBasic": True},
    "leftOffset(Idle)": {"key": "leftOffset(Idle)", "type": "DATA_DOUBLE", "unit": "mm", "desc": "距离左侧距离（空载）", "boolNoeditable": True, "boolMustfill": True, "boolBasic": True},
    "rightOffset(Idle)": {"key": "rightOffset(Idle)", "type": "DATA_DOUBLE", "unit": "mm", "desc": "距离右侧距离（空载）", "boolNoeditable": True, "boolMustfill": True, "boolBasic": True},
    "headOffset (Full Load)": {"key": "headOffset (Full Load)", "type": "DATA_DOUBLE", "unit": "mm", "desc": "距离车头距离（满载）", "boolNoeditable": True, "boolMustfill": True, "boolBasic": True},
    "tailOffset (Full Load)": {"key": "tailOffset (Full Load)", "type": "DATA_DOUBLE", "unit": "mm", "desc": "距离车尾距离（满载）", "boolNoeditable": True, "boolMustfill": True, "boolBasic": True},
    "leftOffset (Full Load)": {"key": "leftOffset (Full Load)", "type": "DATA_DOUBLE", "unit": "mm", "desc": "距离左侧距离（满载）", "boolNoeditable": True, "boolMustfill": True, "boolBasic": True},
    "rightOffset (Full Load)": {"key": "rightOffset (Full Load)", "type": "DATA_DOUBLE", "unit": "mm", "desc": "距离右侧距离（满载）", "boolNoeditable": True, "boolMustfill": True, "boolBasic": True},
    
    # 底盘参数
    "wheelsNum": {"key": "wheelsNum", "type": "DATA_INT32", "unit": "个", "desc": "轮组个数", "boolNoeditable": True, "boolMustfill": True, "boolBasic": True},
    "maxSpeed(Idle)": {"key": "maxSpeed(Idle)", "type": "DATA_DOUBLE", "unit": "mm/s", "desc": "最大速度（空载）", "boolMustfill": True},
    "maxAcceleration(Idle)": {"key": "maxAcceleration(Idle)", "type": "DATA_DOUBLE", "unit": "mm/s2", "desc": "最大线加速度（空载）", "boolMustfill": True},
    "maxDeceleration(Idle)": {"key": "maxDeceleration(Idle)", "type": "DATA_DOUBLE", "unit": "mm/s2", "desc": "最大线减速度（空载）", "boolMustfill": True},
    "rotateDiameter": {"key": "rotateDiameter", "type": "DATA_DOUBLE", "unit": "mm", "desc": "旋转直径", "boolMustfill": True},
    
    # 轮组属性
    "wheelRadius": {"key": "wheelRadius", "type": "DATA_DOUBLE", "unit": "mm", "desc": "轮半径", "boolMustfill": True, "boolBasic": True},
    "wheelSpace": {"key": "wheelSpace", "type": "DATA_DOUBLE", "unit": "mm", "desc": "轮间距", "boolMustfill": True},

    # 电机
    "gearRatio": {"key": "gearRatio", "type": "DATA_DOUBLE", "desc": "减速比", "boolMustfill": True},
    "RPM": {"key": "RPM", "type": "DATA_INT32", "unit": "RPM", "desc": "电机额定转速", "boolMustfill": True},
    "torque": {"key": "torque", "type": "DATA_DOUBLE", "unit": "N*m", "desc": "额定扭矩"},
    
    # 驱动器
    "chipPlatform": {"key": "chipPlatform", "type": "DATA_STRING", "desc": "芯片平台", "boolHide": True, "boolMustfill": True, "boolBasic": True},
    "softwareSpec": {"key": "softwareSpec", "type": "DATA_STRING", "desc": "软件规格", "boolMustfill": True, "boolBasic": True},
    "type": {"key": "type", "type": "DATA_COMBOX", "desc": "驱动类型"},
}

# 结构与关联参数 (structParam / locCoord)
STRUCT_PARAM_MAP = {
    "parentNodeUuid": {"key": "parentNodeUuid", "type": "DATA_COMBOX", "desc": "从属机构", "boolParse": True},
    "locCoordX": {"key": "locCoordX", "type": "DATA_DOUBLE", "unit": "mm", "desc": "X坐标", "boolParse": True, "boolMustfill": True},
    "locCoordY": {"key": "locCoordY", "type": "DATA_DOUBLE", "unit": "mm", "desc": "Y坐标", "boolParse": True, "boolMustfill": True},
    "locCoordZ": {"key": "locCoordZ", "type": "DATA_DOUBLE", "unit": "mm", "desc": "Z坐标", "boolParse": True, "boolMustfill": True},
    "locCoordROLL": {"key": "locCoordROLL", "type": "DATA_DOUBLE", "unit": "°", "desc": "翻滚角", "boolParse": True, "boolMustfill": True},
    "locCoordYAW": {"key": "locCoordYAW", "type": "DATA_DOUBLE", "unit": "°", "desc": "偏航角", "boolParse": True, "boolMustfill": True},
    "locCoordPITCH": {"key": "locCoordPITCH", "type": "DATA_DOUBLE", "unit": "°", "desc": "俯仰角", "boolParse": True, "boolMustfill": True},

    # 传感器
    'model': {'key': 'model', 'type': 'DATA_COMBOX', 'desc': '型号', 'boolMustfill': True},
    'ip': {'key': 'ip', 'type': 'DATA_STRING', 'desc': 'IP地址'},
    'port': {'key': 'port', 'type': 'DATA_INT32', 'desc': '端口'},
    
    # Other Common Params
    'material_code': {'key': 'material_code', 'type': 'DATA_STRING', 'desc': '物料代码', 'boolParse': True, 'boolHide': True},
    'module_srcname': {'key': 'module_srcname', 'type': 'DATA_STRING', 'stringValue': '', 'desc': '模块原始名称', 'boolParse': True},
    'module_alias': {'key': 'module_alias', 'type': 'DATA_STRING', 'stringValue': '', 'desc': '模块别名', 'boolParse': True},
    'module_3d_icon': {'key': 'module_3d_icon', 'type': 'DATA_STRING', 'desc': '3D模型', 'boolParse': True},
}

def _unwrap(val):
    if isinstance(val, list) and len(val) == 1:
        return _unwrap(val[0])
    return val

def to_property_object(key_or_meta, value):
    """根据 Key(str) 或 元数据(dict) 以及 原始值 构造详细的属性对象"""
    value = _unwrap(value)
    if not value and value != 0: return None
    
    meta = None
    if isinstance(key_or_meta, dict):
        meta = key_or_meta.copy()
    else:
        # 查找元数据
        for mapping in [GENERAL_ATTR_MAP, PRIVATE_ATTR_MAP, STRUCT_PARAM_MAP]:
            if key_or_meta in mapping:
                meta = mapping[key_or_meta].copy()
                break
    
    if not meta:
        key_str = str(key_or_meta)
        return {"key": key_str, "type": "DATA_STRING", "stringValue": str(value), "desc": key_str}

    # 根据类型填充值
    p_type = meta["type"]
    if value is None:
        return meta # Return with defaults or empty values

    if p_type == "DATA_STRING":
        meta["stringValue"] = str(value)
    elif p_type == "DATA_INT32":
        meta["int32Value"] = int(value)
    elif p_type == "DATA_DOUBLE":
        meta["doubleValue"] = float(value)
    elif p_type == "DATA_BOOL":
        meta["boolValue"] = bool(value)
    elif p_type == "DATA_COMBOX":
        # Complex object. Only keep logical keys (non-numeric)
        if isinstance(value, dict):
             for k, v in value.items():
                 if not k.isdigit():
                     meta[k] = v
        else:
            meta["comboType"] = {"typeKey": str(value)}
            
    return meta
