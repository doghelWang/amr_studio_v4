"""Component and attribute mappers for cmodel export payloads."""

import logging

from .component_general_attrs import build_component_general_attr
from .component_payload_builders import (
    build_component_extend_params,
    build_component_interface_groups,
    build_component_private_attrs,
)


logger = logging.getLogger(__name__)


ABI_ATTRIBUTE_TYPE_MAP = {
    "DATA_BYTES": "BYTES_E",
    "DATA_STRING": "STRING_E",
    "DATA_IP": "IP_E",
    "DATA_BOOL": "BOOL_E",
    "DATA_INT32": "INT32_E",
    "DATA_UINT32": "UINT32_E",
    "DATA_INT64": "INT64_E",
    "DATA_UINT64": "UINT64_E",
    "DATA_FLOAT": "FLOAT_E",
    "DATA_DOUBLE": "DOUBLE_E",
    "DATA_FIXED_E": "FIXED_E",
    "DATA_COMBOX": "DATA_COMBOX_E",
}


def _map_ability_array_param(array_param):
    if not isinstance(array_param, dict):
        return None
    return {
        "groupKey": array_param.get("groupKey", ""),
        "groupName": array_param.get("groupName", ""),
        "attrParams": [
            map_attribute_to_cmodel(attribute, True)
            for attribute in array_param.get("attrParams", [])
        ],
    }


def _map_ability_combo_param(attribute):
    combo_param = attribute.get("comboxParam") or attribute.get("combox_param")
    if not isinstance(combo_param, dict):
        return None
    options = combo_param.get("options", [])
    elements = []
    for option in options:
        option_array = option.get("arrayAttr") or option.get("array_attr") or []
        elements.append({
            "key": option.get("key", ""),
            "desc": option.get("desc", ""),
            "arrayAttr": [{
                "groupKey": attribute.get("key", ""),
                "groupName": combo_param.get("desc", ""),
                "attrParams": [map_attribute_to_cmodel(item, True) for item in option_array],
            }] if option_array else [],
            "comboxAttr": [],
        })
    return {
        "key": combo_param.get("key", ""),
        "desc": combo_param.get("desc", ""),
        "tips": combo_param.get("tips", ""),
        "comboxSource": combo_param.get("comboxSource", "CUSTOM_E"),
        "customCombox": {
            "element": elements,
            "defaultSelect": combo_param.get("value", ""),
        },
    }


def map_attribute_to_cmodel(attribute, is_ability=False):
    raw_type = attribute.get("type", "DATA_STRING")
    attr_type = raw_type
    if is_ability:
        if raw_type in ("ARRAY", "ARRAY_E"):
            attr_type = "ARRAY_E"
        elif raw_type in ("COMBOX", "COMBOX_E"):
            attr_type = "COMBOX_E"
        else:
            attr_type = ABI_ATTRIBUTE_TYPE_MAP.get(raw_type, raw_type)

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
    if is_ability and raw_type in ("ARRAY", "ARRAY_E"):
        array_param = _map_ability_array_param(attribute.get("arrayParam") or attribute.get("array_param"))
        if array_param is not None:
            base["arrayParam"] = array_param
        return base
    if is_ability and raw_type in ("COMBOX", "COMBOX_E"):
        combo_param = _map_ability_combo_param(attribute)
        if combo_param is not None:
            base["comboxParam"] = combo_param
        return base
    value = attribute.get("value")
    value_type = raw_type

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
                    source_key = (
                        "arrayAttr" if is_ability and "arrayAttr" in group_data
                        else ("arrayCmobEle" if "arrayCmobEle" in group_data else "array_cmob_ele")
                    )
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
