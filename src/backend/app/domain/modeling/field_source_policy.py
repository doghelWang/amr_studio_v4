"""Field source and fallback policy registry for cmodel construction."""

from dataclasses import dataclass
from enum import Enum


class FallbackKind(str, Enum):
    REQUIRED = "required"
    USER_INPUT = "user_input"
    TEMPLATE_DEFAULT = "template_default"
    SCHEMA_DEFAULT = "schema_default"
    MAPPING_DEFAULT = "mapping_default"
    COMPAT_DEFAULT = "compat_default"


@dataclass(frozen=True)
class FieldSourceRule:
    field_path: str
    primary_source: str
    fallback_kind: FallbackKind
    fallback_source: str
    risk: str


FIELD_SOURCE_RULES = {
    "generalAttr.moduleName": FieldSourceRule(
        field_path="generalAttr.moduleName",
        primary_source="frontend component name or module template",
        fallback_kind=FallbackKind.USER_INPUT,
        fallback_source="component.name",
        risk="empty component names still need semantic validation",
    ),
    "generalAttr.moduleUuid": FieldSourceRule(
        field_path="generalAttr.moduleUuid",
        primary_source="frontend component id",
        fallback_kind=FallbackKind.REQUIRED,
        fallback_source="component.id",
        risk="missing ids can break module lookup and patch operations",
    ),
    "generalAttr.subSysType": FieldSourceRule(
        field_path="generalAttr.subSysType",
        primary_source="module template or category subsystem mapping",
        fallback_kind=FallbackKind.MAPPING_DEFAULT,
        fallback_source="CATEGORY_TO_SUBSYS or UnclassifiedSys compatibility default",
        risk="unclassified subsystem can hide unsupported categories",
    ),
    "generalAttr.mainModuleType": FieldSourceRule(
        field_path="generalAttr.mainModuleType",
        primary_source="module template or category type mapping",
        fallback_kind=FallbackKind.MAPPING_DEFAULT,
        fallback_source="CATEGORY_TO_TYPE_KEY or unknown compatibility default",
        risk="unknown main type can produce exportable but semantically weak output",
    ),
    "generalAttr.subModuleType": FieldSourceRule(
        field_path="generalAttr.subModuleType",
        primary_source="module template or specialized category rule",
        fallback_kind=FallbackKind.MAPPING_DEFAULT,
        fallback_source="category mapping, DRIVEWHEEL/IO/chassis compatibility rules",
        risk="special-case mapping must remain aligned with cmodel fixtures",
    ),
    "generalAttr.moduleShape": FieldSourceRule(
        field_path="generalAttr.moduleShape",
        primary_source="module template or chassis identity dimensions",
        fallback_kind=FallbackKind.COMPAT_DEFAULT,
        fallback_source="ENUM_BOX with 100x100x100 compatibility dimensions",
        risk="default dimensions can hide missing physical geometry",
    ),
    "structParam.extendParams": FieldSourceRule(
        field_path="structParam.extendParams",
        primary_source="frontend mount fields",
        fallback_kind=FallbackKind.COMPAT_DEFAULT,
        fallback_source="zero coordinates and zero attitude",
        risk="zero pose can hide missing mount data",
    ),
    "interfaceParams.interfaceGroup": FieldSourceRule(
        field_path="interfaceParams.interfaceGroup",
        primary_source="frontend interfaces",
        fallback_kind=FallbackKind.SCHEMA_DEFAULT,
        fallback_source="empty list",
        risk="empty interfaces may be valid for some components but should be schema-checked",
    ),
    "ability.functionAbility": FieldSourceRule(
        field_path="ability.functionAbility",
        primary_source="frontend abilities",
        fallback_kind=FallbackKind.SCHEMA_DEFAULT,
        fallback_source="empty list",
        risk="empty ability list may hide missing ability configuration",
    ),
    "moduleList.mainType": FieldSourceRule(
        field_path="moduleList.mainType",
        primary_source="resolved blueprint generalAttr.mainModuleType",
        fallback_kind=FallbackKind.MAPPING_DEFAULT,
        fallback_source="moduleType/category mapped through CATEGORY_TO_TYPE_KEY",
        risk="CSV audit output can inherit weak fallback semantics",
    ),
}


def get_field_source_rule(field_path: str) -> FieldSourceRule:
    return FIELD_SOURCE_RULES[field_path]


def list_rules_by_fallback_kind(fallback_kind: FallbackKind) -> list[FieldSourceRule]:
    return [rule for rule in FIELD_SOURCE_RULES.values() if rule.fallback_kind == fallback_kind]
