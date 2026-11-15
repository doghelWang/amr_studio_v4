/**
 * TypeScript shapes of the decoded protobuf messages (field names kept exactly as in proto/*.proto).
 * These objects ARE the model: the app edits them in place and re-encodes them.
 */
export const DataType = {
  BYTES: 0, STRING: 1, IP: 3, BOOL: 4, INT32: 5, UINT32: 6, INT64: 7, UINT64: 8,
  FLOAT: 9, DOUBLE: 10, COMBOX: 11, FIXED_E: 12,
} as const;
export const DataTypeName: Record<number, string> = {
  0: 'bytes', 1: 'string', 3: 'ip', 4: 'bool', 5: 'int32', 6: 'uint32', 7: 'int64', 8: 'uint64',
  9: 'float', 10: 'double', 11: 'combo', 12: 'fixed',
};

export interface ComboItem { key: string; desc: string; array_cmob_ele: BaseElement[] }
export interface ComboType { type_key: string; type_desc: string; type_groups: ComboItem[] }

export interface BaseElement {
  key: string; type: number;
  string_value?: string; bool_value?: boolean; int32_value?: number; uint32_value?: number;
  int64_value?: unknown; uint64_value?: unknown; float_value?: number; double_value?: number;
  bytes_value?: Uint8Array; ip_value?: string; string_fix?: string; combo_type?: ComboType;
  unit: string; desc: string;
  bool_parse: boolean; bool_hide: boolean; bool_noeditable: boolean; bool_mustfill: boolean; bool_basic: boolean;
  fixed_source: string[];
  [k: string]: unknown;
}
export interface GroupElement { key: string; desc: string; array_base_ele: BaseElement[]; bool_deprecated: boolean }
export interface ModuleShape {
  shape_type: number;
  sphere?: { diameter: number }; box?: { size_len: number; size_width: number; size_height: number };
  cylinder?: { diameter: number; height: number };
}
export interface GeneralAttr {
  module_name?: BaseElement; module_desc?: BaseElement; module_uuid?: BaseElement; version_info?: BaseElement;
  module_3d_icon?: BaseElement; sub_sys_type?: BaseElement; main_module_type?: BaseElement;
  sub_module_type?: BaseElement; vender_name?: BaseElement; module_dsc_type?: BaseElement; module_icon?: BaseElement;
  module_shape?: ModuleShape; extend_params: BaseElement[];
}
export interface InterfaceAttribute { interface_params_array: BaseElement[] }
export interface InterfaceGroup {
  key: string; type: string; path: string; desc: string; interface_uuid: string;
  linked_interface_uuid: string[]; link_attrs: ComboItem[];
  interface_attrs?: InterfaceAttribute; interface_params?: InterfaceAttribute;
}
export interface BusAbility { bus_interface_type: string; bus_interface_sub_type: string; bus_interface_nums: number }
export interface Component {
  general_attr?: GeneralAttr;
  private_attr?: { private_attrs: GroupElement[] };
  interface_ability?: { bus_interface_ability: BusAbility[] };
  interface_params?: { interface_Group: InterfaceGroup[]; node_pos_x: number; node_pos_y: number };
  struct_param?: { extend_params: BaseElement[]; segmented_limits_params: GroupElement[] };
  bool_deprecated: boolean; bool_disable: boolean;
}
export interface ModuleInfo {
  module_group_name: string; module_group_uuid: string; module_sys: string;
  module_componets: Component[]; more_module_info: ModuleInfo[]; model_version: string;
}

/* FuncDesc (Robot_Description) */
export interface FuncAttribute {
  key: string; type: number;
  string_value?: string; bool_value?: boolean; int32_value?: number; uint32_value?: number;
  int64_value?: unknown; uint64_value?: unknown; float_value?: number; double_value?: number;
  bytes_value?: Uint8Array; string_fix?: string; combo_type?: { type_key: string; [k: string]: unknown };
  fixedSource: string[]; unit: string;
  [k: string]: unknown;
}
export interface FuncArrayAttr { group_key: string; group_name: string; option: number; attr_params: FuncAttribute[] }
export interface FuncComboAttr { comb_name: string; key: string; desc: string; array_attr: FuncArrayAttr[]; combox_attr: FuncComboAttr[] }
export interface FuncCommonAttr { key: string; type: number; combox_param?: FuncComboAttr; array_param?: FuncArrayAttr; clone_enable: boolean }
export interface ChildFunction { type: string; desc: string; key: string; attr: FuncCommonAttr[] }
export interface RobotFunction { type: string; desc: string; child_function: ChildFunction[] }
export interface RobotDescription { version: string; function: RobotFunction[] }
