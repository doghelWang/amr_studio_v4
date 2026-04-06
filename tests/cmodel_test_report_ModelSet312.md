# CModel Bidirectional Test Report
══════════════════════════════════════════════════════════════════════
📊 TEST REPORT: CModel Real Data Test: ModelSet312.json
══════════════════════════════════════════════════════════════════════
Duration: 6ms | ✅ Pass: 3 | ❌ Fail: 1 | ⚠️ Warn: 4



[ImportCompleteness]
  ❌ [NO_PARTIAL_PARSE] Missing CHASSIS component in imported data

[ExportStructure]
  ✅ robotName: Imported_AMR
  ✅ moreModuleInfo has 0 groups

[ExportNoHardcode]
  ⚠️ Field "robotName" using fallback: Imported_AMR (no input value)
  ⚠️ Field "chassisLength" using fallback: undefined (no input value)
  ⚠️ Field "chassisWidth" using fallback: undefined (no input value)
  ⚠️ Field "headOffset" using fallback: undefined (no input value)

[RoundTrip]
  ✅ Module groups: 0 → 0
