# Technical Specification: AMR Configuraiton Pipeline

## 1. Frontend UI Framework
- **Framework**: React.js / Vite
- **State Management**: Redux or Context API using a single `AmrConfigIntent` object.
- **Routing**: Multi-step wizard (Steps: Chassis -> Boards -> Drivers -> Sensors -> Review).

### 1.1 UI Workflow (Step-by-Step)
1.  **Chassis Step**: User selects base frame (e.g., `chassis_diff`).
2.  **Board Step**: User adds Control Boards and IO expansion modules.
3.  **Drive Step**: Configuration of Wheel Units and mapping to Drivers/Motors.
4.  **Perception & UI Step**: Addition of Lidar, IMU, Buttons, and Indicators.
5.  **Power Step**: Configuring Battery capacity and BMS protocol.
6.  **I/O Routing Step**: Graphical interface for linking DI/DO pins to logical functions.
7.  **Validation Step**: Final design check before export.

---

## 2. Data Model Translation (Backend)

The **Transformation Service** converts the `AmrConfigIntent` (simplified UI model) into the three standard Protobuf-compliant JSONs.

### 2.1 CompDesc.json Generation
- **Root**: `moreModuleInfo` contains the chosen Chassis.
- **Children**: Append chosen Boards, Drivers, and Sensors to the `moduleComponets` list of the parent chassis or board.
- **Coordinate Calculation**: Each component's `structParam` is populated with the UI-defined `locCoordX/Y/Z`.

### 2.2 AbiSet.json Generation
- Automatically maps used component types to their `componentAbility` entities.
- Aggregates `functionAbility` based on the unique types of hardware added.

---

## 3. Pseudo-code

### 3.1 Frontend: `ConfigWizard.tsx`
```tsx
const ConfigWizard = () => {
    const [intent, setIntent] = useState({
        chassis: null,
        boards: [],
        drives: { fl: null, fr: null, ... },
        sensors: []
    });

    // Step 1: Select Chassis
    const handleSelectChassis = (id) => {
        const chassisLib = library.filter(m => m.type === 'chassis');
        setIntent({ ...intent, chassis: chassisLib.find(c => c.id === id) });
    }

    // Step 2-4: ... Add other components ...

    // Final: Trigger Export
    const handleExport = async () => {
        const blob = await api.post('/export/cmodel', intent);
        saveAs(blob, 'CustomModel.cmodel');
    }

    return (
        <Layout>
            <Stepper steps={['Chassis', 'Boards', 'Drives', 'Sensors']} />
            <Box>{/* Dynamic Step Content */}</Box>
            <Button onClick={handleExport}>Generate Model</Button>
        </Layout>
    );
}
```

### 3.2 Backend: `transformation_service.py`
```python
class TransformationEngine:
    def process_intent(self, intent):
        # 1. Build CompDesc
        comp_desc = {"moreModuleInfo": [self._map_to_module(intent['chassis'])]}
        for b in intent['boards']:
             comp_desc['moreModuleInfo'][0]['moduleComponets'].append(self._map_to_comp(b))
        
        # 2. Build FuncDesc (Function mapping)
        func_desc = self._aggregate_functions(intent)

        # 3. Build AbiSet (Capability mapping)
        abi_set = self._aggregate_abilities(intent)

        return comp_desc, func_desc, abi_set

    def export_cmodel(self, intent):
        c, f, a = self.process_intent(intent)
        # Call systematic_serializer for each
        # Call cmodel_repacker to zip
        return cmodel_path
```

---

## 4. Verification & Constraints
- **UUID Uniqueness**: The backend must verify that no two components share the same `moduleUuid` unless they represent identical hardware types properly indexed.
- **Interface Mapping**: Ensure `interfaceParams.linkedInterfaceUuid` pointers are correctly cross-referenced between sensors and boards.

---
**Senior Design Engineer**: Antigravity  
**Status**: Detailed Draft
