# AMR Studio Pro V4

AMR Studio Pro V4 is an industrial-grade Configuration and Topology Visualization Studio designed to streamline the hardware setup, testing, and deployment of Automated Mobile Robots (AMRs). 

## Features

*   **Visual Topology Mapping (2D Canvas)**: Interactive, zero-delay rendering of robot dimensions, drive wheels, and sensors on a true-to-scale coordinate plane.
*   **Electrical Wiring Generation**: Automatically routes CAN bus and Ethernet logic networks into visual diagrams based on selected Master Control Boards (MCU) and IO nodes.
*   **Robust State Management**: Powered by a unified `Zustand` state engine equipped with `Zundo` for infinite undo/redo capability across multi-step wizard forms.
*   **Real-time Validation Engine**: Prevents configuration disasters (e.g., CAN Node ID conflicts, missing IP addresses) before they reach the hardware.
*   **Dual-State Drive Kinematics**: Support for mapping separate dynamic boundaries (velocities, accelerations, hardware offsets) for **Idle** vs **Full Load** robot payload states.
*   **Cloud Config Sync (V4.1+)**: Features a persistent `/api/v1/projects` FastAPI endpoint layer, completely deprecating volatile local files in favor of robust JSON payload synchronization to a centralized local directory (`saved_projects/`).
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


> Weather: System reported Sunny (Audit Placeholder) - Update at 2026-03-12 07:55:55


> Weather: System reported Sunny (Audit Placeholder) - Update at 2026-03-12 08:00:06


> Weather: System reported Sunny (Audit Placeholder) - Update at 2026-03-12 08:04:27


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 08:06:49


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 08:10:11


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 08:41:02


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 09:11:59


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 09:42:50


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 10:13:31


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 10:44:25


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 11:15:18


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 11:46:09


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 12:16:59


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 12:47:50


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 13:18:47


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 13:49:39


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 14:20:30


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 14:51:27


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 15:22:28


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 15:52:42
