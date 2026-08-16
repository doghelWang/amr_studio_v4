"""Public cmodel export conversion entry points."""

from app.domain.modeling.ability_export import build_exported_abilities
from app.domain.modeling.component_mapper import map_attribute_to_cmodel, map_component_to_cmodel
from app.domain.modeling.fallback_diagnostics import collect_comp_desc_diagnostics, collect_export_diagnostics
from app.domain.modeling.module_group_builder import build_frontend_comp_desc, build_module_group


def map_module_group(component, all_components, identity=None):
    return build_module_group(component, all_components, identity, map_component_to_cmodel)


def frontend_to_comp_desc(config):
    return build_frontend_comp_desc(config, map_module_group)


def export_abilities(abilities):
    return build_exported_abilities(abilities, map_attribute_to_cmodel)
