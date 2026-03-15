# CModel V2 Full-Stack Refactoring Plan

This plan aims to refactor the AMR Studio V4 frontend and backend to support a wizard-like, step-by-step AMR building# Phase 7: Hardware Taxonomy Refinement (IO & Drivers)

Refine the hardware representation to use real vendor models and software specifications.

## User Review Required

> [!IMPORTANT]
> - **IO Models**: Generic names like `IOModule-Common` are replaced with real software specification names (e.g., `RA-EI/I-A-14400AH0`).
> - **Driver Models**: Transitional names like `walk-motor` are removed and replaced with specific vendor models (e.g., `RA-DR/D-48/25DB-311BH3`, `KINCO_SERVO`).
> - **IO-Interface Mapping**: Selection of IO models will be tightly coupled with their interface capabilities in subsequent steps (Phase 8).

## AMR Studio V4 Implementation Plan

## Phase 7: Hardware Taxonomy Refinement (IO & Drivers) [COMPLETED]
Refine hardware models to use real vendor specs.

## Phase 8: Expanding Wheel & Power Attributes [IN PROGRESS]
Focus on kinematics and power parameters for wheels and drivers.

### User Review Required
> [!IMPORTANT]
> The addition of `diameter` and `wheelTrack` will affect kinematic calculations and CModel generation.

## Phase 9: Refining Chassis Attributes

This phase focuses on a comprehensive refinement of the Chassis configuration, moving beyond basic dimensions to include full module metadata, performance limits, and motion center offsets.

### Proposed Changes

#### Frontend Data Models ([types.ts](file:///d:/code/amr_studio_v4/frontend/src/store/types.ts))
- **[NEW] `ChassisConfig` Interface**:
  - Module Info: `name`, `alias`, `description`, `version`, `subsystem`, `mainType`, `subType`, `vendor`, `model`, `shape` (Box/Cylinder), `length`, `width`, `height`.
  - Performance: `maxSpeedIdle/Full`, `maxAccIdle/Full`, `maxDecIdle/Full`, `maxAngSpeedIdle/Full`, `maxAngAccIdle/Full`, `maxAngDecIdle/Full`.
  - Motion Center: `headOffsetIdle/Full`, `tailOffsetIdle/Full`, `leftOffsetIdle/Full`, `rightOffsetIdle/Full`.
- **[MODIFY] `RobotConfig`**:
  - Replace standalone chassis fields in `IdentityConfig` with a nested `ChassisConfig`.

#### Frontend Store ([useProjectStore.ts](file:///d:/code/amr_studio_v4/frontend/src/store/useProjectStore.ts))
- Update `defaultRobotConfig` and factories to include the new `ChassisConfig` structure.
- Implement auto-calculation logic for `motionCenter` based on length/width (as a helper, with manual override).

#### Frontend UI
- **[MODIFY] `IdentityForm.tsx`**: Add fields for Chassis metadata (alias, description, vendor, etc.) and performance limits.
- **[MODIFY] `RobotCanvas.tsx`**: Ensure it uses the new `chassis.length` and `chassis.width`.

#### Backend ([api.py](file:///d:/code/amr_studio_v4/backend/schemas/api.py))
- Update Pydantic models to match the new `ChassisConfig` structure.

#### Backend CModel ([schema_builder.py](file:///d:/code/amr_studio_v4/backend/core/schema_builder.py))
- Map the new chassis attributes to the `chassis` node and `motionCenterAttr`/`chassisAttr` property groups.

### Verification Plan
- **Automated Tests**:
   - Verify CModel generation with multiple chassis configurations.
- **Manual Verification**:
   - Check UI sync between length/width and auto-generated offsets.
   - Verify all metadata fields (Vendor, Model, etc.) appear correctly in the UI.

### Proposed Changes

#### frontend
- [MODIFY] [types.ts](file:///d:/code/amr_studio_v4/frontend/src/store/types.ts): Expand `WheelConfig` and `WheelComponent` with new attributes.
- [MODIFY] [useProjectStore.ts](file:///d:/code/amr_studio_v4/frontend/src/store/useProjectStore.ts): Update factories to include default values for new attributes.
- [MODIFY] [DriveForm.tsx](file:///d:/code/amr_studio_v4/frontend/src/components/Wizard/DriveForm.tsx): Add UI fields for diameter, track, voltage, current, RPM, etc.

#### backend
- [MODIFY] [api.py](file:///d:/code/amr_studio_v4/backend/schemas/api.py): Update Pydantic models to receive new attributes.
- [MODIFY] [schema_builder.py](file:///d:/code/amr_studio_v4/backend/core/schema_builder.py): Map new attributes to `privateAttr` groups in CModel.

## Verification Plan

### Automated Tests
- Run `npm run build` to verify type consistency.
- Compile a configuration and check `CompDesc.model` for the new properties.

### Manual Verification
- Use the Wizard to set wheel diameter and track.
- Verify that motor and driver parameters (voltage, current, etc.) are correctly saved and persistent.


### Frontend (Taxonomy)

#### [MODIFY] [types.ts](file:///d:/code/amr_studio_v4/frontend/src/store/types.ts)
- Update `IO_BOARD_MODELS` to use real software specs.
- Update `DRIVER_MODELS` to use vendor-specific model strings.

### Backend (Generation)

#### [MODIFY] [schema_builder.py](file:///d:/code/amr_studio_v4/backend/core/schema_builder.py)
- Update the `build_from_payload` logic to correctly map these new models to `softwareSpec` nodes in the CModel.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure type safety.
- Execute compilation and inspect the generated `project.pb` or JSON dump for correct `softwareSpec` values.

### Manual Verification
- Verify the "Add IO" dialog shows the new software spec names.
- Verify the "Drive Form" component model selection shows real vendor names.
- Verify that "walk-motor" labels no longer appear in the UI.

#### [MODIFY] `backend/core/model_parser.py`
- Formally integrate the `parse_v6.py` exact schema parsing logic natively. The backend will parse uploaded `.cmodel` files flawlessly and return 100% accurate JSON data back to the frontend logic instantly.

---

## Phase 6: 硬件体系精度修复 (Refining Hardware Taxonomy)

### 1. IO 模块修正
- **问题**: 之前直接使用了 `STANDARD_IO` 等占位符。
- **方案**: 映射至 `ModuleLibrary` 真实型号：`IOModule-Common`, `safetyIOModule-Common`, `IO module 4in4out`, `IO-lnterface board`。

### 2. 轮组体系重构 (Wheel Taxonomy)
- **立式/卧式舵轮 (Vertical/Horizontal Steer)**:
    - 组合结构：包含 **行走驱动 (Drive)** 和 **转向驱动 (Steer)**。
    - 属性要求：需分别配置行走电机/编码器与转向电机/编码器。
- **差速式舵轮 (Differential Steer)**:
    - 组合结构：类似差速轮（左右驱动电机），但多一个 **外置转向编码器**。
- **前端更新**: 向导工具需支持这三类舵轮的拓扑选择，并自动填充对应的 `softwareSpec`。

### 3. 型号与规格解构
- 严格区分 **显示名称 (Group Name)** 与 **软件规格 (softwareSpec)**。
- 修复之前将 `MCPU-RA-MC-R318AT` 同时作为主控和 IO 的混乱逻辑。

#### [NEW] `frontend/src/views/WizardBuilder.tsx`
- A new master component managing the state of the AMR build process.
- Implements a stepper (Step 1: Base, Step 2: Motors, Step 3: Sensors).

#### [MODIFY] `frontend/src/views/Welcome.tsx` 
- Update the main action buttons. "Create New Model" will now route to `/wizard` instead of the old confusing configurator.

#### [MODIFY] `frontend/src/services/api.ts`
- Add bindings for `/api/v2/models/build` and the upload/parse endpoints.

## Verification Plan

### Automated Tests
1. Generate a test AMR using the new `BinaryPatcher` logic.
2. Run our `true_parser.py` against the generated `.cmodel` to assert that fields like `gearRatio` are exactly `25.0` (not `25.00000001` or string `"25"`).
3. Validate MD5 logic so that the V2 engine doesn't reject our generated archive.

### Manual Verification
1. Launch the `start_all.bat` script.
2. Open `localhost:3000`, click "Create New Model", and step through the UI wizard.
3. Click "Export CModel", download the zip, upload it to the real robot master controller, and verify it boots without schema errors.
## Phase 10: Refining Main Controller Attributes

This phase focuses on a comprehensive refinement of the Main Controller (MCU) configuration, including its metadata, physical pose, and onboard modules (sensors/cameras).

### Proposed Changes

#### Frontend Data Models ([types.ts](file:///d:/code/amr_studio_v4/frontend/src/store/types.ts))
- **[MODIFY] `McuConfig` Interface**:
  - Add 6D Pose: `mountX`, `mountY`, `mountZ`, `roll`, `pitch`, `yaw`.
  - Add Metadata: `subsystem`, `mainType`, `subType`, `vendor`, `version`.
  - Add Dimensions: `length`, `width`, `height`, `shape`.
  - Add Orientation helpers: `surfaceOrientation` (Up/Down/Front/Back/Left/Right), `cableDirection`.

#### Frontend Store ([useProjectStore.ts](file:///d:/code/amr_studio_v4/frontend/src/store/useProjectStore.ts))
- Update `defaultMcu` with real defaults (e.g., RA-MC-R318AT).
- Implement factory logic to automatically set onboard module flags (e.g., `hasGyro`, `hasCamera`) based on the selected model naming rules.

#### Frontend UI
- **[MODIFY] `ControlBoardForm.tsx`**:
  - Overhaul the MCU section with a tabbed interface or grouped forms.
  - Implement selection for "Horizontal/Vertical" installation that automatically populates roll/pitch/yaw.
  - Show status of board-mounted devices (Gyroscope, Up/Down Reading Cameras).

#### Backend CModel ([schema_builder.py](file:///d:/code/amr_studio_v4/backend/core/schema_builder.py))
- Map the MCU's 6D pose.
- Ensure onboard modules (GYRO-VIR, CR-VIR) are added as child nodes of the MCU in the CModel structure when applicable.

### Verification Plan
- **Automated Tests**: Verify CModel output for different MCU models.
- **Manual Verification**: 
    - Check that orientation selection (Horizontal/Vertical) correctly updates the angles.
    - Verify that based on model naming (AT/AD/BN), the onboard device summary updates correctly.

## Phase 11: Refining MCU Interface Resources

This phase focuses on populating and managing the specific interface resources (CAN, Serial, RS485, ETH, Speaker) for each MCU model based on the hardware specifications.

### Proposed Changes

#### Frontend Data Models ([types.ts](file:///d:/code/amr_studio_v4/frontend/src/store/types.ts))
- **[MODIFY] `McuConfig` Interface**:
  - Add `rs232Ports`, `rs485Ports`, `speakerPorts` arrays.
  - Standardize `canBuses` and `ethPorts` handling.

#### Frontend Store ([useProjectStore.ts](file:///d:/code/amr_studio_v4/frontend/src/store/useProjectStore.ts))
- Populate detailed interface counts and names when an MCU model is selected.
- Define a dictionary of hardware capabilities for each software specification (AT, BN, AD, etc.).

#### Frontend UI
- **[MODIFY] `ControlBoardForm.tsx`**:
  - Update the "Internal Resources" tab to display lists for all communication interfaces.
  - Allow manual naming/aliasing of specific ports if needed.

#### Backend
- **[MODIFY] `api.py`**: Add new interface fields to Pydantic models.
- **[MODIFY] `schema_builder.py`**: Update `build_from_payload` to wire these additional interfaces into the CModel structure.

### Verification Plan
- **Automated Tests**: Compare generated CModel interface counts against the hardware library JSONs.
- **Manual Verification**: 
    - Select different MCU models and verify that the "Resources" tab updates with the correct port counts.
    - Verify that common ports (ETH*4, SPK*1) are always present.

## Phase 12: Refining IO Board Resources & MCU CAN Fix

This phase focuses on populating resources for IO boards based on their software specifications and correcting the MCU CAN resource count based on real hardware definitions.

### Proposed Changes

#### Frontend Data Models ([types.ts](file:///d:/code/amr_studio_v4/frontend/src/store/types.ts))
- **[MODIFY] `IoBoardConfig` Interface**:
  - Add `canBuses`, `diPorts`, `doPorts`, `aiPorts` arrays.
  - Standardize resource tracking for expansion boards.

#### Frontend Store ([useProjectStore.ts](file:///d:/code/amr_studio_v4/frontend/src/store/useProjectStore.ts))
- **[FIX] `setMcu`**: Correct CAN counts to match JSON (3 for R318/R349).
- **[MODIFY] `addIoBoard`**: Automatically populate `canBuses`, `diPorts`, etc., based on the selected `model`.
- Define hardware library for IO boards (e.g., `RA-IC_I-F-1R6BH0` has 26 DI, 6 DO, 7 AI).

#### Frontend UI
- **[MODIFY] `ControlBoardForm.tsx`**:
  - Update the "Add IO" modal to reflect that resources are fixed by the model.
  - Add a "Resources" summary in the IO Board table or a detail view.

#### Backend
- **[MODIFY] `api.py`**: Update `IOBoardConfig` Pydantic model.
- **[MODIFY] `schema_builder.py`**: Map expanded IO board attributes to CModel.

### Verification Plan
- **Automated Tests**: Verify generated CModel for IO board interface counts.
- **Manual Verification**: 
    - Add different IO board models and verify their resource counts (DI/DO/AI).
    - Check that the MCU still correctly lists 3 CAN buses.
