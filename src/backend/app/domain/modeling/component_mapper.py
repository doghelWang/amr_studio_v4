"""Component and attribute mappers for cmodel export payloads."""

import logging

from .component_general_attrs import build_component_general_attr
from .component_payload_builders import (
    build_component_extend_params,
    build_component_interface_groups,
    build_component_private_attrs,
)


logger = logging.getLogger(__name__)


def map_attribute_to_cmodel(attribute, is_ability=False):
    attr_type = attribute.get("type", "DATA_STRING")
    if is_ability:
        if attr_type == "DATA_FIXED_E":
            attr_type = "FIXED_E"
        elif attr_type == "DATA_COMBOX":
            attr_type = "DATA_COMBOX_E"

    base = {
        "key": attribute.get("key", ""),
        "type": attr_type,
        "desc": attribute.get("desc") or attribute.get("describer", ""),
        "unit": attribute.get("unit", ""),
        "boolParse": attribute.get("boolParse", True),
        "boolHide": attribute.get("boolHide", False),
        "boolBasic": attribute.get("boolBasic", True),
        "boolMustfill": attribute.get("boolMustfill", False),
        "boolNoeditable": attribute.get("boolNoeditable", False),
        "fixedSource": attribute.get("fixedSource", []),
    }
    value = attribute.get("value")
    value_type = attr_type

    if value is not None:
        if value_type == "DATA_DOUBLE":
            base["doubleValue"] = float(value)
        elif value_type == "DATA_FLOAT":
            base["floatValue"] = float(value)
        elif value_type == "DATA_INT32":
            base["int32Value"] = int(value)
        elif value_type == "DATA_UINT32":
            base["uint32Value"] = int(value)
        elif value_type == "DATA_INT64":
            base["int64Value"] = str(value)
        elif value_type == "DATA_UINT64":
            base["uint64Value"] = str(value)
        elif value_type == "DATA_BOOL":
            base["boolValue"] = bool(value)
        elif value_type == "DATA_STRING":
            base["stringValue"] = str(value)
        elif value_type == "DATA_IP":
            base["ipValue"] = str(value)
        elif value_type == "DATA_BYTES":
            base["bytesValue"] = value
        elif value_type == "DATA_FIXED_E":
            base["stringFix"] = str(value)
        elif value_type == "DATA_COMBOX":
            combo = attribute.get("comboType") or attribute.get("combo_type")
            if combo:
                base["comboType"] = {
                    "typeKey": combo.get("typeKey") or combo.get("type_key", ""),
                    "typeDesc": combo.get("typeDesc") or combo.get("type_desc", ""),
                    "typeGroups": [],
                }
                for group_data in combo.get("typeGroups") or combo.get("type_groups") or []:
                    group = {"key": group_data.get("key"), "desc": group_data.get("desc", "")}
                    target_key = "arrayAttr" if is_ability else "arrayCmobEle"
                    source_key = "arrayAttr" if is_ability else ("arrayCmobEle" if "arrayCmobEle" in group_data else "array_cmob_ele")
                    if source_key in group_data:
                        group[target_key] = [map_attribute_to_cmodel(sub, is_ability) for sub in group_data[source_key]]
                    base["comboType"]["typeGroups"].append(group)
    return base


def map_component_to_cmodel(component, identity=None):
    comp_type = component.get("type", "")
    comp_name = component.get("name", "").strip()
    general_attr, category, _ = build_component_general_attr(component, identity)

    logger.debug("Mapping component %s, category=%s, type=%s", comp_name, category, comp_type)
    extend_params = build_component_extend_params(component)
    private_attrs_for_pb = build_component_private_attrs(component, map_attribute_to_cmodel)
    interface_groups = build_component_interface_groups(component)

    return {
        "generalAttr": general_attr,
        "privateAttr": {"privateAttrs": private_attrs_for_pb},
        "interfaceAbility": component.get("interfaceAbility", {"busInterfaceAbility": []}),
        "interfaceParams": {"interfaceGroup": interface_groups},
        "structParam": {"extendParams": extend_params},
    }
