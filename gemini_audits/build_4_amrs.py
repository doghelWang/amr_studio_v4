import sys
import os
import shutil
import uuid

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from schemas.api import GeneratePayload, WheelConfig, SensorConfig, IOBoardConfig, IOConfig
from core.protobuf_engine import generate_industrial_modelset

def build_amr(payload: GeneratePayload, output_name: str):
    print(f"Building Full-Fidelity {output_name}...")
    zip_path = generate_industrial_modelset(payload)
    output_path = os.path.join(os.path.dirname(__file__), output_name)
    shutil.copy2(zip_path, output_path)
    print(f"Saved to {output_path}")

def build_all():
    # --- Shared Core Infrastructure ---
    # Every robot in this fleet uses the standard Control Board and an IO Expander
    mcu = {"model": "RK3588_AMR_CONTROLLER", "canBuses": ["CAN_1", "CAN_2", "CAN_3"], "ethPorts": ["ETH_1", "ETH_2"]}
    
    # 1. AMR_Differential (The "Porter")
    # Configuration: Kinco Drivers, Hikrobot Laser, 2x Estop Buttons, LED Strip
    payload1 = GeneratePayload(
        robotName="Porter_Diff_V4",
        version="1.0",
        driveType="DIFF",
        navigationMethod="LIDAR_SLAM",
        wheels=[
            WheelConfig(id="w1", label="Left_Drive_Wheel", mountX=0.0, mountY=280.0, mountYaw=0, orientation="LEFT", driverModel="KINCO_FD124", canBus="CAN_1", canNodeId=1),
            WheelConfig(id="w2", label="Right_Drive_Wheel", mountX=0.0, mountY=-280.0, mountYaw=0, orientation="RIGHT", driverModel="KINCO_FD124", canBus="CAN_1", canNodeId=2)
        ],
        sensors=[
            SensorConfig(id="s1", type="LASER_2D", model="HIK_LIDAR_M1", usageNavi=True, usageObs=True, offsetX=450.0, offsetY=0.0, offsetZ=250.0, yaw=0.0, ip="192.168.1.10", port=5000),
            SensorConfig(id="s2", type="IMU", model="XSENS_MTI", usageNavi=True, usageObs=False, offsetX=0.0, offsetY=0.0, offsetZ=100.0, yaw=0.0, canNodeId=10)
        ],
        ioBoards=[
            IOBoardConfig(id="io_master", model="INDUSTRIAL_IO_18CH", canNodeId=110, channels=18)
        ],
        ioPorts=[
            IOConfig(id="p1", port="DI01", logicBind="SAFETY_IO_EMC_STOP", ioBoardId="io_master"),
            IOConfig(id="p2", port="DI02", logicBind="SAFETY_IO_EMC_STOP", ioBoardId="io_master"),
            IOConfig(id="p3", port="DO01", logicBind="LED_STATUS_GREEN", ioBoardId="io_master")
        ],
        auxiliary=[
            {"id": "bat1", "label": "HIK_BATTERY_48V", "type": "BATTERY", "details": {"capacity": "100Ah", "protocol": "CAN"}},
            {"id": "led1", "label": "STATUS_LED_STRIP", "type": "LED", "details": {"segments": 30}}
        ]
    )

    # 2. AMR_SingleSteer (The "Tugger")
    # Configuration: Zapi Traction, Kinco Lift, Front Camera, Rear Bumper
    payload2 = GeneratePayload(
        robotName="Tugger_SingleSteer_V4",
        version="1.0",
        driveType="SINGLE_STEER",
        navigationMethod="VISUAL_SLAM",
        wheels=[
            WheelConfig(id="w1", label="Front_Steer_Drive", mountX=500.0, mountY=0.0, mountYaw=0, orientation="CENTER", driverModel="ZAPI_TRIO_1500W", canBus="CAN_1", canNodeId=1)
        ],
        sensors=[
            SensorConfig(id="s1", type="CAMERA_BINOCULAR", model="REALSENSE_D435I", usageNavi=True, usageObs=True, offsetX=550.0, offsetY=0.0, offsetZ=800.0, yaw=0.0, ip="192.168.1.20"),
            SensorConfig(id="s2", type="LASER_2D", model="SICK_TIM561", usageNavi=False, usageObs=True, offsetX=-400.0, offsetY=0.0, offsetZ=200.0, yaw=180.0, ip="192.168.1.21")
        ],
        ioBoards=[
            IOBoardConfig(id="io_tug", model="INDUSTRIAL_IO_18CH", canNodeId=110, channels=18)
        ],
        ioPorts=[
            IOConfig(id="p1", port="DI01", logicBind="SAFETY_IO_EMC_STOP", ioBoardId="io_tug"),
            IOConfig(id="p2", port="DI03", logicBind="BUMPER_REAR", ioBoardId="io_tug")
        ],
        actuators=[
            {"id": "lift1", "label": "KINCO_LIFT_MOTOR", "type": "ACTUATOR", "details": {"stroke": "500mm"}}
        ]
    )

    # 3. AMR_DualSteer (The "Omni-Platform")
    # Configuration: Dual Kinco Horizontal Steer, Dual SICK Lasers
    payload3 = GeneratePayload(
        robotName="Omni_DualSteer_V4",
        version="1.0",
        driveType="DUAL_STEER",
        navigationMethod="HYBRID",
        wheels=[
            WheelConfig(id="w1", label="FRONT_STEER", mountX=600.0, mountY=0.0, mountYaw=0, orientation="FRONT", driverModel="KINCO_HS_SERVO", canBus="CAN_1", canNodeId=1),
            WheelConfig(id="w2", label="REAR_STEER", mountX=-600.0, mountY=0.0, mountYaw=0, orientation="REAR", driverModel="KINCO_HS_SERVO", canBus="CAN_1", canNodeId=2)
        ],
        sensors=[
            SensorConfig(id="s1", type="LASER_2D", model="SICK_S300_FRONT", usageNavi=True, usageObs=True, offsetX=700.0, offsetY=350.0, offsetZ=200.0, yaw=45.0, ip="192.168.1.30"),
            SensorConfig(id="s2", type="LASER_2D", model="SICK_S300_REAR", usageNavi=True, usageObs=True, offsetX=-700.0, offsetY=-350.0, offsetZ=200.0, yaw=225.0, ip="192.168.1.31")
        ],
        ioBoards=[
            IOBoardConfig(id="io_omni", model="INDUSTRIAL_IO_18CH", canNodeId=110, channels=18)
        ],
        ioPorts=[
            IOConfig(id="p1", port="DI01", logicBind="SAFETY_IO_EMC_STOP", ioBoardId="io_omni")
        ]
    )

    # 4. AMR_QuadSteer (The "Heavy-Lifter")
    # Configuration: 4x Kinco Drive, 4x Breit Encoders, Dual Laser + 1x Camera
    payload4 = GeneratePayload(
        robotName="Lifter_QuadSteer_V4",
        version="1.0",
        driveType="QUAD_STEER",
        navigationMethod="LIDAR_SLAM",
        wheels=[
            WheelConfig(id="w1", label="FL_DRIVE", mountX=500.0, mountY=400.0, mountYaw=0, orientation="FRONT_LEFT", driverModel="KINCO_FD124", canBus="CAN_1", canNodeId=1),
            WheelConfig(id="w2", label="FR_DRIVE", mountX=500.0, mountY=-400.0, mountYaw=0, orientation="FRONT_RIGHT", driverModel="KINCO_FD124", canBus="CAN_1", canNodeId=2),
            WheelConfig(id="w3", label="RL_DRIVE", mountX=-500.0, mountY=400.0, mountYaw=0, orientation="REAR_LEFT", driverModel="KINCO_FD124", canBus="CAN_1", canNodeId=3),
            WheelConfig(id="w4", label="RR_DRIVE", mountX=-500.0, mountY=-400.0, mountYaw=0, orientation="REAR_RIGHT", driverModel="KINCO_FD124", canBus="CAN_1", canNodeId=4)
        ],
        sensors=[
            SensorConfig(id="s1", type="LASER_2D", model="HIK_LIDAR_M1_F", usageNavi=True, usageObs=True, offsetX=600.0, offsetY=0.0, offsetZ=200.0, yaw=0.0, ip="192.168.1.10"),
            SensorConfig(id="s2", type="CAMERA_BINOCULAR", model="ORBBEC_ASTRA", usageNavi=False, usageObs=True, offsetX=600.0, offsetY=0.0, offsetZ=1200.0, yaw=0.0, ip="192.168.1.40")
        ],
        others=[
            {"id": "enc1", "label": "BREIT_ENC_FL", "type": "ENCODER", "details": {"bus": "CAN_2"}},
            {"id": "enc2", "label": "BREIT_ENC_FR", "type": "ENCODER", "details": {"bus": "CAN_2"}},
            {"id": "enc3", "label": "BREIT_ENC_RL", "type": "ENCODER", "details": {"bus": "CAN_2"}},
            {"id": "enc4", "label": "BREIT_ENC_RR", "type": "ENCODER", "details": {"bus": "CAN_2"}}
        ]
    )

    build_amr(payload1, "AMR_Differential.cmodel")
    build_amr(payload2, "AMR_SingleSteer.cmodel")
    build_amr(payload3, "AMR_DualSteer.cmodel")
    build_amr(payload4, "AMR_QuadSteer.cmodel")

if __name__ == "__main__":
    build_all()
