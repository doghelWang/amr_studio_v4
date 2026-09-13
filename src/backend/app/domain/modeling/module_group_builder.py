"""Builders for hierarchical module-group export structures."""


def build_module_group(component, all_components, identity, component_mapper):
    children = [item for item in all_components if item.get("parentNodeUuid") == component.get("id")]
    if component.get("id") == "chassis-root":
        group_name = "chassis_diff"
    else:
        group_name = component.get("name", "ModuleGroup").replace("module_", "").strip()

    return {
        "moduleGroupName": group_name,
        "moduleGroupUuid": component.get("id", ""),
        "module_componets": [component_mapper(component, identity)],
        "moreModuleInfo": [build_module_group(child, all_components, identity, component_mapper) for child in children],
    }


def build_frontend_comp_desc(config, module_group_builder):
    identity = config.get("identity", {})
    components = config.get("components", [])
    root_components = [component for component in components if not component.get("parentNodeUuid")]

    return {
        "moduleGroupName": identity.get("robotName", "Robot"),
        "modelVersion": "",
        "moreModuleInfo": [module_group_builder(component, components, identity) for component in root_components],
    }
