# CModel Bidirectional Test Report
══════════════════════════════════════════════════════════════════════
📊 TEST REPORT: CModel Real Data Test: CompDesc.json
══════════════════════════════════════════════════════════════════════
Duration: 7ms | ✅ Pass: 46 | ❌ Fail: 0 | ⚠️ Warn: 4



[ImportCompleteness]
  ✅ Shape field "length" = 1476
  ✅ Shape field "width" = 1063
  ✅ Shape field "height" = 178
  ✅ Identity field "headOffset" = 738
  ✅ Identity field "tailOffset" = 738
  ✅ Identity field "leftOffset" = 531.5
  ✅ Identity field "rightOffset" = 531.5
  ✅ Identity field "maxSpeed" = 800
  ✅ Identity field "maxAccel" = 500
  ✅ Identity field "maxDecel" = 400
  ✅ Identity field "avoidMaxDec" = 200
  ✅ Identity field "rotateMaxAngSpeed" = 100
  ✅ Identity field "rotateMaxAngAcceleration" = 200
  ✅ Identity field "headOffsetFull" = 738
  ✅ Identity field "tailOffsetFull" = 738
  ✅ Identity field "leftOffsetFull" = 531.5
  ✅ Identity field "rightOffsetFull" = 531.5
  ✅ Identity field "maxSpeedFull" = 600
  ✅ Identity field "maxAccelFull" = 200
  ✅ Identity field "maxDecelFull" = 200
  ✅ Identity field "avoidMaxDecFull" = 200

[ImportSummary]
  ✅ [IMPORT] Chassis '通用差速底盘' L=1476 W=1063 H=178 Components=20 Identity fields parsed

[ExportStructure]
  ✅ robotName: Imported_AMR
  ✅ moreModuleInfo has 20 groups

[ExportNoHardcode]
  ⚠️ Field "robotName" using fallback: Imported_AMR (no input value)
  ⚠️ Field "chassisLength" using fallback: 1476 (no input value)
  ⚠️ Field "chassisWidth" using fallback: 1063 (no input value)
  ✅ Field "headOffset" preserved: 738

[RoundTrip]
  ⚠️ Module groups: 19 → 20
  ✅ Chassis shape: L=1476 W=1063 H=178

[MountCoordinates]
  ✅ Component 通用差速底盘: X=0 Y=0 Z=0
  ✅ Component 通用差速轮: X=0 Y=450 Z=0
  ✅ Component 通用差速轮: X=0 Y=-450 Z=0
  ✅ Component 步科: X=0 Y=0 Z=0
  ✅ Component 步科: X=0 Y=0 Z=0
  ✅ Component 步科: X=0 Y=0 Z=0
  ✅ Component 步科电机: X=0 Y=0 Z=0
  ✅ Component 步科电机: X=0 Y=0 Z=0
  ✅ Component 步科电机: X=0 Y=0 Z=0
  ✅ Component %急停按钮线,Mizu2F转急停开关,70mm,红/黑: X=700 Y=500 Z=50
  ✅ Component 通用灯带: X=0 Y=0 Z=0
  ✅ Component charger: X=0 Y=0 Z=0
  ✅ Component 四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端: X=508 Y=-181 Z=100
  ✅ Component 板载陀螺仪: X=0 Y=0 Z=0
  ✅ Component 通用读码器: X=0 Y=40 Z=145
  ✅ Component 通用读码器: X=0 Y=-40 Z=100
  ✅ Component 前激光: X=700 Y=0 Z=80
  ✅ Component IO module: X=0 Y=0 Z=0
  ✅ Component 自制&接近传感器,SP12-04BNA,索迪龙，4mm: X=0 Y=0 Z=0
  ✅ Component 自制&接近传感器,SP12-04BNA,索迪龙，4mm: X=0 Y=0 Z=0
