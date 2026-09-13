"""XML component template parsing helpers."""

import xml.etree.ElementTree as ET


def xml_to_component_json(xml_path):
    tree = ET.parse(xml_path)
    root = tree.getroot()
    components = []
    for component in root.findall(".//Component"):
        identity = component.find("Identity")
        name = identity.get("name") if identity is not None else "Unknown"
        components.append(
            {
                "generalAttr": {
                    "moduleName": {"stringValue": name.strip()},
                    "subSysType": {"comboType": {"typeKey": component.get("category")}},
                }
            }
        )
    return {"moduleGroupName": root.get("name", "Unknown"), "module_componets": components}
