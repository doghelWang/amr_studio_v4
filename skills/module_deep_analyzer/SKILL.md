---
name: Module Deep Analyzer
description: A skill to perform deep analysis of AMR Studio V4 hardware module attributes by reading official PrivateAttribute.json schemas, understanding their physical meanings, cross-module relationships, conditional UI logic, and engineering constraints. Produces comprehensive design reference documents archived to `docs/design_reference/`. Trigger when: user wants to analyze new module types, compare modules, understand attribute relationships, audit attribute completeness, or generate frontend/backend design guidance for any module category.
---

# Module Deep Analyzer Skill

## Purpose

This skill provides a **standardized, repeatable methodology** for deeply analyzing any AMR Studio V4 hardware module's `PrivateAttribute.json` schema. It produces comprehensive design reference documents that guide both frontend UI design and backend JSON generation.

## When to Use

- User asks to analyze a new module type (e.g., sensors, actuators, communication)
- User asks to compare two or more module types within the same category
- User asks to understand attribute relationships or cross-module bindings
- User asks to audit attribute completeness against CModel specifications
- User asks to generate design guidance for frontend/backend implementation

## Critical Concepts

### File Structure

All official module schemas are located at:
```
docs/reference/ModuleLibrary/ModuleAttrTem/Pri_Attr/<moduleTypeKey>/PrivateAttribute.json
```

Each JSON has the root structure:
```json
{
  "privateAttrs": [
    {
      "key": "<groupKey>",
      "desc": "<groupDesc>", 
      "arrayBaseEle": [ /* attribute elements */ ]
    }
  ]
}
```

### Attribute Types and Their Physical Representations

| JSON Type | Frontend Widget | Value Source |
|-----------|----------------|-------------|
| `DATA_DOUBLE` | Number input with `unit`, constrained by `doubleMinvalue`~`doubleMaxvalue` | `doubleValue` |
| `DATA_INT32` | Integer input, constrained by `int32Minvalue`~`int32Maxvalue` | `int32Value` |
| `DATA_STRING` | Text input | `stringValue` |
| `DATA_BOOL` | Toggle/Switch | `boolValue` |
| `DATA_COMBOX` | Dropdown select, options from `comboType.typeGroups[]` | `comboType.typeKey` (default) |
| `DATA_FIXED_E` | Component reference selector (pick from existing project nodes) | `stringFix` (UUID) |

### Visibility & Constraint Flags

| Flag | Physical Meaning | Frontend Behavior |
|------|-----------------|-------------------|
| `boolHide: true` | Attribute is system-internal; value exists in JSON but not user-configurable | **Never render in UI**, always preserve default value |
| `boolMustfill: true` | Attribute is mandatory for valid CModel output | Mark with * or red indicator, validate on submit |
| `boolBasic: true` | Attribute is a primary parameter users typically configure | Show in collapsed panel's "basic" section |
| `boolNoeditable: true` | Value is computed or fixed by the system | Render as read-only (greyed out) |

### Conditional Sub-Attribute Mechanism

The `arrayCmobEle` field inside a `typeGroups` entry defines **child attributes that only appear when that option is selected**:

```json
{
  "key": "ENCODER_INC",
  "desc": "增量式编码器",
  "arrayCmobEle": [
    { "key": "encoderLine", "type": "DATA_INT32", ... }  // Only visible when ENCODER_INC is selected
  ]
}
```

### Cross-Module Reference (`DATA_FIXED_E`)

The `fixedSource` array specifies which module types can be selected:
```json
{
  "key": "relateWalkMotor",
  "type": "DATA_FIXED_E",
  "fixedSource": ["driver/PMSMMotor"]  // Only PMSMMotor nodes are selectable
}
```

Format: `"<category>/<subType>"` where category is the parent in the module tree.

## Analysis Procedure

### Phase 1: Module Inventory & Classification

1. **List all module subtypes** in the target category from `Pri_Attr/` directory
2. **Read each `PrivateAttribute.json`** completely
3. **Classify** by:
   - Number and names of attribute groups (`privateAttrs[].key`)
   - Presence of cross-module references (`DATA_FIXED_E` fields)
   - Presence of conditional branches (`DATA_COMBOX` with `arrayCmobEle`)

### Phase 2: Attribute Group Dissection

For each module type, extract:

1. **Group inventory**: List all `privateAttrs[]` entries with their `key` and `desc`
2. **Per-attribute analysis**:
   - Key, type, physical meaning (from `desc`)
   - Default value and valid range
   - Visibility flags (`boolHide`, `boolBasic`, `boolMustfill`, `boolNoeditable`)
   - Unit (if applicable)
3. **Conditional branches**: For each `DATA_COMBOX` attribute, map out:
   - All selectable options (`typeGroups[]`)
   - Sub-attributes activated per option (`arrayCmobEle`)
   - Nested references within sub-attributes

### Phase 3: Cross-Module Relationship Mapping

1. **Identify all `DATA_FIXED_E` fields** and their `fixedSource` paths
2. **Build a directed reference graph** showing which modules reference which
3. **Identify engineering constraints**: Ask the user or infer from context which options are actually used in practice vs. which exist only for completeness in the schema
4. **Document cascade creation rules**: When creating module A, which other modules must be auto-created and bound

### Phase 4: Comparative Analysis

For modules within the same category:

1. **Build a comparison table** showing attribute presence/absence across subtypes
2. **Identify shared attributes** (same `key` across subtypes)
3. **Identify differentiating attributes** (unique to specific subtypes)
4. **Document physical meaning of differences** (e.g., why diffWheel has no angleSensor but horizontalSteerWheel does)

### Phase 5: Engineering Intelligence Integration

> [!IMPORTANT]
> **JSON schema completeness ≠ Engineering reality.** Schemas may include options that are never used in practice. Always consult with the user to identify:

1. **Default selections**: Which option should be pre-selected for each `DATA_COMBOX`
2. **Hidden options**: Schema options that should be hidden from the UI due to engineering constraints
3. **Value presets**: Common engineering values that should be offered as quick-select options (e.g., encoder lines: 2500/3000/4000)
4. **Conditional visibility rules beyond boolHide**: Attributes that should only appear when a specific related attribute has a specific value (e.g., `softwareSpec` only visible when driver type is HIK)
5. **Physical meaning annotations**: What does `isInvert` actually mean in the physical world? What does `boolNoeditable` imply for user interaction?

### Phase 6: Document Generation

Generate a comprehensive document following this template structure:

```markdown
# AMR Studio V4 — [Category Name] Module Deep Analysis
**Based on official ModuleLibrary PrivateAttribute.json**

## Module Type Catalog
(Table of all subtypes with brief descriptions)

## [SubType Name] Detailed Analysis
### Attribute Group Structure
### Attribute Display Rules
### Conditional Branches
### Cross-Module References

## Cross-Type Comparison
(Comparison table of all subtypes)

## Inter-Module Relationship Map
(Reference graph and cascade creation rules)

## Frontend UI Design Guidelines
### Widget Selection Rules
### Conditional Interaction Specifications
### Default Value & Preset Recommendations
### Engineering Constraints (options to hide/default)

## Backend JSON Compliance Checklist
### Required Fields
### Hidden Fields with Default Values
### Conditional Field Dependencies
```

### Phase 7: Archive & Index

1. **Save the document** to: `docs/design_reference/NN_<category_name>.md`
   - Use sequential numbering: `01_`, `02_`, etc.
   - Name describes the module group analyzed
2. **Update the index** if an `index.md` exists in `docs/design_reference/`

## Pre-Existing Analysis Documents

The following analyses have been completed and archived:

| File | Covers |
|------|--------|
| `01_chassis_wheel_motor_driver_encoder.md` | diffChassis, steerChassis, all wheel types, subDriver, PMSMMotor, BDCMotor, BLDCMotor, all encoders |

## Key Learnings from Previous Analyses

These are domain expert corrections that apply across all future analyses:

1. **`softwareSpec` (subDriver)**: Only visible when `type = MOTOR_SERVO_TYPE_HIK`. Default `"NONE"` otherwise.
2. **Steer wheel encoder defaults**: horizontalSteerWheel/verticalSteerWheel default to `GROUP_CALI_ABS_INTERNAL` (internal absolute encoder).
3. **diffSteerWheel encoder constraint**: Must use external absolute encoder. Hide `GROUP_CALI_INC_EXTERNAL` option.
4. **`encoderLine` presets**: Common values are 2500/3000/4000. Render as select+input combo.
5. **`isInvert` physical meaning**: All encoders have this. When `true`, encoder value increase = physical reverse direction (e.g., value goes up when wheel turns right/decreasing direction).
6. **`boolNoeditable` interpretation**: Means the system will compute/overwrite this value, but the field should still be rendered (read-only, greyed out). NOT the same as `boolHide`.
7. **Engineering reality check**: Always ask the user to confirm which schema options are actually used in practice before finalizing the document.

## Output Directory

All analysis documents MUST be saved to:
```
/Users/wangfeifei/code/amr_studio_v4/docs/design_reference/
```

This directory serves as the single source of truth for frontend/backend design reference, alongside the official schemas in `docs/reference/ModuleLibrary/`.
