# PROTO-FIRST 审计记录 — 2026-04-07

## 审计任务
- **关联任务**: #37 修正底盘性能属性数据
- **任务策略**: 完整协议优先 (选项 B)
- **合规目标**: §1 NO_HARDCODE, §2 NO_PARTIAL_PARSE, §3 PROTO_FIRST

---

## 🔴 关键发现 #1: JSON Key 名称硬编码问题

### 问题描述
**ImportService.ts** 使用硬编码字符串查找性能属性：

```typescript
const findVal = (key: string) => this.deepFindAttributeValue(chassis.privateAttrs, key);
identity.maxSpeed = Number(findVal('maxSpeed(Idle)')) || 0;
identity.maxSpeedFull = Number(findVal('maxSpeed (Full Load)')) || (identity.maxSpeed * ratios.maxSpeed);
```

### Proto Schema 分析
查阅 `controller_model_comp_desc.proto` 发现：

```protobuf
message Message_Struct_Param {
  repeated Message_Base_Element extend_params = 1;  // 安装位姿
  repeated Message_Base_Group_Element segmented_limits_params = 2;  // 性能限制
}
```

**Proto 中并没有 `'maxSpeed(Idle)'` 或 `'maxSpeed (Full Load)'` 这样的 key**！

### 根因分析
1. **Source of Truth 混淆**: Proto 定义 vs JSON Model Desc 文件的 key 不一致2. **硬编码假设**: 代码假设 JSON 结构使用特定命名惯例，而非基于 Schema 动态查找3. **维护性风险**: 当后端 JSON 格式变化时，前端代码会静默失败

### 验证问题 (用于交叉验证 P1)
**关于 "maxSpeedFull 应为 1000 (当前显示 960)"**：- **假设 A**: Model Desc JSON 中确实包含 `"maxSpeed (Full Load)": 1000`
  - 如果是这样，find 逻辑应该找到它，问题可能是 key 名称不匹配 (空格/大小写)
  
- **假设 B**: Model Desc JSON 中没有 Full Load 字段
  - 当前代码使用 `0.8 * 1200 = 960` 的计算逻辑，但工程师期望 1000
  - 这表明计算比率可能需要调整，或应优先使用默认值而非计算

**交叉验证需求**: 需要提供真实的 Model Desc JSON 样本来验证 key 名称。

---

## 🟡 关键发现 #2: Missing Rotation Performance Fields

### RobotIdentity 接口定义 (types.ts)
```typescript
export interface RobotIdentity {
  // ... existing fields ...
  maxRotSpeed?: number;           // ✅ 已定义
  maxRotAccel?: number;           // ✅ 已定义
  rotateMaxAngSpeed?: number;     // ✅ 已定义
  rotateMaxAngAcceleration?: number; // ✅ 已定义
  // ❌ Missing Full Load variants:
  // maxRotSpeedFull?: number;
  // maxRotAccelFull?: number;
  // rotateMaxAngSpeedFull?: number;
  // rotateMaxAngAccelerationFull?: number;
}
```

### Proto 对应字段
Proto `segmented_limits_params` 可能包含的旋转性能字段：
- `rotateMaxAngSpeed (Idle)` - 旋转最大角速度
- `rotateMaxAngSpeed (Full Load)` - 满载时旋转最大角速度
- `rotateMaxAngAcceleration (Idle)` - 旋转最大角加速度
- ...

**问题**: Types 定义了 Idle 字段，但未定义 Full Load 变体。

---

## 🟡 关键发现 #3: ExportService 字段完整性

**未看到 ExportService.ts 文件**，但基于 ImportService 的缺失字段，推测 Export 可能同样不完整。

需要检查：
1. 所有 `RobotIdentity` 字段是否都被导出？
2. Full Load 变体是否正确序列化？
3. 旋转性能字段是否被包含？

---

## ✅ 修复策略决策

基于用户指令 "采用选项 B (完整协议优先) 并记录问题用于交叉验证"：

### 阶段 1: 紧急修复 (保持现有功能)
1. **确认 Model Desc JSON 中的真实 key 名称**
2. **修复 maxSpeedFull 计算逻辑** — 优先使用 JSON 中的显式值
3. **添加缺失的旋转字段 Full Load 变体**

### 阶段 2: 协议对齐 (PROTO_FIRST)
1. **创建 FIELD_REGISTRY** — 基于真实 JSON 结构
2. **生成 key 名称映射表** — 确保所有可能使用的 key都被覆盖
3. **实现 validateImport()** — 验证所有字段都被解析

### 阶段 3: 交叉验证
1. **使用真实 .cmodel 文件测试**
2. **验证 Idle → Full Load 计算正确性**
3. **确认 display 960 vs 1000 的根本原因**

---

## 📋 待验证假设清单

| # | 假设 | 验证方法 | 状态 |
|---|------|----------|------|
| 1 | Model Desc JSON 中有明确的 `maxSpeed (Full Load)` 字段 | 检查真实 JSON 文件 | ⏳ |
| 2 | `maxSpeed (Full Load)` key 名称中空格正确 | 比较 Proto vs JSON | ⏳ |
| 3 | 比率 0.8 是硬编码而非来自 Schema | 检查 PerformanceConfig.ts | ✅ 已确认 |
| 4 | ExportService 缺失相同字段 | 检查 ExportService.ts | ⏳ |
| 5 | 旋转性能 Full Load 变体不需要 | 确认业务需求 | ⏳ |

---

## 🛠️ 下一步行动

1. 用户提供 Model Desc JSON 样本来验证 key 名称
2. 修复 ImportService.ts 的硬编码问题
3. 添加缺失的 rotation Full Load 字段
4. 验证修复后的数值计算 (960 → 1000)

---

**审计人**: Claude Code**时间**: 2026-04-07
**版本**: 1.0
