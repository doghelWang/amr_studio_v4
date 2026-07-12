"""Compatibility façade for legacy resource adapter imports."""

from .cmodel_component_mapper import map_attribute_to_cmodel, map_component_to_cmodel
from .cmodel_export_adapter import collect_comp_desc_diagnostics, collect_export_diagnostics, export_abilities, frontend_to_comp_desc, map_module_group
from .module_mappings import CATEGORY_TO_SUBSYS, CATEGORY_TO_TYPE_KEY, CHASSIS_GENERAL_ATTR_TEMPLATE
from .xml_component_adapter import xml_to_component_json
