import sys
import os
import shutil

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from schemas.api import GeneratePayload, WheelConfig, SensorConfig, IOBoardConfig, IOConfig
from core.protobuf_engine import generate_industrial_modelset

def build_amr(payload: GeneratePayload, output_name: str):
    print(f"Building {output_name}...")
    zip_path = generate_industrial_modelset(payload)
    output_path = os.path.join(os.path.dirname(__file__), output_name)
    shutil.copy2(zip_path, output_path)
    print(f"Saved to {output_path}")

def build_all():
    # Model 1: Differential
    payload1 = GeneratePayload(
        robotName="Demo_AMR_Diff",
        version="1.0",
        driveType="DIFF",
        navigationMethod="LIDAR_SLAM",
        wheels=[
            WheelConfig(id="w1", label="Left Wheel", mountX=0.0, mountY=250.0, mountYaw=0, orientation="LEFT", driverModel="ELMO", canBus="CAN_1", canNodeId=1, motorPolarity="NORMAL", zeroPos=0, leftLimit=0, rightLimit=0, headOffsetIdle=0, tailOffsetIdle=0, leftOffsetIdle=0, rightOffsetIdle=0, maxVelocityIdle=1500, maxAccIdle=800, maxDecIdle=800, headOffsetFull=0, tailOffsetFull=0, leftOffsetFull=0, rightOffsetFull=0, maxVelocityFull=1200, maxAccFull=500, maxDecFull=500),
            WheelConfig(id="w2", label="Right Wheel", mountX=0.0, mountY=-250.0, mountYaw=0, orientation="RIGHT", driverModel="ELMO", canBus="CAN_1", canNodeId=2, motorPolarity="REVERSE", zeroPos=0, leftLimit=0, rightLimit=0, headOffsetIdle=0, tailOffsetIdle=0, leftOffsetIdle=0, rightOffsetIdle=0, maxVelocityIdle=1500, maxAccIdle=800, maxDecIdle=800, headOffsetFull=0, tailOffsetFull=0, leftOffsetFull=0, rightOffsetFull=0, maxVelocityFull=1200, maxAccFull=500, maxDecFull=500)
        ],
        sensors=[
            SensorConfig(id="s1", type="LASER", model="SICK", usageNavi=True, usageObs=True, offsetX=450.0, offsetY=0.0, offsetZ=200.0, yaw=0.0, pitch=0.0, roll=0.0, ip="192.168.1.10", port=2112, connType="ETHERNET")
        ],
        ioBoards=[
            IOBoardConfig(id="io1", model="IO module", canNodeId=110, channels=18)
        ],
        ioPorts=[
            IOConfig(id="p1", port="DI01", logicBind="SAFETY_IO_EMC_STOP", originModel="io1")
        ]
    )

    # Model 2: Single Steer
    payload2 = GeneratePayload(
        robotName="Demo_AMR_SingleSteer",
        version="1.0",
        driveType="SINGLE_STEER",
        navigationMethod="VISUAL_SLAM",
        wheels=[
            WheelConfig(id="w1", label="Front Steer", mountX=300.0, mountY=0.0, mountYaw=0, orientation="CENTER", driverModel="ELMO", canBus="CAN_1", canNodeId=1, motorPolarity="NORMAL", zeroPos=0, leftLimit=-90, rightLimit=90, headOffsetIdle=0, tailOffsetIdle=0, leftOffsetIdle=0, rightOffsetIdle=0, maxVelocityIdle=1500, maxAccIdle=800, maxDecIdle=800, headOffsetFull=0, tailOffsetFull=0, leftOffsetFull=0, rightOffsetFull=0, maxVelocityFull=1200, maxAccFull=500, maxDecFull=500)
        ],
        sensors=[
            SensorConfig(id="s1", type="CAMERA", model="REALSENSE", usageNavi=True, usageObs=True, offsetX=450.0, offsetY=0.0, offsetZ=500.0, yaw=0.0, pitch=0.0, roll=0.0, ip="192.168.1.20", port=80, connType="ETHERNET")
        ],
        ioBoards=[
            IOBoardConfig(id="io1", model="IO module", canNodeId=110, channels=18)
        ],
        ioPorts=[
            IOConfig(id="p1", port="DI01", logicBind="SAFETY_IO_EMC_STOP", originModel="io1")
        ]
    )

    # Model 3: Dual Steer
    payload3 = GeneratePayload(
        robotName="Demo_AMR_DualSteer",
        version="1.0",
        driveType="DUAL_STEER",
        navigationMethod="HYBRID",
        wheels=[
            WheelConfig(id="w1", label="Front Steer", mountX=400.0, mountY=0.0, mountYaw=0, orientation="FRONT", driverModel="ELMO", canBus="CAN_1", canNodeId=1, motorPolarity="NORMAL", zeroPos=0, leftLimit=-90, rightLimit=90, headOffsetIdle=0, tailOffsetIdle=0, leftOffsetIdle=0, rightOffsetIdle=0, maxVelocityIdle=1500, maxAccIdle=800, maxDecIdle=800, headOffsetFull=0, tailOffsetFull=0, leftOffsetFull=0, rightOffsetFull=0, maxVelocityFull=1200, maxAccFull=500, maxDecFull=500),
            WheelConfig(id="w2", label="Rear Steer", mountX=-400.0, mountY=0.0, mountYaw=0, orientation="REAR", driverModel="ELMO", canBus="CAN_1", canNodeId=2, motorPolarity="NORMAL", zeroPos=0, leftLimit=-90, rightLimit=90, headOffsetIdle=0, tailOffsetIdle=0, leftOffsetIdle=0, rightOffsetIdle=0, maxVelocityIdle=1500, maxAccIdle=800, maxDecIdle=800, headOffsetFull=0, tailOffsetFull=0, leftOffsetFull=0, rightOffsetFull=0, maxVelocityFull=1200, maxAccFull=500, maxDecFull=500)
        ],
        sensors=[
            SensorConfig(id="s1", type="LASER", model="SICK", usageNavi=True, usageObs=True, offsetX=500.0, offsetY=300.0, offsetZ=200.0, yaw=45.0, pitch=0.0, roll=0.0, ip="192.168.1.10", port=2112, connType="ETHERNET"),
            SensorConfig(id="s2", type="LASER", model="SICK", usageNavi=True, usageObs=True, offsetX=-500.0, offsetY=-300.0, offsetZ=200.0, yaw=225.0, pitch=0.0, roll=0.0, ip="192.168.1.11", port=2112, connType="ETHERNET")
        ],
        ioBoards=[
            IOBoardConfig(id="io1", model="IO module", canNodeId=110, channels=18)
        ],
        ioPorts=[
            IOConfig(id="p1", port="DI01", logicBind="SAFETY_IO_EMC_STOP", originModel="io1"),
            IOConfig(id="p2", port="DI02", logicBind="SAFETY_IO_BUMPER", originModel="io1")
        ]
    )

    # Model 4: Quad Steer
    payload4 = GeneratePayload(
        robotName="Demo_AMR_QuadSteer",
        version="1.0",
        driveType="QUAD_STEER",
        navigationMethod="LIDAR_SLAM",
        wheels=[
            WheelConfig(id="w1", label="FL Steer", mountX=400.0, mountY=300.0, mountYaw=0, orientation="FRONT_LEFT", driverModel="ELMO", canBus="CAN_1", canNodeId=1, motorPolarity="NORMAL", zeroPos=0, leftLimit=-90, rightLimit=90, headOffsetIdle=0, tailOffsetIdle=0, leftOffsetIdle=0, rightOffsetIdle=0, maxVelocityIdle=1500, maxAccIdle=800, maxDecIdle=800, headOffsetFull=0, tailOffsetFull=0, leftOffsetFull=0, rightOffsetFull=0, maxVelocityFull=1200, maxAccFull=500, maxDecFull=500),
            WheelConfig(id="w2", label="FR Steer", mountX=400.0, mountY=-300.0, mountYaw=0, orientation="FRONT_RIGHT", driverModel="ELMO", canBus="CAN_1", canNodeId=2, motorPolarity="NORMAL", zeroPos=0, leftLimit=-90, rightLimit=90, headOffsetIdle=0, tailOffsetIdle=0, leftOffsetIdle=0, rightOffsetIdle=0, maxVelocityIdle=1500, maxAccIdle=800, maxDecIdle=800, headOffsetFull=0, tailOffsetFull=0, leftOffsetFull=0, rightOffsetFull=0, maxVelocityFull=1200, maxAccFull=500, maxDecFull=500),
            WheelConfig(id="w3", label="RL Steer", mountX=-400.0, mountY=300.0, mountYaw=0, orientation="REAR_LEFT", driverModel="ELMO", canBus="CAN_1", canNodeId=3, motorPolarity="NORMAL", zeroPos=0, leftLimit=-90, rightLimit=90, headOffsetIdle=0, tailOffsetIdle=0, leftOffsetIdle=0, rightOffsetIdle=0, maxVelocityIdle=1500, maxAccIdle=800, maxDecIdle=800, headOffsetFull=0, tailOffsetFull=0, leftOffsetFull=0, rightOffsetFull=0, maxVelocityFull=1200, maxAccFull=500, maxDecFull=500),
            WheelConfig(id="w4", label="RR Steer", mountX=-400.0, mountY=-300.0, mountYaw=0, orientation="REAR_RIGHT", driverModel="ELMO", canBus="CAN_1", canNodeId=4, motorPolarity="NORMAL", zeroPos=0, leftLimit=-90, rightLimit=90, headOffsetIdle=0, tailOffsetIdle=0, leftOffsetIdle=0, rightOffsetIdle=0, maxVelocityIdle=1500, maxAccIdle=800, maxDecIdle=800, headOffsetFull=0, tailOffsetFull=0, leftOffsetFull=0, rightOffsetFull=0, maxVelocityFull=1200, maxAccFull=500, maxDecFull=500)
        ],
        sensors=[
            SensorConfig(id="s1", type="LASER", model="SICK", usageNavi=True, usageObs=True, offsetX=500.0, offsetY=400.0, offsetZ=200.0, yaw=45.0, pitch=0.0, roll=0.0, ip="192.168.1.10", port=2112, connType="ETHERNET"),
            SensorConfig(id="s2", type="LASER", model="SICK", usageNavi=True, usageObs=True, offsetX=-500.0, offsetY=-400.0, offsetZ=200.0, yaw=225.0, pitch=0.0, roll=0.0, ip="192.168.1.11", port=2112, connType="ETHERNET"),
            SensorConfig(id="s3", type="CAMERA", model="REALSENSE", usageNavi=False, usageObs=True, offsetX=500.0, offsetY=0.0, offsetZ=500.0, yaw=0.0, pitch=0.0, roll=0.0, ip="192.168.1.20", port=80, connType="ETHERNET")
        ],
        ioBoards=[
            IOBoardConfig(id="io1", model="IO module", canNodeId=110, channels=18),
            IOBoardConfig(id="io2", model="IO module", canNodeId=111, channels=18)
        ],
        ioPorts=[
            IOConfig(id="p1", port="DI01", logicBind="SAFETY_IO_EMC_STOP", originModel="io1"),
            IOConfig(id="p2", port="DI02", logicBind="SAFETY_IO_BUMPER", originModel="io2")
        ]
    )

    build_amr(payload1, "AMR_Differential.zip")
    build_amr(payload2, "AMR_SingleSteer.zip")
    build_amr(payload3, "AMR_DualSteer.zip")
    build_amr(payload4, "AMR_QuadSteer.zip")

if __name__ == "__main__":
    build_all()
