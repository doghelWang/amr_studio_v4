# AMR Configurator Code Audit Report & Rectification Plan

**Date**: 2026-03-21  
**Auditor**: Senior AI Architect (Antigravity)  
**Scope**: Frontend Architecture vs. Backend Proto/JSON Specification  

---

## 1. Executive Summary
The current implementation successfully provides a 7-step guided workflow and satisfies the high-level functional requirements. However, there are **significant architectural divergences** between the frontend data model and the backend `controller_model_comp_desc.proto` / `CompDesc.json` specifications. These gaps primarily affect the "Zero-Omission" fidelity and the ability to perform full-spectrum validation (e.g., range checks, unit verification).

## 2. Technical Findings & Gap Analysis

### 2.1 Attribute Data Fidelity (CRITICAL)
- **Finding**: The backend defines `Message_Base_Element` as a rich metadata object (Value + Type + Min + Max + Unit + Flags). The frontend currently treats `privateAttrs` as a flat `Record<string, any>`.
- **Impact**: Exporting to `.cmodel` will result in the loss of essential metadata (units, mandatory flags). The UI does not prevent users from inputting values outside the `min/max` range defined in the registry.
- **Reference**: `controller_model_comp_desc.proto:L32-L73`.

### 2.2 Interface Topology & Linking (HIGH)
- **Finding**: The backend schema supports `linkedInterfaceUuid` to define physical/logical connections between modules (e.g., Motor -> Driver). Current `WiringStep` only configures local port parameters (Baudrate, NodeID).
- **Impact**: The robot's electrical topology is incomplete. The system cannot verify if a motor is actually connected to a driver or if a laser is on the correct CAN bus.
- **Reference**: `CompDesc.json` -> `interfaceGroup` array.

### 2.3 Structural Hierarchy Logic (MEDIUM)
- **Finding**: The proto uses `more_module_info` for recursive nesting. The frontend uses a flat list with `parentNodeUuid`.
- **Impact**: While functionally equivalent for flat visualization, the recursive constraints (e.g., depth limits, forbidden parent types) are not enforced in the `RelationshipStep`.

## 3. Rectification Roadmap

### Phase 1: Data Model Upgrade (Short-term)
1.  **Refactor `types.ts`**: Update `privateAttrs` from `Record<string, any>` to `Record<string, SmartAttribute>` where `SmartAttribute` matches the `Message_Base_Element` structure.
2.  **Update `PropertyAuditStep`**: Enhace the audit engine to check `currentValue` against `min/max` and `mustFill` flags from the registry.

### Phase 2: Topology Linking (Medium-term)
1.  **Enhance `WiringStep`**: Add a "Connection Manager" to allow users to pick a target UUID for `linkedInterfaceUuid`.
2.  **Recursive Export**: Update the export logic to transform the flat list into the nested `more_module_info` structure required by the proto.

### Phase 3: Validation Engine (Long-term)
1.  **Unit Awareness**: Add automatic unit conversion logic (e.g., mm to m) as per the `unit` field in the proto.
2.  **Rule-based Filtering**: Restrict `parentNodeUuid` options based on `mainModuleType` (e.g., Sensors can only be children of Chassis or Brackets).

## 4. Prioritized Recommendations
1.  [ ] **[P0]** Adopt the `SmartAttribute` model to prevent data loss on export.
2.  [ ] **[P1]** Integrate `min/max` validation into the dynamic form fields.
3.  [ ] **[P1]** Implement interface linking in the `WiringStep`.
4.  [ ] **[P2]** Add 3D Model URL support as defined in `general_attr.module_3d_icon`.

---
*End of Report*
