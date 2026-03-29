---
name: "amr_schema_interpreter"
description: "Strict mechanism skill for translating official AMR Studio V4 ModuleLibrary reference files (.json) into valid frontend Redux/Zustand UI models. Trigger this whenever adding a new hardware type (such as Lidars, Ultrasonic, new Motors, UI constraints) to ensure 100% CModel conformity without hardcoding."
---

# AMR Schema Interpreter Skill

## Objective
The front-end UI must NEVER hardcode component dictionaries. All properties for every component category must be perfectly synthesized from the official `docs/reference/ModuleLibrary/ModuleAttrTem` JSON reference files.

This skill outlines the strict workflow and instantiation rules for deriving React/UI parameters directly from the backend's `PrivateAttribute.json` schemas.

## Golden Rules
1. **Zero Hardcoding**: Do precisely zero manual enumeration in `types.ts`. All structural knowledge comes dynamically from the `ModuleLibrary` JSONs.
2. **Invisible Default Inheritance**: Retain every single key present in the JSON definition. If the UI does not intend to display a property (e.g. `detectModeZero`), you MUST map it using `{ boolHide: true, value: defaultValue }`.
3. **No Cross-Pollination**: Never assume a property belongs to a module unless it exists in that module's `ModuleAttrTem/Pri_Attr/.../PrivateAttribute.json`. 

## 1. Schema Component Factory (Pseudo-code Reference)
When writing frontend mechanisms to parse these configuration templates, apply the following `transformElement` rules exactly:

```typescript
function parseAttrElement(rawEle: any) {
    // 1. Basic Transfer
    let base = {
        key: rawEle.key,
        desc: rawEle.desc,
        type: rawEle.type,
        // Provide strong constraints
        boolHide: rawEle.boolHide ?? false, 
        boolMustfill: rawEle.boolMustfill ?? false,
        boolBasic: rawEle.boolBasic ?? true,
    };
    
    // 2. Value Mapping (Safety Fallbacks)
    switch(base.type) {
        case 'DATA_DOUBLE': base.value = rawEle.doubleValue ?? 0; break;
        case 'DATA_INT32': base.value = rawEle.int32Value ?? 0; break;
        case 'DATA_STRING': base.value = rawEle.stringValue ?? ''; break;
        case 'DATA_BOOL': base.value = rawEle.boolValue ?? false; break;
        
        // 3. Combox & IO Binding Extraction
        case 'DATA_COMBOX':
            if (rawEle.comboType) {
                base.comboType = rawEle.comboType;
                base.value = rawEle.comboType.typeKey; // Default selection
            }
            break;
            
        case 'DATA_FIXED_E':
            base.fixedSource = rawEle.fixedSource || []; // E.g., ['sensor/PT']
            base.value = null; // Ready for Avalanche data-binding injection
            break;
    }
    
    return base;
}
```

## 2. Typical Target Module Signatures

When auditing or generating components, cross-check these primary subTypes strictly within `docs/reference/ModuleLibrary/ModuleAttrTem/Pri_Attr/`:

### 2.1 Chassis (底盘) - e.g., `diffChassis`
- Path: `Pri_Attr/diffChassis/PrivateAttribute.json`
- UI Check: Wheel counts (`wheelsNum`) are mostly constrained/hidden. Offset values (head/tail/left/right) are visible.
- Ensure max acceleration and specific RPM formulas are synced correctly.

### 2.2 Drive Wheel / Steer Wheel (轮组) - e.g., `horizontalSteerWheel`
- Path: `Pri_Attr/horizontalSteerWheel/PrivateAttribute.json`
- Payload requirement: MUST map `angleLmtPos` / `angleLmtNeg`.
- Constraint requirement: MUST include the `angleSensor` (转向反馈) group and its internal elements (like zero angle IO limit types) exactly as they are configured in the JSON.
- `linkMotorAttr` governs exactly which motor/driver UUID gets pushed into standard fields (`relateRotMotor`, `relateWalkMotor`).

### 2.3 Driver (驱动器) - e.g., `subDriver`
- Path: `Pri_Attr/subDriver/PrivateAttribute.json`
- Contains NO encoder information!
- UI maps: `softwareSpec`, `type` (driver type).
- Hidden mappings: `inputVoltage`, `inputCurrent`, `overloadCapacity`, `overloadTime` must be instantiated as `boolHide: true`.

### 2.4 Motor (电机) - e.g., `PMSMMotor`
- Path: `Pri_Attr/PMSMMotor/PrivateAttribute.json`
- Contains `ENCType` (Encoder Selection). Ensure nested `encoderLine` logic is applied gracefully.
- Include hidden properties for accelerations (`defaultAcc`, `maxDec`) to conform strictly to the standard format.
