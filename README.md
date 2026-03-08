# AMR Studio Pro V4

AMR Studio Pro V4 is an industrial-grade Configuration and Topology Visualization Studio designed to streamline the hardware setup, testing, and deployment of Automated Mobile Robots (AMRs). 

## Features

*   **Visual Topology Mapping (2D Canvas)**: Interactive, zero-delay rendering of robot dimensions, drive wheels, and sensors on a true-to-scale coordinate plane.
*   **Electrical Wiring Generation**: Automatically routes CAN bus and Ethernet logic networks into visual diagrams based on selected Master Control Boards (MCU) and IO nodes.
*   **Robust State Management**: Powered by a unified `Zustand` state engine equipped with `Zundo` for infinite undo/redo capability across multi-step wizard forms.
*   **Real-time Validation Engine**: Prevents configuration disasters (e.g., CAN Node ID conflicts, missing IP addresses) before they reach the hardware.
*   **Dual-State Drive Kinematics**: Support for mapping separate dynamic boundaries (velocities, accelerations, hardware offsets) for **Idle** vs **Full Load** robot payload states.
*   **Direct-to-Binary Compilation**: Features a Python `FastAPI` + `Blackboxprotobuf` backend engine that ingests the frontend topology payload and directly synthesizes target `.model` binaries strictly matching factory specs (supports rapid prototyping for advanced architectures like Quad Steer).

## Project Structure

*   **/frontend**: React 18 + Vite + Ant Design 5 + React Flow application. 
    *   `src/store/`: Unified Zustand data modules.
    *   `src/components/`: Interactive Web UI and 2D canvas editors.
*   **/backend**: Python FastAPI server.
    *   `core/protobuf_navigator.py`: Safe, identity-preserving Protobuf binary manipulator.
    *   `main.py`: REST endpoint for compiling configurations.
*   **/docs**: Comprehensive design schemas, third-party system audit responses, and extensive QA End-to-End automation testing records.

## Usage

### 1. Launch Backend Compiler
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pydantic requests
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Launch Frontend UI
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000` to start configuring your AMR.

---
*Enjoy building the future of robotics! 🤖🚀*
