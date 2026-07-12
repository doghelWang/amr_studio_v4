"""Public cmodel export conversion entry points."""

from .ability_export_builder import build_exported_abilities
from .cmodel_component_mapper import map_attribute_to_cmodel, map_component_to_cmodel
from .fallback_diagnostics import collect_comp_desc_diagnostics, collect_export_diagnostics
from .module_group_builder import build_frontend_comp_desc, build_module_group


def map_module_group(component, all_components, identity=None):
    return build_module_group(component, all_components, identity, map_component_to_cmodel)


def frontend_to_comp_desc(config):
    return build_frontend_comp_desc(config, map_module_group)


def export_abilities(abilities):
    return build_exported_abilities(abilities, map_attribute_to_cmodel)
