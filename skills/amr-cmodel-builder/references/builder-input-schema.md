# Builder Input Schema

## Purpose

Build `.cmodel` files from explicit human input. This skill must not infer missing model facts.

## Input Contract

```json
{
  "projectId": "proj_manual_xxx",
  "config": {
    "identity": {
      "robotName": "string"
    },
    "components": [],
    "abilities": {
      "version": "string",
      "componentAbility": [],
      "functionAbility": []
    },
    "functionProcesses": []
  }
}
```

## Required Build Dimensions

- Chassis selection.
- Device selection and assembly.
- Common/private attributes.
- Mounting position.
- Interface wiring.
- CAN/ETH/RS485 bus configuration.
- Software ability configuration.
- Function process source.

## Blocking Conditions

Block export or require user input when:

- `projectId` is missing.
- `config.components` is missing.
- A component lacks a stable ID/UUID.
- A connection references a missing interface.
- A bus has no declared type.
- `FuncDesc` is expected but no source is provided.
- A field is needed for protocol validity but no module-library/default rule exists.

