# AMR Studio V4 文件职责索引

日期：2026-07-12

本索引覆盖主要源码、配置、skill 和测试文件；大量资源库 XML/JSON 在主报告中按目录说明。

| 文件 | 职责 | 主要类/接口 | 主要函数/导出 |
| --- | --- | --- | --- |
| `cloudflare/generated/protobuf_models.d.ts` | protobufjs 静态生成 runtime/type 文件。 | Message_Combox_Item, Message_Combox_Type, Message_Base_Element, Message_Base_Group_Element, Message_Sphere, Message_BOX, Message_CYLINDER, Message_Module_Shape | - |
| `cloudflare/generated/protobuf_models.js` | protobufjs 静态生成 runtime/type 文件。 | IMessage_Combox_Item, IMessage_Combox_Type, IMessage_Base_Element, IMessage_Base_Group_Element, IMessage_Sphere, IMessage_BOX, IMessage_CYLINDER, IMessage_Module_Shape | create, encode, encodeDelimited, decode, decodeDelimited, verify, fromObject, toObject, toJSON, getTypeUrl |
| `cloudflare/node-server.ts` | Node 运行适配层，以文件系统模拟 Worker Assets/KV 并调用同一个 Worker fetch。 | - | encodeKey, decodeKey, keyDataPath, keyMetaPath, safeReadJson, files, contentTypeFor |
| `cloudflare/worker.ts` | Cloudflare Worker 后端主实现，承载 API、KV sandbox、protobuf decode/encode、cmodel 编译下载。 | - | jsonResponse, optionsResponse, notMigratedResponse, notFoundResponse, fetchAssetJson, readAssetJson, getSavedProjectName, projectKey, sandboxKey, artifactKey |
| `src/backend/app/__init__.py` | 项目文件。 | - | - |
| `src/backend/app/config.py` | Python 后端路径、版本和目录配置。 | BackendConfig | load_backend_config |
| `src/backend/app/errors.py` | Python 全局异常处理。 | - | global_exception_handler |
| `src/backend/app/schemas/__init__.py` | Python API 请求/响应 schema。 | - | - |
| `src/backend/app/schemas/request_models.py` | Python API 请求/响应 schema。 | InitSandboxRequest, SaveProjectRequest | - |
| `src/backend/app/services/__init__.py` | Python FastAPI 服务层模块，封装具体业务 API 操作。 | - | - |
| `src/backend/app/services/compile_service.py` | Python FastAPI 服务层模块，封装具体业务 API 操作。 | - | compile_project |
| `src/backend/app/services/debug_artifacts.py` | Python FastAPI 服务层模块，封装具体业务 API 操作。 | - | create_debug_artifact_dir, write_debug_json, copy_debug_file, copy_debug_tree, project_relative_path |
| `src/backend/app/services/model_service.py` | Python FastAPI 服务层模块，封装具体业务 API 操作。 | - | get_component, update_component, get_abilities, get_functions, normalize_abilities_payload, update_abilities |
| `src/backend/app/services/module_list_builder.py` | Python FastAPI 服务层模块，封装具体业务 API 操作。 | - | normalize_io_category, collect_module_rows, build_module_row, resolve_main_type, resolve_sub_type, resolve_subsystem |
| `src/backend/app/services/project_service.py` | Python FastAPI 服务层模块，封装具体业务 API 操作。 | - | initialize_project_sandbox, list_saved_projects, save_user_project_config, load_user_project_config |
| `src/backend/app/services/resource_service.py` | Python FastAPI 服务层模块，封装具体业务 API 操作。 | - | list_boards, list_schemas |
| `src/backend/app/services/system_service.py` | Python FastAPI 服务层模块，封装具体业务 API 操作。 | - | get_system_version |
| `src/backend/app/services/upload_service.py` | Python FastAPI 服务层模块，封装具体业务 API 操作。 | - | upload_cmodel_to_project |
| `src/backend/core/__init__.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | - |
| `src/backend/core/ability_export_builder.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | build_exported_abilities, build_function_ability, build_child_function |
| `src/backend/core/cmodel_component_mapper.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | map_attribute_to_cmodel, map_component_to_cmodel |
| `src/backend/core/cmodel_export_adapter.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | map_module_group, frontend_to_comp_desc, export_abilities |
| `src/backend/core/component_general_attrs.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | normalize_component_category, is_chassis_component, build_component_general_attr, apply_general_attr_defaults |
| `src/backend/core/component_payload_builders.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | build_component_extend_params, build_component_private_attrs, build_component_interface_groups |
| `src/backend/core/data_manager.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | get_project_dir, init_project, ensure_module_in_project, update_component, update_ability, update_function, get_component, get_ability, get_function |
| `src/backend/core/fallback_diagnostics.py` | Python 后端领域核心/映射/持久化/诊断模块。 | FallbackDiagnostic | analyze_component_fallbacks, collect_export_diagnostics, analyze_comp_desc_component_fallbacks, collect_comp_desc_diagnostics, visit |
| `src/backend/core/field_source_policy.py` | Python 后端领域核心/映射/持久化/诊断模块。 | FallbackKind, FieldSourceRule | get_field_source_rule, list_rules_by_fallback_kind |
| `src/backend/core/mapping_registry.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | to_property_object |
| `src/backend/core/model_parser.py` | Python 后端领域核心/映射/持久化/诊断模块。 | ModelParser | parse_modelset, get_comp_desc_from_binary |
| `src/backend/core/module_group_builder.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | build_module_group, build_frontend_comp_desc |
| `src/backend/core/module_mappings.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | - |
| `src/backend/core/module_templates.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | load_module_template |
| `src/backend/core/project_repository.py` | Python 后端领域核心/映射/持久化/诊断模块。 | ProjectRepository | atomic_write_json, deep_update, get_project_dir, init_project, ensure_module_in_project, update_component, update_ability, update_function, get_component, get_ability |
| `src/backend/core/protobuf_engine.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | generate_industrial_modelset |
| `src/backend/core/protobuf_navigator.py` | Python 后端领域核心/映射/持久化/诊断模块。 | ProtoNavigator | float_to_uint64, deep_patch, find_block_by_key, update_int_param, safe_get_path |
| `src/backend/core/resource_adapter.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | - |
| `src/backend/core/schema_builder.py` | Python 后端领域核心/映射/持久化/诊断模块。 | CModelProperty, CustomCompDescBuilder | make_uuid, string, double, int32, combox, build_from_payload |
| `src/backend/core/schema_manager.py` | Python 后端领域核心/映射/持久化/诊断模块。 | SchemaManager | load_all, get_registry |
| `src/backend/core/xml_component_adapter.py` | Python 后端领域核心/映射/持久化/诊断模块。 | - | xml_to_component_json |
| `src/backend/skills_v2/__init__.py` | 项目文件。 | - | - |
| `src/backend/skills_v2/cmodel_decoder/__init__.py` | Python cmodel 解码工具链。 | - | - |
| `src/backend/skills_v2/cmodel_decoder/decoder.py` | Python cmodel 解码工具链。 | - | decode_cmodel |
| `src/backend/skills_v2/cmodel_decoder/decoder_cli.py` | Python cmodel 解码工具链。 | - | - |
| `src/backend/skills_v2/cmodel_encoder/__init__.py` | Python cmodel 编码打包工具链。 | - | - |
| `src/backend/skills_v2/cmodel_encoder/encoder.py` | Python cmodel 编码打包工具链。 | - | get_md5, sanitize_values, proto_final_sync, resolve_with_fidelity, proto_sync_abi_desc, standardize_sys_tree, encode_cmodel, collect_all_groups |
| `src/backend/skills_v2/model_splitter/__init__.py` | Python CompDesc 拆分工具。 | - | - |
| `src/backend/skills_v2/model_splitter/splitter.py` | Python CompDesc 拆分工具。 | - | split_comp_desc, recurse |
| `src/backend/skills_v2/schemas_pb/__init__.py` | Python protobuf 生成/运行时文件。 | - | - |
| `src/backend/skills_v2/schemas_pb/abi_desc_runtime.py` | Python protobuf 生成/运行时文件。 | - | - |
| `src/backend/skills_v2/schemas_pb/abi_set_runtime.py` | Python protobuf 生成/运行时文件。 | - | - |
| `src/backend/skills_v2/schemas_pb/comp_desc_runtime.py` | Python protobuf 生成/运行时文件。 | - | - |
| `src/backend/skills_v2/schemas_pb/controller_model_abi_desc_pb2.py` | Python protobuf 生成/运行时文件。 | - | - |
| `src/backend/skills_v2/schemas_pb/controller_model_abi_set_pb2.py` | Python protobuf 生成/运行时文件。 | - | - |
| `src/backend/skills_v2/schemas_pb/controller_model_comp_desc_pb2.py` | Python protobuf 生成/运行时文件。 | - | - |
| `src/frontend/src/App.tsx` | 前端入口、样式、主题或版本模块。 | - | getBackendUrl, App, handleImportClick, handler, handler, printAudit, handleImport, handleCreateNew, handleSave, handleLoadSaved |
| `src/frontend/src/DynamicAntdProvider.tsx` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Func_Setting/RelatedCollision.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Func_Setting/RelatedEmcyBtn.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Func_Setting/RelatedManualBtn.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Func_Setting/RelatedResetBtn.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Func_Setting/RelatedSSBtn.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/General_Attr/Module_General_Attr_Tem.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/AI/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/AO/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/BAR/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/BAT/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/CAN/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/DI/DI0/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/DI/DI1/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/DI/DI2/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/DI/DI3/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/DO/DO0/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/DO/DO1/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/DO/DO2/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/DO/DO3/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/ENCR/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/ETH/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/GRAV/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/HDMI/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/LIN/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/LINE/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/LVDS/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/PI/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/PO/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/PWM/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/PZTB/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/RS232/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/RS422/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/RS485/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/SMA/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/SPI/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/SPK/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/UART/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Attr/USB/InterfaceFixAttr.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/AI/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/AO/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/BAR/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/BAT/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/CAN/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/DI/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/DO/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/ENCR/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/ETH/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/GRAV/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/HDMI/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/LIN/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/LINE/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/LVDS/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/PI/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/PO/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/PWM/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/PZTB/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/RS232/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/RS422/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/RS485/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/SMA/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/SPI/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/SPK/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/UART/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/USB/InterfaceParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/3DLaser/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/ABZEncode/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/BDCMotor/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/BLDCMotor/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/HYD/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/IOModule/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/PIO/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/PMSMMotor/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/PT/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/RFID/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/TOF/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/TOFCamera/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/TOFProcessor/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/WAPI/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/WIFI/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/absoluteValueEncode/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/airPressureProcessor/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/audioIn/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/audioOut/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/binocularCameraProcessor/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/block/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/bluetooth/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/camera/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/carrier/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/charge/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/clamp/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/codeReader/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/collisionBaro/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/collisionPize/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/comDo/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/covers/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/diffChassis/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/diffSteerWheel/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/diffWheel/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/encoderProcessor/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/ethernetSwitch/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/fifthGeneration/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/generalAnalogDistance/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/gyro/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/horizontalSteerWheel/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/incrementalEncode/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/infrared/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/interfaceModule/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/lamp/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/laser/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/lift/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/linear/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/power/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/powerController/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/prechargeController/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/proximitySensor/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/pullWireEncode/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/rotate/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/safetyController/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/safetyIOModule/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/segDisplays/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/servo/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/steerChassis/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/stereo/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/subBattery/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/subButton/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/subDriver/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/subHandOperator/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/subIntergratedController/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/subMainCPU/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/subScreen/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/tempSensor/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/translation/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/ultrasonicProcessor/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/ultrasonicSensor/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/valveCtrl/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/verticalSteerWheel/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/warningLight/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/weakSteerWheel/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/weakTurnWheel/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/weighProcessor/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/weighSensor/PrivateAttribute.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Struct_Param/AcotrStructParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Struct_Param/CodeReaderStructParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Struct_Param/GeneralStructParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Struct_Param/GyroStructParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Struct_Param/MainCpuStructParam.json` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/components/VersionInfo.tsx` | React UI 组件。 | BackendVersion | fetchBackendVersion, formatDate, shortenCommit, calculateUptime |
| `src/frontend/src/components/WelcomeScreen.tsx` | React UI 组件。 | Props | fetchSaved, handleFileChange |
| `src/frontend/src/components/common/SmartForm.tsx` | React UI 组件。 | SmartFormProps, SmartFormGroupedProps | handleChange, renderField |
| `src/frontend/src/components/layout/Header.tsx` | React UI 组件。 | HeaderProps | handleSave |
| `src/frontend/src/components/layout/Sidebar.tsx` | React UI 组件。 | SidebarProps | formatDate |
| `src/frontend/src/components/visualizer/ChassisVisualizer.tsx` | React UI 组件。 | Props | - |
| `src/frontend/src/components/visualizer/CoordinateVisualizer.tsx` | React UI 组件。 | ViewProps, CoordinateVisualizerProps | getThemeColors, projectPoint, isoX, isoY, renderChassis, archDepth, archWidth, centerPx, centerPy, renderWheel |
| `src/frontend/src/components/wizard/AbilityStep.tsx` | React UI 组件。 | - | transformAbilityAttr, transformComboxAttr, createAttributeUpdater |
| `src/frontend/src/components/wizard/AuditStep.tsx` | React UI 组件。 | const | runAudit, validateAttr, activeGroup, checkAbilityAttr, handleExport, Divider |
| `src/frontend/src/components/wizard/ChassisStep.tsx` | React UI 组件。 | - | handleUpdate, handleOffsetChange, renderHeaderField |
| `src/frontend/src/components/wizard/ComponentLibraryStep.tsx` | React UI 组件。 | - | normalizeLibraryCategory, rawLower, getSubCategories, subKey, collectChildren, handlePrepareAdd, handleManualAdd, handleConfirmAdd, getModuleType, comp |
| `src/frontend/src/components/wizard/ComponentPropertyPanel.tsx` | React UI 组件。 | Props | syncPrivateAttrs, handleValueUpdate, updateInTree, isElementVisible, rawKey, renderAttribute, renderGroup, moduleName, linkedUuid |
| `src/frontend/src/components/wizard/IdentityStep.tsx` | React UI 组件。 | - | handleUpdate |
| `src/frontend/src/components/wizard/MountingStep.tsx` | React UI 组件。 | - | - |
| `src/frontend/src/components/wizard/PowerSystemStep.tsx` | React UI 组件。 | - | alias, subType, buildTree, getWheelGroupAndKey, hasAttr, bindWheelAttr, nextPowerIndex, addPowerChain, addEncoderToSelectedWheel, removeSelectedPowerNode |
| `src/frontend/src/components/wizard/PowerTopologyCanvas.tsx` | React UI 组件。 | PowerTopologyCanvasProps | chassisW, chassisL, headOffset, leftOffset, getAssociated, wx |
| `src/frontend/src/components/wizard/PowerTopologyPanel.tsx` | React UI 组件。 | - | isWheel, isDriver, isMotor, isEncoder |
| `src/frontend/src/components/wizard/RecursiveAttributeEditor.tsx` | React UI 组件。 | ComponentConfig, RecursiveAttributeEditorProps | isHardwareMapping, isComboxType, extractComboxData, handleChange, handleChange, handleSelectChange |
| `src/frontend/src/components/wizard/WheelTypeDiagrams.tsx` | React UI 组件。 | - | - |
| `src/frontend/src/components/wizard/WiringStep.tsx` | React UI 组件。 | - | getBusTheme, getTargetType, isLinked, handleCreateConnection, visible |
| `src/frontend/src/main.tsx` | 前端入口、样式、主题或版本模块。 | - | - |
| `src/frontend/src/services/ExportService.ts` | 前端 API/导出服务模块。 | ExportService, ValidationRule | validateExport |
| `src/frontend/src/services/api_v2.ts` | 前端 API/导出服务模块。 | - | getBackendBase, apiFetchComponentDetails, apiUpdateComponent, apiFetchAbilities, apiFetchFunctions, apiUpdateAbilities, apiInitSandbox, apiCompileAndDownload, apiFetchSchemas, apiFetchBoardXml |
| `src/frontend/src/store/ImportService.ts` | 前端状态、类型、schema 或导入解析模块。 | ImportService | findVal, search, functions |
| `src/frontend/src/store/PerformanceConfig.ts` | 前端状态、类型、schema 或导入解析模块。 | FullLoadRatios | isLegacyDefault, detectSyncMode, calculateFullLoadValue, to, getFullLoadValue |
| `src/frontend/src/store/SchemaDefaults.ts` | 前端状态、类型、schema 或导入解析模块。 | - | extractDefaultsFromSchema, loadSchemaDefaults, getChassisSchemaDefaults, getDefaultOffset, preloadSchemaDefaults |
| `src/frontend/src/store/SchemaEngine.ts` | 前端状态、类型、schema 或导入解析模块。 | EngineeringConstraint, FixedSourceFilter | getAvailableSubTypes, isValidSubType, getValidSubType, getEngineeringConstraints, getPresetOptions, getTooltip, maps, parseFixedSource, buildAttributesFromSchema, transformElement |
| `src/frontend/src/store/abilityGuards.ts` | 前端状态、类型、schema 或导入解析模块。 | - | isComboxAttribute, isArrayAttribute, isHardwareMappingAttribute, extractComboxConfig, extractSubElements, getAttributeValue, normalizeToSmartAttribute |
| `src/frontend/src/store/ability_registry.json` | 前端状态、类型、schema 或导入解析模块。 | - | - |
| `src/frontend/src/store/domain/electrical.ts` | 前端领域逻辑模块。 | - | normalizeInterfaceType, upper, classifyConnectionKind, getConnectionDirection, getConnectionMultiplicity, buildInterfaceIndex, createConnectionId, validateInterfaceConnection, inverseIoAllowed, analogInverseAllowed |
| `src/frontend/src/store/domain/functions.ts` | 前端领域逻辑模块。 | - | parseFunctionProcesses, summarizeFunctionProcesses |
| `src/frontend/src/store/master_registry.json` | 前端状态、类型、schema 或导入解析模块。 | - | - |
| `src/frontend/src/store/types.d.ts` | 前端状态、类型、schema 或导入解析模块。 | SmartAttribute, AttributeGroup, InterfaceConfig, ComponentConfig, RobotIdentity, AbilityAttribute, AbilityArrayAttr, AbilityCommonAttr | - |
| `src/frontend/src/store/types.extended.ts` | 前端状态、类型、schema 或导入解析模块。 | - | isComboxType, normalizeAttributeDataType |
| `src/frontend/src/store/types.js` | 前端状态、类型、schema 或导入解析模块。 | - | - |
| `src/frontend/src/store/types.ts` | 前端状态、类型、schema 或导入解析模块。 | SmartAttribute, AttributeGroup, InterfaceConfig, instance, ComponentConfig, RobotIdentity, AbilityAttribute, AbilityArrayAttr | - |
| `src/frontend/src/store/useProjectStore.ts` | 前端状态、类型、schema 或导入解析模块。 | ProjectState, injection | createDefaultIdentity, createDefaultChassis, createDefaultProjectConfig, syncChassisAttributes, updateNestedAbilityOption, updateAbilityLeafAttribute, updateAbilityCommonAttribute, updateNestedAttributeValue, tryInjectInterfaces, isInterfaceOccupied |
| `src/frontend/src/store/useStore.ts` | 前端状态、类型、schema 或导入解析模块。 | McuConfig, IoBoardConfig, WheelConfig, SensorConfig, IOConfig, AppState | generateId, defaultWheels |
| `src/frontend/src/store/useThemeStore.tsx` | 前端状态、类型、schema 或导入解析模块。 | to, ThemeContextType | setTheme, toggleTheme, useTheme |
| `src/frontend/src/store/useUIStore.ts` | 前端状态、类型、schema 或导入解析模块。 | UIState | - |
| `src/frontend/src/store/useVersionInfoStore.ts` | 前端状态、类型、schema 或导入解析模块。 | SystemVersionInfo, VersionInfoState | getBackendBase, formatDateTime, getClientStartTime |
| `src/frontend/src/version.ts` | 前端入口、样式、主题或版本模块。 | - | - |
| `skills/amr-cmodel-reader/SKILL.md` | 解析理解 cmodel 的 Codex skill 文件或脚本。 | - | - |
| `skills/amr-cmodel-reader/references/reader-rules.md` | 解析理解 cmodel 的 Codex skill 文件或脚本。 | - | - |
| `skills/amr-cmodel-reader/scripts/read_cmodel.py` | 解析理解 cmodel 的 Codex skill 文件或脚本。 | - | sha256, value_of, combo_key, classify_amr, collect_components, extend_params, interfaces, flatten_base_elements, private_attribute_rows, electrical_attribute_rows |
| `skills/amr-cmodel-builder/SKILL.md` | 基于显式输入生成 cmodel 的 Codex skill 文件或脚本。 | - | - |
| `skills/amr-cmodel-builder/references/builder-input-schema.md` | 基于显式输入生成 cmodel 的 Codex skill 文件或脚本。 | - | - |
| `skills/amr-cmodel-builder/scripts/build_cmodel_from_input.py` | 基于显式输入生成 cmodel 的 Codex skill 文件或脚本。 | - | load_input, validate, has_errors, build, main |
| `skills/amr-cmodel-pipeline/SKILL.md` | cmodel 解析/构建/验证流水线 skill 文件或脚本。 | - | - |
| `skills/amr-cmodel-pipeline/references/constraints.md` | cmodel 解析/构建/验证流水线 skill 文件或脚本。 | - | - |
| `skills/amr-cmodel-pipeline/scripts/cmodel_artifact_check.py` | cmodel 解析/构建/验证流水线 skill 文件或脚本。 | - | main |
| `skills/amr-cmodel-pipeline/scripts/cmodel_batch_summary.py` | cmodel 解析/构建/验证流水线 skill 文件或脚本。 | - | value_of, combo_key, combo_desc, sha256, collect_components, extend_params, interfaces, function_nodes, upload_model, get_json |
| `tests/unit/test_ability_export_builder.py` | 单元/回归测试文件。 | AbilityExportBuilderTests | test_empty_abilities_return_default_shape, test_exported_abilities_preserve_version_and_component_abilities, test_function_ability_builds_child_functions, test_child_function_prefers_type_and_preserves_clone_enable, mapper |
| `tests/unit/test_backend_api_e2e.py` | 单元/回归测试文件。 | BackendApiE2ETests | ensure_sample_cmodel, iter_module_names, test_upload_patch_compile_roundtrip |
| `tests/unit/test_backend_export_regressions.py` | 单元/回归测试文件。 | BackendExportRegressionTests | test_deep_update_creates_missing_nested_branch, test_compile_csv_uses_live_blueprint_and_module_files, test_compile_requires_blueprint, test_encode_preserves_project_specific_funcdesc_model |
| `tests/unit/test_compile_service.py` | 单元/回归测试文件。 | CompileServiceTests | test_normalize_io_category_maps_interface_like_categories, test_collect_module_rows_uses_explicit_types_and_coordinates, test_collect_module_rows_falls_back_from_module_type_mapping_and_recurses |
| `tests/unit/test_component_general_attrs.py` | 单元/回归测试文件。 | ComponentGeneralAttrsTests | test_normalizes_interface_like_category_to_io, test_chassis_identity_updates_shape_dimensions, test_drivewheel_defaults_submodule_type, test_io_category_inference_uses_io_defaults |
| `tests/unit/test_component_payload_builders.py` | 单元/回归测试文件。 | ComponentPayloadBuildersTests | test_build_extend_params_uses_mount_fields, test_build_extend_params_defaults_missing_mount_fields_to_zero, test_build_private_attrs_delegates_element_mapping, test_build_interface_groups_preserves_interface_fields, test_build_interface_groups_defaults_to_empty_list, mapper |
| `tests/unit/test_fallback_diagnostics.py` | 单元/回归测试文件。 | FallbackDiagnosticsTests | test_missing_required_id_is_reported_as_error, test_template_and_mapping_fallbacks_are_visible, test_collect_export_diagnostics_reports_empty_abilities_without_touching_config, test_collect_comp_desc_diagnostics_reports_resolved_protocol_defaults |
| `tests/unit/test_field_source_policy.py` | 单元/回归测试文件。 | FieldSourcePolicyTests | test_required_core_rules_are_registered, test_module_uuid_is_required_not_guessable, test_mapping_defaults_are_listed_for_review, test_compat_defaults_are_explicitly_marked_as_risky |
| `tests/unit/test_io.py` | 单元/回归测试文件。 | - | test |
| `tests/unit/test_model_service.py` | 单元/回归测试文件。 | ModelServiceTests | test_normalize_abilities_payload_wraps_legacy_list_payload, test_normalize_abilities_payload_preserves_dict_payload, test_update_abilities_passes_normalized_payload_to_data_manager, test_update_abilities_reports_error_when_update_fails |
| `tests/unit/test_module_group_builder.py` | 单元/回归测试文件。 | ModuleGroupBuilderTests | test_chassis_root_group_name_is_fixed, test_regular_module_group_name_strips_module_prefix_and_recurses, test_frontend_comp_desc_uses_identity_name_and_root_components_only, mapper, mapper, group_builder |
| `tests/unit/test_module_list_builder.py` | 单元/回归测试文件。 | ModuleListBuilderTests | test_normalize_io_category, test_build_module_row_extracts_explicit_and_default_fields, test_collect_module_rows_recurses_children |
| `tests/unit/test_parser_v25.py` | 单元/回归测试文件。 | - | test |
| `tests/unit/test_project_repository.py` | 单元/回归测试文件。 | ProjectRepositoryTests | make_repository, test_init_project_writes_blueprint_compdesc_and_copies_modules, test_ensure_module_in_project_copies_fallback_source_once, test_update_component_deep_merges_and_get_component_reads_result, test_update_component_returns_false_when_module_is_missing, test_update_ability_creates_file_and_deep_merges_payload, test_update_function_creates_file_and_deep_merges_payload |
| `tests/unit/test_project_service_diagnostics.py` | 单元/回归测试文件。 | ProjectServiceDiagnosticsTests | test_initialize_project_returns_diagnostics_without_writing_them_to_compdesc, fake_split |
| `tests/unit/test_protobuf_export_alignment.py` | 单元/回归测试文件。 | ProtobufExportAlignmentTests | test_comp_desc_int32_fields_survive_proto_sync, test_proto_sync_merges_camel_and_snake_case_collisions_without_data_loss, test_ability_exporter_uses_abi_native_type_names, test_abi_type_mapping_accepts_native_and_legacy_names |
| `tests/unit/test_resource_adapter_compat.py` | 单元/回归测试文件。 | ResourceAdapterCompatTests | test_legacy_exports_point_to_current_modules |
| `tests/unit/test_xml_component_adapter.py` | 单元/回归测试文件。 | XmlComponentAdapterTests | test_xml_to_component_json_extracts_component_names_and_categories, test_xml_to_component_json_defaults_missing_identity_name |
| `tests/unit/true_parser_impl.py` | 单元/回归测试文件。 | AMRModelParser | process_cmodel, read_byte, read_bytes, peek_byte, read_string_value, parse |
