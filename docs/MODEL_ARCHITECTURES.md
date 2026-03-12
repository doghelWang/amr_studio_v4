# AMR Studio Pro V4 — 成果物结构化描述文档 (Model Architectures)

本文档对通过 V4 引擎自主构建的 4 款工业标准 AMR 模型（`.cmodel`）进行详细的物理与电气结构描述。

---

## 1. AMR_Differential.cmodel (差速底盘)
**定位**: 经典的双轮差速驱动物流机器人，适用于常规厂内搬运。
*   **物理底盘 (DriveType)**: `DIFF` (differential)
*   **导航模式 (Navigation)**: `LIDAR_SLAM` (激光自然轮廓/反射板导航)
*   **轮组配置 (Wheels)**:
    *   **Left Wheel**: X=0, Y=250. 左置差速轮, CAN_1 总线, 节点ID=1, 电机极性 NORMAL。
    *   **Right Wheel**: X=0, Y=-250. 右置差速轮, CAN_1 总线, 节点ID=2, 电机极性 REVERSE。
*   **传感器 (Sensors)**:
    *   **SICK Laser**: X=450, Y=0, Z=200. 前向 2D 激光雷达, 连接至 ETHERNET, IP=`192.168.1.10:2112`。
*   **电气与安全 (IO & Safety)**:
    *   **IO Board**: 1 块标准 IO 扩展板, 挂载于 CAN 总线 (节点 110)，动态提供 18 通道。
    *   **安全映射**: `DI01` 绑定为全局急停 (`SAFETY_IO_EMC_STOP`)。

---

## 2. AMR_SingleSteer.cmodel (单舵轮底盘)
**定位**: 常见的叉车或前置牵引型 AMR。
*   **物理底盘**: `SINGLE_STEER` (steerChassis)
*   **导航模式**: `VISUAL_SLAM` (视觉 SLAM)
*   **轮组配置**:
    *   **Front Steer**: X=300, Y=0. 前置居中单舵轮, 节点ID=1。支持 ±90° 转向角限制。
*   **传感器**:
    *   **Realsense Camera**: X=450, Y=0, Z=500. 视觉感知相机, ETHERNET 连接, IP=`192.168.1.20:80`。
*   **电气与安全**:
    *   配备单块 IO 扩展板 (ID 110)，用于车辆控制和急停采集。

---

## 3. AMR_DualSteer.cmodel (双舵轮底盘)
**定位**: 适用于狭小过道，支持原地自旋和平移的全向搬运平台。
*   **物理底盘**: `DUAL_STEER` (dualSteerChassis)
*   **导航模式**: `HYBRID` (混合导航)
*   **轮组配置**:
    *   **Front Steer**: X=400, Y=0. 前舵轮, CAN Node 1。
    *   **Rear Steer**: X=-400, Y=0. 后舵轮, CAN Node 2。
*   **传感器 (对角线布局)**:
    *   **SICK Laser 1**: X=500, Y=300, Yaw=45°. 右前对角激光, IP `192.168.1.10`。
    *   **SICK Laser 2**: X=-500, Y=-300, Yaw=225°. 左后对角激光, IP `192.168.1.11`。
*   **电气与安全**:
    *   IO Board (ID 110)。
    *   **逻辑映射**: 增加了 `SAFETY_IO_BUMPER` (防撞条) 映射。

---

## 4. AMR_QuadSteer.cmodel (四舵轮全向底盘)
**定位**: 顶级重载或高精度对接平台，四轮独立转向与驱动。
*   **物理底盘**: `QUAD_STEER` (quadSteerChassis)
*   **导航模式**: `LIDAR_SLAM`
*   **轮组配置 (对称矩形分布)**:
    *   FL (左前): X=400, Y=300, Node 1
    *   FR (右前): X=400, Y=-300, Node 2
    *   RL (左后): X=-400, Y=300, Node 3
    *   RR (右后): X=-400, Y=-300, Node 4
*   **复合感知 (Sensors)**:
    *   2 台对角线激光雷达 (SICK) + 1 台正前方深度相机 (REALSENSE)。
*   **深度电气与安全 (Cascaded IO)**:
    *   级联了 **2 块 IO 扩展板** (节点 110 和 111)，提供多达 36 个物理通道，分别管理急停与局部防撞传感器。
