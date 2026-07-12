"""Diagnostics for visible fallback usage during cmodel construction."""

from dataclasses import asdict, dataclass

from .component_general_attrs import is_chassis_component, normalize_component_category
from .field_source_policy import FIELD_SOURCE_RULES, FallbackKind
from .module_mappings import CATEGORY_TO_SUBSYS, CATEGORY_TO_TYPE_KEY
from .module_templates import load_module_template


@dataclass(frozen=True)
class FallbackDiagnostic:
    severity: str
    code: str
    field_path: str
    fallback_kind: str
    component_id: str
    component_name: str
    message: str
    source: str
    risk: str


def _rule(field_path: str):
    return FIELD_SOURCE_RULES[field_path]


def _diagnostic(
    *,
    severity: str,
    code: str,
    field_path: str,
    component: dict,
    message: str,
) -> FallbackDiagnostic:
    rule = _rule(field_path)
    return FallbackDiagnostic(
        severity=severity,
        code=code,
        field_path=field_path,
        fallback_kind=rule.fallback_kind.value,
        component_id=component.get("id", ""),
        component_name=component.get("name", ""),
        message=message,
        source=rule.fallback_source,
        risk=rule.risk,
    )


def analyze_component_fallbacks(component: dict, identity: dict | None = None) -> list[FallbackDiagnostic]:
    diagnostics: list[FallbackDiagnostic] = []
    component_name = component.get("name", "").strip()
    raw_category = component.get("category", "")
    category = normalize_component_category(raw_category, component_name)
    component_id = component.get("id", "")
    component_type = component.get("type", "")
    is_chassis = is_chassis_component(category, component_id)
    template = load_module_template(component_type) if component_type and not is_chassis else None

    if not component_id:
        diagnostics.append(
            _diagnostic(
                severity="error",
                code="REQUIRED_MODULE_UUID_MISSING",
                field_path="generalAttr.moduleUuid",
                component=component,
                message="Component is missing id; moduleUuid is required and must come from frontend input.",
            )
        )

    if not component_name:
        diagnostics.append(
            _diagnostic(
                severity="warning",
                code="MODULE_NAME_EMPTY",
                field_path="generalAttr.moduleName",
                component=component,
                message="Component name is empty; moduleName cannot be semantically verified.",
            )
        )

    if raw_category != category:
        diagnostics.append(
            _diagnostic(
                severity="warning",
                code="CATEGORY_NORMALIZED",
                field_path="generalAttr.mainModuleType",
                component=component,
                message=f"Component category was normalized from '{raw_category}' to '{category}'.",
            )
        )

    if not template and not is_chassis:
        diagnostics.append(
            _diagnostic(
                severity="warning",
                code="MODULE_TEMPLATE_MISSING",
                field_path="generalAttr.mainModuleType",
                component=component,
                message=f"No module template found for component type '{component_type}'.",
            )
        )

    category_key = category.upper()
    if not is_chassis and category_key not in CATEGORY_TO_TYPE_KEY:
        diagnostics.append(
            _diagnostic(
                severity="warning",
                code="TYPE_MAPPING_DEFAULT_USED",
                field_path="generalAttr.mainModuleType",
                component=component,
                message=f"No type mapping registered for category '{category}'.",
            )
        )

    if category_key not in CATEGORY_TO_SUBSYS:
        diagnostics.append(
            _diagnostic(
                severity="warning",
                code="SUBSYSTEM_MAPPING_DEFAULT_USED",
                field_path="generalAttr.subSysType",
                component=component,
                message=f"No subsystem mapping registered for category '{category}'.",
            )
        )

    if not template and not is_chassis:
        diagnostics.append(
            _diagnostic(
                severity="warning",
                code="DEFAULT_MODULE_SHAPE_USED",
                field_path="generalAttr.moduleShape",
                component=component,
                message="Default ENUM_BOX 100x100x100 module shape will be used.",
            )
        )

    if is_chassis and identity is not None:
        missing_dimensions = [
            key
            for key in ("chassisLength", "chassisWidth", "chassisHeight")
            if key not in identity or identity.get(key) in (None, "")
        ]
        if missing_dimensions:
            diagnostics.append(
                _diagnostic(
                    severity="warning",
                    code="CHASSIS_DIMENSION_DEFAULT_USED",
                    field_path="generalAttr.moduleShape",
                    component=component,
                    message=f"Chassis dimensions missing: {', '.join(missing_dimensions)}.",
                )
            )

    missing_mount_fields = [
        key
        for key in ("mountX", "mountY", "mountZ", "mountRoll", "mountPitch", "mountYaw")
        if key not in component or component.get(key) in (None, "")
    ]
    if missing_mount_fields:
        diagnostics.append(
            _diagnostic(
                severity="info",
                code="MOUNT_FIELD_DEFAULT_USED",
                field_path="structParam.extendParams",
                component=component,
                message=f"Mount fields missing: {', '.join(missing_mount_fields)}.",
            )
        )

    if not component.get("interfaces"):
        diagnostics.append(
            _diagnostic(
                severity="info",
                code="EMPTY_INTERFACE_GROUP",
                field_path="interfaceParams.interfaceGroup",
                component=component,
                message="Component has no interface definitions.",
            )
        )

    return diagnostics


def collect_export_diagnostics(config: dict) -> list[dict]:
    identity = config.get("identity", {})
    diagnostics: list[FallbackDiagnostic] = []
    for component in config.get("components", []):
        diagnostics.extend(analyze_component_fallbacks(component, identity))

    if not config.get("abilities"):
        rule = FIELD_SOURCE_RULES["ability.functionAbility"]
        diagnostics.append(
            FallbackDiagnostic(
                severity="info",
                code="EMPTY_FUNCTION_ABILITY",
                field_path="ability.functionAbility",
                fallback_kind=FallbackKind.SCHEMA_DEFAULT.value,
                component_id="",
                component_name="",
                message="No ability definitions were provided.",
                source=rule.fallback_source,
                risk=rule.risk,
            )
        )

    return [asdict(diagnostic) for diagnostic in diagnostics]


def _combo_type_key(component: dict, field_name: str) -> str:
    combo = component.get("generalAttr", {}).get(field_name, {}).get("comboType", {})
    return combo.get("typeKey", "")


def _string_value(component: dict, field_name: str) -> str:
    return component.get("generalAttr", {}).get(field_name, {}).get("stringValue", "")


def _shape_box(component: dict) -> dict:
    return component.get("generalAttr", {}).get("moduleShape", {}).get("box", {})


def _extend_param_keys(component: dict) -> set[str]:
    params = component.get("structParam", {}).get("extendParams", [])
    return {item.get("key", "") for item in params if isinstance(item, dict)}


def _component_from_comp_desc_node(component: dict) -> dict:
    return {
        "id": _string_value(component, "moduleUuid"),
        "name": _string_value(component, "moduleName"),
    }


def analyze_comp_desc_component_fallbacks(component: dict) -> list[FallbackDiagnostic]:
    diagnostics: list[FallbackDiagnostic] = []
    diagnostic_component = _component_from_comp_desc_node(component)

    if not diagnostic_component["id"]:
        diagnostics.append(
            _diagnostic(
                severity="error",
                code="REQUIRED_MODULE_UUID_MISSING",
                field_path="generalAttr.moduleUuid",
                component=diagnostic_component,
                message="Resolved component is missing generalAttr.moduleUuid.",
            )
        )

    if not diagnostic_component["name"]:
        diagnostics.append(
            _diagnostic(
                severity="warning",
                code="MODULE_NAME_EMPTY",
                field_path="generalAttr.moduleName",
                component=diagnostic_component,
                message="Resolved component has an empty generalAttr.moduleName.",
            )
        )

    main_type = _combo_type_key(component, "mainModuleType")
    if main_type in ("", "unknown"):
        diagnostics.append(
            _diagnostic(
                severity="warning",
                code="TYPE_MAPPING_DEFAULT_USED",
                field_path="generalAttr.mainModuleType",
                component=diagnostic_component,
                message=f"Resolved component has weak mainModuleType '{main_type}'.",
            )
        )

    subsys_type = _combo_type_key(component, "subSysType")
    if subsys_type in ("", "UnclassifiedSys"):
        diagnostics.append(
            _diagnostic(
                severity="info",
                code="SUBSYSTEM_MAPPING_DEFAULT_USED",
                field_path="generalAttr.subSysType",
                component=diagnostic_component,
                message=f"Resolved component uses subsystem '{subsys_type}'.",
            )
        )

    box = _shape_box(component)
    if box and all(float(box.get(key, 0)) == 100.0 for key in ("sizeLen", "sizeWidth", "sizeHeight")):
        diagnostics.append(
            _diagnostic(
                severity="info",
                code="DEFAULT_MODULE_SHAPE_USED",
                field_path="generalAttr.moduleShape",
                component=diagnostic_component,
                message="Resolved component uses default ENUM_BOX 100x100x100 module shape.",
            )
        )

    required_mount_keys = {"locCoordX", "locCoordY", "locCoordZ", "locCoordROLL", "locCoordPITCH", "locCoordYAW"}
    missing_mount_keys = sorted(required_mount_keys - _extend_param_keys(component))
    if missing_mount_keys:
        diagnostics.append(
            _diagnostic(
                severity="warning",
                code="MOUNT_FIELD_MISSING",
                field_path="structParam.extendParams",
                component=diagnostic_component,
                message=f"Resolved component is missing mount params: {', '.join(missing_mount_keys)}.",
            )
        )

    interface_group = component.get("interfaceParams", {}).get("interfaceGroup", [])
    if not interface_group:
        diagnostics.append(
            _diagnostic(
                severity="info",
                code="EMPTY_INTERFACE_GROUP",
                field_path="interfaceParams.interfaceGroup",
                component=diagnostic_component,
                message="Resolved component has no interface groups.",
            )
        )

    return diagnostics


def collect_comp_desc_diagnostics(comp_desc: dict) -> list[dict]:
    diagnostics: list[FallbackDiagnostic] = []

    def visit(node: dict) -> None:
        components = node.get("module_componets") or node.get("moduleComponets") or []
        for component in components:
            diagnostics.extend(analyze_comp_desc_component_fallbacks(component))
        for child in node.get("moreModuleInfo") or node.get("more_module_info") or []:
            visit(child)

    visit(comp_desc)
    return [asdict(diagnostic) for diagnostic in diagnostics]
