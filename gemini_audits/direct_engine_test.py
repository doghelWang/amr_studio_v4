import sys
import os
import json
import zipfile
import subprocess

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from schemas.api import GeneratePayload, WheelConfig, SensorConfig, IOBoardConfig, IOConfig
from core.protobuf_engine import generate_industrial_modelset

def run_direct_engine_test():
    payload = GeneratePayload(
        robotName="Architecture_Test_Robot",
        version="1.0",
        driveType="QUAD_STEER",
        navigationMethod="LIDAR_SLAM",
        wheels=[
            WheelConfig(
                id="w1", label="W1", mountX=400.0, mountY=300.0, mountYaw=0,
                orientation="FL", driverModel="ELMO", canBus="CAN0", canNodeId=2,
                motorPolarity="NORMAL", zeroPos=0, leftLimit=-90, rightLimit=90,
                headOffsetIdle=10, tailOffsetIdle=10, leftOffsetIdle=10, rightOffsetIdle=10,
                maxVelocityIdle=100, maxAccIdle=100, maxDecIdle=100,
                headOffsetFull=20, tailOffsetFull=20, leftOffsetFull=20, rightOffsetFull=20,
                maxVelocityFull=100, maxAccFull=100, maxDecFull=100
            )
        ],
        sensors=[
            SensorConfig(
                id="s1", type="LASER", model="SICK", usageNavi=True, usageObs=True,
                offsetX=500.0, offsetY=0.0, offsetZ=200.0, yaw=0.0, pitch=0.0, roll=0.0,
                ip="192.168.1.88", port=2112
            )
        ],
        ioBoards=[
            IOBoardConfig(
                id="board1", model="IO_EXT", canNodeId=110, channels=16
            )
        ],
        ioPorts=[
            IOConfig(
                id="port1", port="DI01", logicBind="SAFETY_IO_EMC_STOP", originModel="board1"
            )
        ]
    )

    print("Running Core Engine...")
    zip_path = generate_industrial_modelset(payload)
    print(f"Generated at: {zip_path}")
    
    # Dump for verification
    out_dir = "/Users/wangfeifei/code/amr_studio_v4/gemini_audits/test_arch_out"
    os.makedirs(out_dir, exist_ok=True)
    with zipfile.ZipFile(zip_path, 'r') as zf:
        zf.extractall(out_dir)
        
    subprocess.run(["/Users/wangfeifei/code/amr_studio_v4/backend/venv/bin/python3", "/Users/wangfeifei/code/amr_studio_v4/gemini_audits/dump_generated.py"])
    print("Test Complete.")

if __name__ == "__main__":
    run_direct_engine_test()
