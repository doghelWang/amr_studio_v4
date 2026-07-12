# AMR CModel Pipeline Constraints

## Fact Sources

Allowed sources:

- Imported `.cmodel` files and decoded `CompDesc`, `AbiSet`, `FuncDesc`.
- Protobuf definitions under `src/backend/skills_v2/schemas_pb`.
- Module library files under `specifications/ModuleLibrary` and runtime module templates.
- Backend API responses.
- Explicit user input.
- Registered engineering constraints in `specifications/ENGINEERING_CONSTRAINTS.md`.

Disallowed sources:

- Module-name substring inference.
- Filename inference.
- UI placeholder text.
- Field `desc` used as a substitute for missing `typeKey`.
- Empty generated JSON used as if it were a real parse result.

## Required Model Facts

Parsing should preserve and report:

- `moduleUuid`, `moduleName`, `moduleDesc`, `mainModuleType`, `subModuleType`.
- `locCoordX`, `locCoordY`, `locCoordZ`, `locCoordROLL`, `locCoordPITCH`, `locCoordYAW`, `parentNodeUuid`.
- `interfaceUuid`, `key`, `type`, `desc`, `linkedInterfaceUuid`, `interfaceAttrs`, `interfaceParams`.
- `componentAbility`, `functionAbility`.
- `FuncDesc.function` and nested `childFunction`.

## Build Order

1. Chassis selection.
2. Device selection and assembly.
3. Common/private attribute configuration.
4. Mounting position configuration.
5. Interface and connection configuration.
6. CAN/ETH/RS485 bus configuration.
7. Software ability and FuncDesc configuration.
8. Audit and export.

## Error Classification

Use explicit diagnostics:

- `CMODEL_COMPDESC_MISSING`
- `CMODEL_PROTO_PARSE_FAILED`
- `CMODEL_PACKAGE_INVALID`
- `CONNECTION_TARGET_NOT_FOUND`
- `CONNECTION_TYPE_INCOMPATIBLE`
- `BUS_PARAMETER_MISSING`
- `ABILITY_TARGET_NOT_FOUND`
- `FUNCDESC_MISSING`
- `MODULE_LIBRARY_FACT_MISSING`

