# CModel Bidirectional Test Report
══════════════════════════════════════════════════════════════════════
📊 TEST REPORT: CModel Bidirectional Test Suite
══════════════════════════════════════════════════════════════════════
Duration: 6ms | ✅ Pass: 30 | ❌ Fail: 0 | ⚠️ Warn: 0



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

[ExportStructure]
  ✅ robotName: TestAMR
  ✅ moreModuleInfo has 1 groups

[ExportNoHardcode]
  ✅ Field "chassisLength" correctly exports value 1200
  ✅ Field "chassisWidth" correctly exports value 800
  ✅ Field "headOffset" correctly exports value 600
  ✅ Field "leftOffset" correctly exports value 400

[RoundTrip]
  ✅ robotName survived round-trip: RoundTripTest
  ✅ Component count survived: 1

[MountCoordinates]
  ✅ Component 测试底盘 mount coordinates valid
