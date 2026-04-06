# AMR Studio V4 - 数据完整性约束规范

> 本文档定义了防止数据字段遗漏的强制性规则
> 版本: 1.0
> 最后更新: 2026-04-06

---

## §1. 核心原则

### §1.1 NO_PARTIAL_EXPORT (禁止部分导出)
**所有数据转换操作必须完整处理所有字段，禁止选择性导出。**

```
❌ 禁止: 手动列出字段
exportToCModel(config) {
  return {
    field1: config.field1,  // 容易导致遗漏
    field2: config.field2,
    // field3 被遗忘...
  }
}

✅ 必须: 使用字段注册表 + 遍历
const ALL_FIELDS = ['field1', 'field2', 'field3', ...] as const;

exportToCModel(config) {
  const result = {};
  for (const field of ALL_FIELDS) {
    result[field] = config[field];  // 强制处理所有字段
  }
  return result;
}
```

### §1.2 单一数据源原则
**字段清单必须在代码中显式定义，且只定义一次。**

```typescript
// types.ts - 权威定义
export interface RobotIdentity {
  // 添加新字段时必须同步更新 REGISTRY
  newField: string;
}

// ExportService.ts - 字段注册表必须与 interface 同步
const ROBOT_IDENTITY_FIELDS = [
  'newField', // ← 必须同时添加
  ...
] as const;
```

---

## §2. 强制检查清单

### §2.1 修改 types.ts 时的强制步骤

当添加/修改/删除 `RobotIdentity` 字段时：

```
□ 1. 更新 src/store/types.ts 中的 interface
□ 2. 更新 src/services/ExportService.ts 中的 ROBOT_IDENTITY_FIELDS
□ 3. 更新 tests/ExportService.ts 中的 ROBOT_IDENTITY_FIELDS
□ 4. 运行 npm run build 验证无编译错误
□ 5. 运行 npm run test:detailed 验证所有字段通过
□ 6. 更新本文档的字段清单
```

### §2.2 完整字段清单 (RobotIdentity)

```typescript
const ROBOT_IDENTITY_FIELDS = [
  // General identity
  'robotName', 'version', 'materialCode', 'alias', 'venderName',
  'selfWeight', 'totalLoadWeight', 'navigationMethod', 'driveType', 'chassisShape',
  // Shape Dimensions
  'chassisLength', 'chassisWidth', 'chassisHeight',
  // Motion Center Offsets - Idle
  'headOffset', 'tailOffset', 'leftOffset', 'rightOffset',
  // Motion Center Offsets - Full Load
  'headOffsetFull', 'tailOffsetFull', 'leftOffsetFull', 'rightOffsetFull',
  // Performance - Idle
  'maxSpeed', 'maxAccel', 'maxDecel', 'avoidMaxDec',
  'rotateMaxAngSpeed', 'rotateMaxAngAcceleration',
  // Performance - Full Load
  'maxSpeedFull', 'maxAccelFull', 'maxDecelFull', 'avoidMaxDecFull',
] as const; // 24 fields total
```

---

## §3. 自动化防护

### §3.1 字段注册表模式

所有数据转换服务必须实现：

```typescript
class DataTransformer {
  // 1. 显式字段注册表
  private static readonly FIELD_REGISTRY = [
    'field1', 'field2', 'field3'
  ] as const;

  // 2. 使用遍历确保无遗漏
  static transform(data: any): any {
    const result: any = {};
    for (const field of this.FIELD_REGISTRY) {
      result[field] = data[field];
    }
    return result;
  }

  // 3. 验证方法
  static validate(data: any): { missing: string[] } {
    const missing: string[] = [];
    for (const field of this.FIELD_REGISTRY) {
      if (!(field in data)) missing.push(field);
    }
    return { missing };
  }
}
```

### §3.2 运行时警告

```typescript
// ExportService.ts
static exportToCModel(config: RobotConfig): any {
  const missing = this.validateExport(config);
  if (missing.missing.length > 0) {
    console.error('[DATA_LOSS] Missing fields:', missing.missing);
    throw new Error(`Export incomplete: ${missing.missing.join(', ')}`);
  }
  // ...
}
```

---

## §4. 代码审查检查清单

PR 审查时必须检查：

```
□ ExportService.ts 中的 ROBOT_IDENTITY_FIELDS 是否完整
□ ImportService.ts 是否 parse 了所有新字段
□ 如果修改 types.ts，是否同步更新了所有注册表
□ 测试是否验证了所有字段的 round-trip
□ 新增的字段是否有 fallback 处理
```

---

## §5. 历史教训

### Case 1: ExportService 字段遗漏 (2026-04-06)
- **问题**: 只导出了 9 个字段，遗漏 15 个
- **影响**: Full Load 性能数据全部丢失
- **修复**: 实施 FIELD_REGISTRY 模式
- **预防**: 本文档 §3.1

### Case 2: ImportService chassisHeight (2026-04-05)
- **问题**: chassisHeight 未从 proto 解析
- **影响**: 高度始终为 0
- **修复**: 添加 shape.height 解析
- **预防**: Proto 字段完整性检查

---

## §6. 相关文件

| 文件 | 用途 | 约束 |
|------|------|------|
| `src/store/types.ts` | 权威类型定义 | 修改时必须同步注册表 |
| `src/services/ExportService.ts` | 主导出服务 | 必须使用 FIELD_REGISTRY |
| `tests/ExportService.ts` | 测试导出 | 必须使用相同注册表 |
| `CLAUDE.md` | 开发伦理约束 | 引用本文档 |

---

## §7. 验证命令

```bash
# 编译检查
cd src/frontend && npm run build

# 字段完整性测试
cd tests && npm run test:detailed

# 查看导出字段是否完整
node -e "console.log(Object.keys(require('./ExportService').FIELD_REGISTRY))"
```

---

**注意**: 本文档是 CLAUDE.md  Development Ethics 的补充，具有同等约束力。
