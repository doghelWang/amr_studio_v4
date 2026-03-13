import sys
import os
import shutil

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from schemas.api import GeneratePayload, WheelConfig, SensorConfig, IOBoardConfig, IOConfig
from core.protobuf_engine import generate_industrial_modelset

def build_amr(payload: GeneratePayload, output_name: str):
    print(f"Building {output_name}...")
    # Using default template as base since these are "New" models
    zip_path = generate_industrial_modelset(payload)
    output_path = os.path.join(os.path.dirname(__file__), output_name)
    shutil.copy2(zip_path, output_path)
    print(f"Saved to {output_path}")

def build_all():
    # Model 1: Differential (Kinco, Hikrobot, 2x Estop, Hik Battery)
    payload1 = GeneratePayload(
        robotName="Kinco_Hik_Diff_AMR",
        version="1.0",
        driveType="DIFF",
        navigationMethod="LIDAR_SLAM",
        wheels=[
            WheelConfig(id="w1", label="L_Wheel", mountX=0.0, mountY=300.0, orientation="LEFT", driverModel="KINCO_SERVO", canBus="CAN0", canNodeId=1),
            WheelConfig(id="w2", label="R_Wheel", mountX=0.0, mountY=-300.0, orientation="RIGHT", driverModel="KINCO_SERVO", canBus="CAN0", canNodeId=2)
        ],
        sensors=[
            SensorConfig(id="s1", type="LASER_2D", model="HIKROBOT_LASER", usageNavi=True, usageObs=True, offsetX=500.0, offsetY=0.0, offsetZ=200.0, ip="192.168.1.10")
        ],
        ioBoards=[
            IOBoardConfig(id="io1", label="Main_IO", model="STANDARD_IO", canNodeId=110)
        ],
        ioPorts=[
            IOConfig(id="p1", port="DI01", logicBind="SAFETY_IO_EMC_STOP", ioBoardId="io1"),
            IOConfig(id="p2", port="DI02", logicBind="SAFETY_IO_EMC_STOP", ioBoardId="io1")
        ],
        others=[
            {"id": "bat1", "label": "HIKROBOT_Battery", "type": "AUXILIARY", "details": {"capacity": "100Ah", "voltage": "48V"}}
        ]
    )

    # Model 2: Single Steer (Zapi Traction, Kinco Lift, 1x Estop, 3x Lasers)
    payload2 = GeneratePayload(
        robotName="Zapi_Kinco_SingleSteer",
        version="1.0",
        driveType="SINGLE_STEER",
        navigationMethod="VISUAL_SLAM",
        wheels=[
            WheelConfig(id="w1", label="Traction_Steer", mountX=400.0, mountY=0.0, orientation="CENTER", driverModel="ZAPI_TRIO", canBus="CAN0", canNodeId=1)
        ],
        sensors=[
            SensorConfig(id="s1", type="LASER_2D", model="NAV_LASER", usageNavi=True, usageObs=True, offsetX=500.0, offsetY=0.0, offsetZ=300.0, ip="192.168.1.10"),
            SensorConfig(id="s2", type="LASER_2D", model="OBS_LASER_L", usageNavi=False, usageObs=True, offsetX=450.0, offsetY=250.0, offsetZ=150.0, ip="192.168.1.11"),
            SensorConfig(id="s3", type="LASER_2D", model="OBS_LASER_R", usageNavi=False, usageObs=True, offsetX=450.0, offsetY=-250.0, offsetZ=150.0, ip="192.168.1.12")
        ],
        ioPorts=[
            IOConfig(id="p1", port="DI01", logicBind="SAFETY_IO_EMC_STOP", ioBoardId="io1")
        ],
        actuators=[
            {"id": "lift1", "label": "Kinco_Lift_Motor", "type": "ACTUATOR", "details": {"function": "lifting"}}
        ]
    )

    # Model 3: Dual Steer (Kinco Horizontal Steer Wheels)
    payload3 = GeneratePayload(
        robotName="Kinco_DualSteer_Omni",
        version="1.0",
        driveType="DUAL_STEER",
        navigationMethod="HYBRID",
        wheels=[
            WheelConfig(id="w1", label="Front_Kinco_Steer", mountX=500.0, mountY=0.0, orientation="CENTER", driverModel="KINCO_HORIZ_STEER", canBus="CAN0", canNodeId=1),
            WheelConfig(id="w2", label="Rear_Kinco_Steer", mountX=-500.0, mountY=0.0, orientation="CENTER", driverModel="KINCO_HORIZ_STEER", canBus="CAN0", canNodeId=2)
        ],
        sensors=[
            SensorConfig(id="s1", type="LASER_2D", model="SICK_TIM", usageNavi=True, usageObs=True, offsetX=600.0, offsetY=0.0, offsetZ=200.0, ip="192.168.1.10")
        ]
    )

    # Model 4: Quad Steer (Kinco Drivers, Breit Encoders)
    payload4 = GeneratePayload(
        robotName="Kinco_Breit_QuadSteer",
        version="1.0",
        driveType="QUAD_STEER",
        navigationMethod="LIDAR_SLAM",
        wheels=[
            WheelConfig(id="w1", label="FL_Steer", mountX=400.0, mountY=300.0, orientation="FRONT_LEFT", driverModel="KINCO_SERVO", canBus="CAN0", canNodeId=1),
            WheelConfig(id="w2", label="FR_Steer", mountX=400.0, mountY=-300.0, orientation="FRONT_RIGHT", driverModel="KINCO_SERVO", canBus="CAN0", canNodeId=2),
            WheelConfig(id="w3", label="RL_Steer", mountX=-400.0, mountY=300.0, orientation="REAR_LEFT", driverModel="KINCO_SERVO", canBus="CAN0", canNodeId=3),
            WheelConfig(id="w4", label="RR_Steer", mountX=-400.0, mountY=-300.0, orientation="REAR_RIGHT", driverModel="KINCO_SERVO", canBus="CAN0", canNodeId=4)
        ],
        others=[
            {"id": "enc1", "label": "Breit_Encoder_FL", "type": "SENSOR", "details": {"brand": "Breit"}},
            {"id": "enc2", "label": "Breit_Encoder_FR", "type": "SENSOR", "details": {"brand": "Breit"}},
            {"id": "enc3", "label": "Breit_Encoder_RL", "type": "SENSOR", "details": {"brand": "Breit"}},
            {"id": "enc4", "label": "Breit_Encoder_RR", "type": "SENSOR", "details": {"brand": "Breit"}}
        ]
    )

    build_amr(payload1, "AMR_Differential.cmodel")
    build_amr(payload2, "AMR_SingleSteer.cmodel")
    build_amr(payload3, "AMR_DualSteer.cmodel")
    build_amr(payload4, "AMR_QuadSteer.cmodel")

if __name__ == "__main__":
    build_all()
