"""Build module-list CSV rows from resolved component descriptions."""

from app.domain.modeling.module_mappings import CATEGORY_TO_TYPE_KEY


MODULE_LIST_HEADERS = [
    "模块名",
    "所属子系统",
    "子系统Key",
    "模块主类别",
    "主类别Key",
    "子类别",
    "子类别Key",
    "安装位置(X/Y/Z)",
    "旋转姿态(R/P/Y)",
]


def normalize_io_category(raw_category: str) -> str:
    if any(key in raw_category for key in ["INTERFACE", "IOMODULE", "IO_BOARD"]):
        return "IO"
    return raw_category


def collect_module_rows(node: dict, module_list_data: list[dict]) -> None:
    components = node.get("module_componets", []) or node.get("moduleComponets", [])
    for component in components:
        module_list_data.append(build_module_row(component))

    for child in node.get("moreModuleInfo", []) or node.get("more_module_info", []):
        collect_module_rows(child, module_list_data)


def build_module_row(component: dict) -> dict:
    general = component.get("generalAttr", {}) or component.get("general_attr", {})
    struct = component.get("structParam", {}) or component.get("struct_param", {})
    extend_params = struct.get("extendParams", []) or struct.get("extend_params", [])
    coords = {item.get("key"): item.get("doubleValue") or item.get("double_value", 0) for item in extend_params}

    module_name = general.get("moduleName", {}).get("stringValue") or general.get("module_name", {}).get("string_value") or "Unknown"
    main_desc, main_key = resolve_main_type(component, general)
    sub_desc, sub_key = resolve_sub_type(component, general)
    subsystem_desc, subsystem_key = resolve_subsystem(general)

    return {
        "模块名": module_name,
        "所属子系统": subsystem_desc,
        "子系统Key": subsystem_key,
        "模块主类别": main_desc,
        "主类别Key": main_key,
        "子类别": sub_desc,
        "子类别Key": sub_key,
        "安装位置(X/Y/Z)": f"{coords.get('locCoordX', 0)}/{coords.get('locCoordY', 0)}/{coords.get('locCoordZ', 0)}",
        "旋转姿态(R/P/Y)": f"{coords.get('locCoordROLL', 0)}/{coords.get('locCoordPITCH', 0)}/{coords.get('locCoordYAW', 0)}",
    }


def resolve_main_type(component: dict, general: dict):
    main_type = general.get("mainModuleType", {}) or general.get("main_module_type", {})
    main_desc = main_type.get("comboType", {}).get("typeDesc") or main_type.get("combo_type", {}).get("type_desc")
    main_key = main_type.get("comboType", {}).get("typeKey") or main_type.get("combo_type", {}).get("type_key")

    if not main_desc:
        raw_category = str(component.get("category") or general.get("moduleType", {}).get("stringValue") or "").upper()
        normalized_category = normalize_io_category(raw_category)
        main_config = CATEGORY_TO_TYPE_KEY.get(normalized_category, {"desc": "未知", "key": "unknown"})
        main_desc = main_config["desc"]
        main_key = main_config["key"]

    return main_desc, main_key


def resolve_sub_type(component: dict, general: dict):
    sub_type = general.get("subModuleType", {}) or general.get("sub_module_type", {})
    sub_desc = sub_type.get("comboType", {}).get("typeDesc") or sub_type.get("combo_type", {}).get("type_desc")
    sub_key = sub_type.get("comboType", {}).get("typeKey") or sub_type.get("combo_type", {}).get("type_key")

    if not sub_desc:
        sub_desc = (
            general.get("moduleType", {}).get("stringValue")
            or general.get("module_type", {}).get("string_value")
            or component.get("type", "Unknown")
        )
        sub_key = sub_desc

    return sub_desc, sub_key


def resolve_subsystem(general: dict):
    subsystem = general.get("subSysType", {}) or general.get("sub_sys_type", {})
    subsystem_desc = (
        subsystem.get("comboType", {}).get("typeDesc")
        or subsystem.get("combo_type", {}).get("type_desc")
        or "未分类系统"
    )
    subsystem_key = (
        subsystem.get("comboType", {}).get("typeKey")
        or subsystem.get("combo_type", {}).get("type_key")
        or "UnclassifiedSys"
    )
    return subsystem_desc, subsystem_key
