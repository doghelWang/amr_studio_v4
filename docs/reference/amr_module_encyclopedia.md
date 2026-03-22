# AMR Module Encyclopedia: Technical Registry & Relationship Map

## 1. Chassis (ROOT)
The base structural unit of the AMR.

- **Main Type**: `chassis`
- **Sub Type**: `diffChassis`, `omniChassis` (derived from `subModuleType`).
- **Standard Attributes**: `moduleName`, `moduleDesc`, `moduleUuid`, `moduleShape` (Size: Len/Width/Height).
- **Sub-components**: Typically contains all other modules.

---

## 2. Control Hub (ControlSys)
Hardware responsible for logic execution and signal orchestration.

### 2.1 Master Controller (`masterControl`)
- **Interfaces (Ability)**:
  - `CAN`: 2 ports
  - `DI`: 8 ports
  - `DO`: 6 ports
  - `UART`: 4 ports
  - `RS232`: 2 ports
- **Interface Parameters**: Link mappings for CAN protocol settings.

### 2.2 IO Expansion Board (`IOExtendBoard`)
- **Interfaces**: High-density DI/DO counts.
- **Connection**: Typically linked to Master Controller via `UART` or `RS485`.

---

## 3. Drive System (DriverSys)
The movement execution chain: **Driver -> Motor -> Wheel**.

### 3.1 Driver (`subDriver`)
- **Attributes**: PID parameters, max current, communication timeout.
- **Interfaces**: 
  - `LINE`: 1 (to Motor phase)
  - `ENCR`: 1 (from Encoder)
  - `CAN`: 1 (from Master Controller)
- **Connections**: `linkedInterfaceUuid` points to the `masterControl` CAN port.

### 3.2 Motor (`PMSMMotor`)
- **Attributes**: Rated speed, Rated torque, Pole pairs.
- **Mounting**: `locCoord` defines the physical center.
- **Connection**: `linkedInterfaceUuid` points to the Driver's `LINE` interface.

---

## 4. Perception & Sensors (SensorSys)
Environment detection units.

### 4.1 Lidar (`lidar`)
- **Attributes**: Scan range, frequency, protocol type (UDP/Serial).
- **Mounting**: Critical `locCoordYAW` for installation orientation.

### 4.2 IMU (`imu`)
- **Attributes**: Sensitivity, bias.
- **Relationships**: Logic reference for the entire AMR coordinate system.

---

## 5. UI & Signal Modules (UISys)
Interaction components.

### 5.1 Buttons (`Button`)
- **Types**: `EmergencyStop`, `Reset`, `Power`.
- **Interface**: `DI` (Digital Input).
- **Connection**: `linkedInterfaceUuid` points to `masterControl` or `IOExtendBoard`.

### 5.2 Indicators (`DirectLED`, `SoundIndicator`)
- **Types**: Status light, Beeper.
- **Interface**: `DO` (Digital Output) or `PWM`.

---

## 6. Power System (PowerSys)

### 6.1 Battery (`Battery`)
- **Attributes**: Rated Voltage, Capacity (Ah), BMS Protocol.
- **Interface**: `CAN` or `RS485` for data; Power bus for delivery.

---

## 7. Relationship & Connection Rules

### 7.1 Interface Pointers (`linkedInterfaceUuid`)
- **Logic**: A "Source" component (e.g., Sensor) contains a `linkedInterfaceUuid` that refers to the "Target" component's (e.g., Board) specific interface instance.
- **Validation**: Source and Target must share compatible Interface Types (e.g., CAN to CAN).

### 7.2 Mounting Hierarchy (`parentNodeUuid`)
- **Logic**: Every component in `CompDesc.json` has a `parentNodeUuid` in its `structParam`.
- **Coord System**: `locCoordX/Y/Z` are relative to the parent node's origin.

---
**Registry Source**: `ModelSet39`  
**Precision Level**: 100% Schema-Mapped
