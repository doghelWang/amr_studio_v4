"""Payload builders for component export structures."""


def build_component_extend_params(component):
    return [
        {
            "key": "parentNodeUuid",
            "type": "DATA_COMBOX",
            "comboType": {"typeKey": component.get("parentNodeUuid", ""), "typeDesc": ""},
            "desc": "从属机构",
        },
        {
            "key": "locCoordX",
            "type": "DATA_DOUBLE",
            "doubleValue": float(component.get("mountX", 0)),
            "doubleMaxvalue": 9999.0,
            "doubleMinvalue": -9999.0,
            "unit": "mm",
            "desc": "X坐标",
        },
        {
            "key": "locCoordY",
            "type": "DATA_DOUBLE",
            "doubleValue": float(component.get("mountY", 0)),
            "doubleMaxvalue": 9999.0,
            "doubleMinvalue": -9999.0,
            "unit": "mm",
            "desc": "Y坐标",
        },
        {
            "key": "locCoordZ",
            "type": "DATA_DOUBLE",
            "doubleValue": float(component.get("mountZ", 0)),
            "doubleMaxvalue": 9999.0,
            "doubleMinvalue": -9999.0,
            "unit": "mm",
            "desc": "Z坐标",
        },
        {
            "key": "locCoordROLL",
            "type": "DATA_DOUBLE",
            "doubleValue": float(component.get("mountRoll", 0)),
            "doubleMaxvalue": 360.0,
            "doubleMinvalue": -360.0,
            "unit": "°",
            "desc": "ROLL",
        },
        {
            "key": "locCoordPITCH",
            "type": "DATA_DOUBLE",
            "doubleValue": float(component.get("mountPitch", 0)),
            "doubleMaxvalue": 360.0,
            "doubleMinvalue": -360.0,
            "unit": "°",
            "desc": "PITCH",
        },
        {
            "key": "locCoordYAW",
            "type": "DATA_DOUBLE",
            "doubleValue": float(component.get("mountYaw", 0)),
            "doubleMaxvalue": 360.0,
            "doubleMinvalue": -360.0,
            "unit": "°",
            "desc": "YAW",
        },
    ]


def build_component_private_attrs(component, attribute_mapper):
    return [
        {
            "key": group.get("key"),
            "desc": group.get("desc", ""),
            "arrayBaseEle": [attribute_mapper(element, False) for element in group.get("elements", [])],
        }
        for group in component.get("privateAttrs", [])
    ]


def build_component_interface_groups(component):
    interface_groups = []
    for interface in component.get("interfaces", []):
        mapped = {
                "key": interface.get("key", ""),
                "type": interface.get("type", ""),
                "path": interface.get("path", ""),
                "desc": interface.get("desc", ""),
                "interfaceUuid": interface.get("interfaceUuid", ""),
                "linkedInterfaceUuid": interface.get("linkedInterfaceUuid", []),
            }
        for key in ("linkAttrs", "interfaceAttrs", "interfaceParams"):
            if key in interface and interface[key] is not None:
                mapped[key] = interface[key]
        interface_groups.append(mapped)
    return interface_groups
