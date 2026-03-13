# AMR Studio Pro V4 — 全功能模型深度审计报告

**审计时间**: 2026-03-13
**审计标准**: 参考 312 模型（含 MCU、IO、6D 位姿、连接关系）

---

## 📦 模型成果物: AMR_Differential.cmodel
*   **机器人名称**: Porter_Diff_V4
*   **底盘构型**: DIFFERENTIAL
*   **核心主控**: RK3588_AMR_CONTROLLER (已注入)
### 1. 运动控制 (Wheels & Kinematics)
*   **轮组数量**: 1 组
    - **Steerwheel**: X=0, Y=0. CAN ID: 1
### 2. 环境感知 (Sensors)
*   **传感器数量**: 8 个
    - **gyro**: 型号: gyro, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **laser0**: 型号: laser0, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **TofiEncoder**: 型号: TofiEncoder, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **laser1**: 型号: laser1, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **RHIK_LIDAR_M1**: 型号: RHIK_LIDAR_M1, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **XSENS_MTI**: 型号: XSENS_MTI, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **HIK_BATTERY_48V**: 型号: HIK_BATTERY_48V, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **STATUS_LED_STRIP**: 型号: STATUS_LED_STRIP, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
### 3. 电气与 IO 映射 (Electrical & Logic)
*   **IO 模块**: 1 块 (节点 ID: 110)
*   **安全逻辑绑定**: 
    - SAFETY_IO_EMC_STOP -> 绑定至 IO 模块 DI01/DI02
### 4. 辅助与非标件 (Others)
*   **执行器**: 6 个
    - walk-motor
    - steer-motor
    - kinco steer driver
    - lift-motor
    - ZAPI DRIVER
    - lift_motor_bdc
*   **辅助件**: 2 个
    - MainController
    - button

---

## 📦 模型成果物: AMR_SingleSteer.cmodel
*   **机器人名称**: Tugger_SingleSteer_V4
*   **底盘构型**: DIFFERENTIAL
*   **核心主控**: RK3588_AMR_CONTROLLER (已注入)
### 1. 运动控制 (Wheels & Kinematics)
*   **轮组数量**: 1 组
    - **Steerwheel**: X=0, Y=0. CAN ID: 1
### 2. 环境感知 (Sensors)
*   **传感器数量**: 7 个
    - **gyro**: 型号: gyro, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **laser0**: 型号: laser0, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **TofiEncoder**: 型号: TofiEncoder, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **laser1**: 型号: laser1, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **REALSENSE_D435I**: 型号: REALSENSE_D435I, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **SICK_TIM561**: 型号: SICK_TIM561, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **KINCO_LIFT_MOTOR**: 型号: KINCO_LIFT_MOTOR, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
### 3. 电气与 IO 映射 (Electrical & Logic)
*   **IO 模块**: 1 块 (节点 ID: 110)
*   **安全逻辑绑定**: 
    - SAFETY_IO_EMC_STOP -> 绑定至 IO 模块 DI01/DI02
### 4. 辅助与非标件 (Others)
*   **执行器**: 6 个
    - walk-motor
    - steer-motor
    - kinco steer driver
    - lift-motor
    - ZAPI DRIVER
    - lift_motor_bdc
*   **辅助件**: 2 个
    - MainController
    - button

---

## 📦 模型成果物: AMR_DualSteer.cmodel
*   **机器人名称**: Omni_DualSteer_V4
*   **底盘构型**: DUAL_STEER
*   **核心主控**: RK3588_AMR_CONTROLLER (已注入)
### 1. 运动控制 (Wheels & Kinematics)
*   **轮组数量**: 1 组
    - **Steerwheel**: X=0, Y=0. CAN ID: 1
### 2. 环境感知 (Sensors)
*   **传感器数量**: 6 个
    - **gyro**: 型号: gyro, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **laser0**: 型号: laser0, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **TofiEncoder**: 型号: TofiEncoder, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **laser1**: 型号: laser1, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **SICK_S300_FRONT**: 型号: SICK_S300_FRONT, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **SICK_S300_REAR**: 型号: SICK_S300_REAR, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
### 3. 电气与 IO 映射 (Electrical & Logic)
*   **IO 模块**: 1 块 (节点 ID: 110)
*   **安全逻辑绑定**: 
    - SAFETY_IO_EMC_STOP -> 绑定至 IO 模块 DI01/DI02
### 4. 辅助与非标件 (Others)
*   **执行器**: 6 个
    - walk-motor
    - steer-motor
    - kinco steer driver
    - lift-motor
    - ZAPI DRIVER
    - lift_motor_bdc
*   **辅助件**: 2 个
    - MainController
    - button

---

## 📦 模型成果物: AMR_QuadSteer.cmodel
*   **机器人名称**: Lifter_QuadSteer_V4
*   **底盘构型**: QUAD_STEER
*   **核心主控**: RK3588_AMR_CONTROLLER (已注入)
### 1. 运动控制 (Wheels & Kinematics)
*   **轮组数量**: 1 组
    - **Steerwheel**: X=0, Y=0. CAN ID: 1
### 2. 环境感知 (Sensors)
*   **传感器数量**: 6 个
    - **gyro**: 型号: gyro, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **laser0**: 型号: laser0, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **TofiEncoder**: 型号: TofiEncoder, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **laser1**: 型号: laser1, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **HIK_LIDAR_M1_F**: 型号: HIK_LIDAR_M1_F, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
    - **RORBBEC_ASTRA**: 型号: RORBBEC_ASTRA, Poses: [X:0, Y:0, Z:0, Yaw:None]. 通信: CAN
### 3. 电气与 IO 映射 (Electrical & Logic)
*   **IO 模块**: 0 块 (节点 ID: 110)
*   **安全逻辑绑定**: 
    - SAFETY_IO_EMC_STOP -> 绑定至 IO 模块 DI01/DI02
### 4. 辅助与非标件 (Others)
*   **执行器**: 6 个
    - walk-motor
    - steer-motor
    - kinco steer driver
    - lift-motor
    - ZAPI DRIVER
    - lift_motor_bdc
*   **辅助件**: 2 个
    - MainController
    - button

---

