# AMR Studio V4 - Robot Specification & Virtual Sandbox

AMR Studio V4 is a professional engineering tool for designing, verifying, and exporting Autonomous Mobile Robot (AMR) hardware configurations. It bridges the gap between high-level component selection and low-level `CModel` (Controller Model) specifications.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (3.10 or higher)

### Installation
1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   cd amr_studio_v4
   ```

2. **Setup Backend Environment**:
   ```bash
   cd src/backend
   python3 -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Setup Frontend Environment**:
   ```bash
   cd ../frontend
   npm install
   ```

## 🛠 Running the Application

### Unified Startup (Recommended)
We provide a unified startup script that handles both frontend (Vite) and backend (FastAPI).

- **On MacOS / Linux**:
  ```bash
  python3 start.py
  ```
- **On Windows**:
  ```batch
  start.bat
  ```

### Developer Mode (with Hot-Reload)
```bash
python3 start.py --dev
```

## 🏗 Data Architecture

### 1. XML Registry (Single Source of Truth)
All hardware specifications are governed by the **Aggregated XML Registry** located in `specifications/ModuleLibrary/Aggregated/`.
- `PrivateAttributes.xml`: Defines hardware-specific properties.
- `InterfaceSpecs.xml`: Defines pinouts and interface parameters.
- `ModuleConfigs.xml`: Defines standard configurations for complex modules.

### 2. Export Pipeline
When you click **Export** in the UI:
1. **Frontend**: Maps the UI state to a `blueprint_CompDesc.json`.
2. **Backend**: 
   - Resolves all pointers and references.
   - Enriches the data using the `XmlTemplateRegistry`.
   - Standardizes the format to match the **ModelSet312** baseline (Protobuf-compatible).
   - Generates the final `.cmodel` (JSON) file.

## 📁 Project Structure

- `src/frontend`: React + Tailwind CSS dashboard.
- `src/backend`: FastAPI server + `XmlTemplateRegistry` serialization engine.
- `specifications`: Original and aggregated hardware libraries.
- `scripts`: Maintenance scripts (aggregation, verification, encoding tests).

## 🛡 Engineering Constraints
This project follows strict engineering rules defined in `specifications/ENGINEERING_CONSTRAINTS.md`. Key highlights:
- **No Hardcoding**: All metadata must be derived from the XML Registry.
- **Protocol Compliance**: Exported JSON must use `interfaceParamsArray` for all interface data.
- **Fidelity**: Logical grouping (e.g., `chassisAttr`, `wheelsAttr`) must match official CModel standards.

---
© 2026 AMR Studio Team. Proprietary and Confidential.
