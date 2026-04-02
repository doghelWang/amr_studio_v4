"""
schema_builder.py
=================
AMR Studio Pro V4 - CModel 构建器 (v4.5 Deep Alignment)

Key Improvements:
1. Protobuf Objects: Uses official generated classes instead of blackbox-protobuf dictionaries.
2. Template Injection: Loads a reference model and injects dynamic data into typed messages.
3. IEEE-754 Precision: Native Protobuf double support.
4. Dependency Resolution: Removes blackboxprotobuf to resolve version conflicts with Protobuf 5.x.
"""

import os
import uuid
import json
import zipfile
import tempfile
import hashlib
import struct
from pathlib import Path
from schemas.api import GeneratePayload, McuConfig
from skills_v2.schemas_pb.controller_model_comp_desc_pb2 import (
    Message_Module_Info,
    Message_Module_Componets,
    Message_Base_Element,
    Message_Base_Group_Element,
    Message_Module_General_Attribute,
    Message_Module_Private_Attribute,
    Message_Interface_Ability,
    Message_Interface_Param,
    Message_Struct_Param,
    DATA_STRING,
    DATA_DOUBLE,
    DATA_INT32,
    DATA_COMBOX
)

def make_uuid() -> str:
    return str(uuid.uuid4()).replace('-', '')

class CModelProperty:
    """
    Abstractions for the 'Message_Base_Element' message found in CModel files.
    """
    @staticmethod
    def string(key: str, val: str, desc: str = "") -> Message_Base_Element:
        prop = Message_Base_Element()
        prop.key = key
        prop.type = DATA_STRING
        prop.string_value = str(val or "")
        prop.desc = desc
        prop.bool_parse = True
        return prop

    @staticmethod
    def double(key: str, val: float, desc: str = "", unit: str = "") -> Message_Base_Element:
        prop = Message_Base_Element()
        prop.key = key
        prop.type = DATA_DOUBLE
        prop.double_value = float(val)
        prop.double_maxvalue = float(val) # Matching original behavior
        prop.unit = unit
        prop.desc = desc
        prop.bool_parse = True
        prop.bool_mustfill = True
        return prop

    @staticmethod
    def int32(key: str, val: int, desc: str = "", unit: str = "") -> Message_Base_Element:
        prop = Message_Base_Element()
        prop.key = key
        prop.type = DATA_INT32
        prop.int32_value = int(val or 0)
        prop.int32_maxvalue = int(val or 0)
        prop.unit = unit
        prop.desc = desc
        prop.bool_parse = True
        prop.bool_mustfill = True
        return prop

    @staticmethod
    def combox(key: str, val: str, desc: str = "") -> Message_Base_Element:
        prop = Message_Base_Element()
        prop.key = key
        prop.type = DATA_COMBOX
        prop.combo_type.type_key = val
        prop.desc = desc
        prop.bool_parse = True
        return prop

class CustomCompDescBuilder:
    def __init__(self, template_path: str):
        self.template_path = template_path
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found: {template_path}")
            
        with open(template_path, 'rb') as f:
            raw = f.read()
            
        self.payload = Message_Module_Info()
        self.payload.ParseFromString(raw)
        # Clear existing nodes to start clean, but keep global metadata
        self.payload.module_componets.clear()

    def _create_node(self, m_type: str, m_name: str, sub_type: str = "") -> Message_Module_Componets:
        m_uuid = make_uuid()
        comp = Message_Module_Componets()
        
        # General Attributes
        ga = comp.general_attr
        ga.module_name.CopyFrom(CModelProperty.string("module_name", m_name, "模块名称"))
        ga.module_uuid.CopyFrom(CModelProperty.string("module_uuid", m_uuid, "模块Uuid"))
        ga.sub_sys_type.CopyFrom(CModelProperty.combox("sub_sys_type", "ChassisSys", "子系统"))
        ga.main_module_type.CopyFrom(CModelProperty.combox("main_module_type", m_type, "主类型"))
        ga.sub_module_type.CopyFrom(CModelProperty.combox("sub_module_type", sub_type or m_type, "子类型"))
        
        # Add alias to extend_params
        alias = Message_Base_Element()
        alias.key = "module_alias"
        alias.type = DATA_STRING
        alias.string_value = m_name
        alias.desc = "模块别名"
        alias.bool_parse = True
        ga.extend_params.append(alias)
        
        return comp

    def _get_uuid(self, node: Message_Module_Componets) -> str:
        return node.general_attr.module_uuid.string_value

    def _add_relation(self, node: Message_Module_Componets, parent: Message_Module_Componets, x=0.0, y=0.0, z=0.0, yaw=0.0, pitch=0.0, roll=0.0):
        p_uuid = self._get_uuid(parent)
        # Note: In the original CModel, relations were often encoded as dynamic Property list
        # Here we follow the original structure but using typed messages if available,
        # but the original relied on a list of elements in a specialized 'relations' group.
        # Based on the original schema_builder.py, relations are added to tag 5 of general_attr.
        p_name = parent.general_attr.module_name.string_value
        
        # We'll use a dynamic list for relations to match original behavior
        rel_uuid = Message_Base_Element()
        rel_uuid.key = "parentNodeUuid"
        rel_uuid.type = DATA_COMBOX
        rel_uuid.combo_type.type_key = p_uuid
        rel_uuid.combo_type.type_desc = p_name
        # Add to extend_params for now as the original did
        node.general_attr.extend_params.append(rel_uuid)
        
        node.general_attr.extend_params.append(CModelProperty.double("locCoordX", x, "安装X", "mm"))
        node.general_attr.extend_params.append(CModelProperty.double("locCoordY", y, "安装Y", "mm"))
        node.general_attr.extend_params.append(CModelProperty.double("locCoordZ", z, "安装Z", "mm"))
        node.general_attr.extend_params.append(CModelProperty.double("locCoordYAW", yaw, "安装YAW", "°"))
        if pitch != 0: node.general_attr.extend_params.append(CModelProperty.double("locCoordPITCH", pitch, "安装PITCH", "°"))
        if roll != 0: node.general_attr.extend_params.append(CModelProperty.double("locCoordROLL", roll, "安装ROLL", "°"))

    def build_from_payload(self, amr: GeneratePayload, base_template_zip: str = None) -> str:
        # 1. Chassis
        ch_meta = amr.chassis
        chassis = self._create_node("chassis", amr.robotName, "steerChassis")
        
        # Original grouping behavior
        # Note: In official schemas, you might have specific fields, but here we mirror the dynamic groups
        # used in the V4.5 baseline.
        
        # 2. Wheels
        self.payload.module_componets.append(chassis)
        for w in amr.wheels:
            wnode = self._create_node("driveWheel", w.label, w.type.lower())
            self._add_relation(wnode, chassis, w.mountX, w.mountY, w.mountZ, w.mountYaw)
            self.payload.module_componets.append(wnode)
            
            for comp in w.components:
                dnode = self._create_node("subDriver", f"{w.label}_{comp.role}", "driver")
                self._add_relation(dnode, wnode, 0, 0, 0)
                self.payload.module_componets.append(dnode)

        # 3. Sensors
        for s in amr.sensors:
            snode = self._create_node("sensor", s.label, s.type.lower())
            self._add_relation(snode, chassis, s.mountX, s.mountY, s.mountZ, s.mountYaw, s.mountPitch, s.mountRoll)
            self.payload.module_componets.append(snode)

        # 4. MCU
        m_meta = amr.mcu or McuConfig()
        mcu = self._create_node("mainCPU", m_meta.model, "mainCPU")
        self._add_relation(mcu, chassis, m_meta.mountX, m_meta.mountY, m_meta.mountZ, m_meta.yaw, m_meta.pitch, m_meta.roll)
        self.payload.module_componets.append(mcu)

        # 5. Serialize
        comp_bytes = self.payload.SerializeToString()
        
        out_dir = tempfile.mkdtemp()
        safe_name = amr.robotName.replace(" ", "_").replace("/", "_")
        zip_path = os.path.join(out_dir, f"{safe_name}_ModelSet.cmodel")
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.writestr("CompDesc.model", comp_bytes)
            manifest = {
                "ModelFileDesc": [
                    {
                        "md5": hashlib.md5(comp_bytes).hexdigest(),
                        "name": "CompDesc.model",
                        "type": "MODEL_COMP",
                        "version": "1.0"
                    }
                ]
            }
            zf.writestr("ModelFileDesc.json", json.dumps(manifest, indent=4))
        return zip_path
