# AMR Studio V4 - 待办事项与启动优化文档

> 创建日期: 2026-04-06  
> 最后更新: 2026-04-06  
> 版本: 1.0

---

## 一、遗留待办事项 (来自用户会话)

### P0 - Step 6 数据展示与关联 ⚠️ CRITICAL
| 状态 | 任务 | 说明 | 位置 |
|------|------|------|------|
| ⏳ 待验证 | COMBOX 下拉框渲染 | 导航能力中激光传感器选择框不显示，已在 AbilityStep.tsx:92,247 修复映射，需真实页面验证 | `src/components/wizard/AbilityStep.tsx` |
| ⏳ 待验证 | 关联硬件映射功能 | 传感器→算法的绑定逻辑需验证是否正常工作 | `CAPABILITY_MAPPING` |

### P1 - 底盘性能属性数据修正 ⚠️ HIGH
| 状态 | 任务 | 说明 | 位置 |
|------|------|------|------|
| ⏳ 待完成 | 满载最大线速度修正 | 应为 1000（当前错误显示 960），检查计算逻辑 | `PerformanceConfig.ts`, `ImportService.ts` |
| ⏳ 待完成 | 缺失字段补充 | maxRotSpeed、maxRotAccel、rotateMaxAngSpeed、rotateMaxAngAcceleration | `types.ts` `RobotIdentity` |
| ⏳ 待完成 | Full Load 计算比率确认 | `fullLoadRatios.maxSpeed * maxSpeed` 是否正确 | `DEFAULT_FULL_LOAD_RATIOS` |

### P2 - 连接线信息验证
| 状态 | 任务 | 说明 | 位置 |
|------|------|------|------|
| ⏳ 待完成 | 接口互联数据完整性 | 检查 interface linking 是否完整保留 | `ImportService.ts:281-286` |
| ⏳ 待完成 | 拓扑关系映射准确性 | 驱动器-电机-轮的接线关系是否正确构建 | `parseCompDesc:135-206` |

### P3 - CModel 导出合规性
| 状态 | 任务 | 说明 | 位置 |
|------|------|------|------|
| ⏳ 待完成 | 前端生成文件格式验证 | 导出 JSON 是否符合 Proto 规范 | `ExportService.ts` |
| ⏳ 待完成 | 标准工具兼容性 | 导出文件能否被后端 Python 正确解析 | `tests/cmodel_bidirectional_test.ts` |

### 1.1 Step 6 AbilityStep COMBOX 渲染修复
| 状态 | 任务 | 说明 |
|------|------|------|
| ✅ 已完成 | COMBOX 类型识别修复 | 支持 `'COMBOX'` 和 `'DATA_COMBOX'` 两种类型 |
| ✅ 已完成 | arrayAttr → arrayCmobEle 映射 | 第92行添加 arrayAttr 支持 |
| ✅ 已完成 | AbilityCommonAttr 数据转换 | 第247行添加 options[*].arrayAttr 到 typeGroups[*].arrayCmobEle 的转换 |

### 1.2 数据完整性约束机制
| 状态 | 任务 | 说明 |
|------|------|------|
| ⏳ 待完成 | FIELD_REGISTRY 模式完善 | 确保所有数据转换服务使用字段注册表 |
| ⏳ 待完成 | 运行时字段缺失警告 | 在 ExportService 中实现 validateExport() 方法 |
| ⏳ 待完成 | 测试覆盖 | 测试所有字段的 round-trip 完整性 |

### 1.3 前端代码结构问题
| 状态 | 任务 | 说明 |
|------|------|------|
| ⏳ 待完成 | AbilityStep 类型重构 | 统一 AbilityCommonAttr 和 SmartAttribute 的命名 |
| ⏳ 待完成 | 代码重复消除 | extractArrayAttrLocation() 两次 detectArrayLocation，应提取为工具函数 |
| ⚠️ 潜在风险 | `any` 过度使用 | AbilityStep.tsx 第89行 (attr as any).type 转换过多 |

### 1.4 CModel 导出导入验证
| 状态 | 任务 | 说明 |
|------|------|------|
| ⏳ 待完成 | 真实 CModel 文件测试 | 使用 tests/cmodel_bidirectional_test.ts 进行测试 |
| ⏳ 待完成 | 性能基准测试 | 记录 Import/Export Service 处理时间 |
| ⏳ 待完成 | 错误处理增强 | addMissingFullLoadOffsets() 中 console.warn 应改为错误上报 |

---

## 三、约束规范统一整理 (P4)

### 3.1 问题现状

| 问题 | 现状 | 影响 |
|------|------|------|
| 定义的冗余性 | 硬性约束定义分散在 CLAUDE.md、DATA_INTEGRITY_CONSTRAINTS.md、system prompt skill、审计记录中 | 查找困难，容易遗漏 |
| source of truth 模糊 | 同一个规则在不同文件中有不同表述 | 不一致性 |
| 上下文干扰 | 约束夹杂在项目说明中 | 难以优先 enforcing |

**当前分散的文件**:
1. `/Users/wangfeifei/code/amr_studio_v4/CLAUDE.md` - 包含开发伦理约束
2. `/Users/wangfeifei/code/amr_studio_v4/DATA_INTEGRITY_CONSTRAINTS.md` - 数据完整性约束
3. `system-reminder` skill / codeagent skill - 运行时注入
4. 审计记录 (MEMORY.md) - 历史决策但可能过时

### 3.2 目标结构

```
amr_studio_v4/
├── CONSTRAINTS.md          ← 硬性约束 (NO_HARDCODE/NO_PARTIAL_PARSE/PROTO_FIRST)
├── SKILL.md                ← 工具使用规范、工作流
├── SOUL.md                 ← Claude Project Personality - 通用素质
├── CLAUDE.md               ← 保持向后兼容，引用 CONSTRAINTS.md
└── MEMORY.md               ← 历史记录，不重复定义
```

### 3.3 CONSTRAINTS.md 内容建议

```markdown
# AMR Studio V4 - Hard Constraints

## §1 NO_HARDCODE (禁止硬编码)
- 禁止直接使用魔法数字/字符串处理数据
- 所有值必须从 schemaRegistry 动态查询
- 默认值必须来自 schema.fallbackValues

## §2 NO_PARTIAL_PARSE (禁止部分解析)
- 禁止选择性解析 Proto 字段
- 必须使用字段注册表遍历所有字段
- Array/COMBOX 类型必须完整处理嵌套

## §3 PROTO_FIRST (Proto优先)
- 任何操作前查阅 Proto 定义
- 生成字段清单后再实现逻辑
- Schema-driven 而非 handwritten

## §4 NO_PARTIAL_EXPORT (禁止部分导出)
- 必须使用 FIELD_REGISTRY 遍历导出
- 禁止手动列出字段
- 实现 validateExport() 验证完整性
```

### 3.4 Unified 待办

| 优先级 | 任务 | 工作量 |
|--------|------|--------|
| P0 | 创建 CONSTRAINTS.md | 30分钟 |
| P1 | 创建 SKILL.md | 45分钟 |
| P2 | 迁移 CLAUDE.md 约束定义至 CONSTRAINTS.md | 30分钟 |
| P3 | 清理 MEMORY.md 重复内容 | 15分钟 |

---

## 四、服务启动优化方案

### 4.1 问题诊断

**现状问题**:
- 前端启动频繁失败 (`pkill` + `nohup` 不可靠)
- 进程残留导致端口占用
- HMR 热更新有时失效
- 无健康检查机制
- 启动后无成功确认

**根本原因**:
1. pkill -9 是异步的，sleep 2 不一定足够
2. nohup & 直接后台启动，无法捕获启动错误
3. 端口监听检查有延迟
4. 没有进程监控/健康检查

### 2.2 优化方案

#### 方案 A: 快速修复 (推荐)

**1. 创建启动脚本** `scripts/start_dev.sh`:
```bash
#!/bin/bash
set -e

PORT=${1:-3001}
PID=$(lsof -t -i:$PORT 2>/dev/null) && kill -9 $PID 2>/dev/null || true
sleep 1

cd src/frontend
npm install --silent 2>/dev/null || true
npm run dev &
PID=$!

# 健康检查
echo "Waiting for port $PORT..."
for i in {1..30}; do
    if curl -s http://127.0.0.1:$PORT >/dev/null 2>&1; then
        echo "✅ Frontend ready at http://127.0.0.1:$PORT"
        echo $PID > .pid.frontend
        exit 0
    fi
    sleep 0.5
done
echo "❌ Failed to start"
kill $PID 2>/dev/null || true
exit 1
```

**2. 后端同理** `scripts/start_backend.sh`:
```bash
#!/bin/bash
PORT=${1:-8002}
PID=$(lsof -t -i:$PORT 2>/dev/null) && kill -9 $PID 2>/dev/null || true
sleep 1

cd src/backend
pip install -q requirements.txt 2>/dev/null || true
uvicorn main:app --host 0.0.0.0 --port $PORT --reload &
echo $! > .pid.backend
```

**3. 统一启动** `scripts/start_all.sh`:
```bash
./scripts/start_backend.sh
curl -s http://127.0.0.1:8002/api/health || echo "Backend check failed"
./scripts/start_dev.sh
curl -s http://127.0.0.1:3001 | head -1 || echo "Frontend check failed"
```

**4. Makefile**:
```makefile
.PHONY: start stop status

start:
	./scripts/start_all.sh

stop:
	kill $(shell cat src/frontend/.pid.frontend 2>/dev/null) 2>/dev/null || true
	kill $(shell cat src/backend/.pid.backend 2>/dev/null) 2>/dev/null || true

status:
	@echo "Frontend: $(shell lsof -t -i:3001 2>/dev/null || echo 'down')"
	@echo "Backend: $(shell lsof -t -i:8002 2>/dev/null || echo 'down')"
```

#### 方案 B: 使用 Docker Compose (推荐团队开发)

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  backend:
    build: ./src/backend
    ports:
      - "8002:8002"
    volumes:
      - ./src/backend:/app
      - /app/__pycache__
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8002/api/health"]
      interval: 5s
      timeout: 3s
      retries: 5
  
  frontend:
    build: ./src/frontend
    ports:
      - "3001:3001"
    volumes:
      - ./src/frontend:/app
      - /app/node_modules
    depends_on:
      backend:
        condition: service_healthy
```

#### 方案 C: PM2 进程管理 (生产环境)

**ecosystem.config.js**:
```javascript
module.exports = {
  apps: [
    {
      name: 'amr-backend',
      script: './src/backend/main.py',
      args: '--host 0.0.0.0 --port 8002',
      interpreter: 'python3',
      env: { NODE_ENV: 'development' },
      watch: true,
      max_restarts: 5,
      min_uptime: '10s'
    },
    {
      name: 'amr-frontend',
      cwd: './src/frontend',
      script: 'npm',
      args: 'run dev',
      env: { NODE_ENV: 'development' },
      max_restarts: 5,
      min_uptime: '10s'
    }
  ]
};
```

### 2.3 推荐实施顺序

| 优先级 | 方案 | 工作量 | 效果 |
|--------|------|--------|------|
| P0 | 方案A: 启动脚本 | 30分钟 | 立即解决启动问题 |
| P1 | package.json 脚本增强 | 15分钟 | 标准化开发命令 |
| P2 | 方案B: Docker | 2小时 | 团队一致性 |
| P3 | 方案C: PM2 | 1小时 | 生产稳定性 |

### 2.4 即刻修复建议

**添加到 package.json**:
```json
{
  "scripts": {
    "dev:safe": "sh -c 'lsof -ti:3001 | xargs kill -9 2>/dev/null; sleep 1; npm run dev'",
    "dev:check": "curl -sf http://localhost:3001 >/dev/null && echo '✅ Ready' || echo '❌ Failed'",
  }
}
```

**使用推荐**:
```bash
# 安全启动前端 (清理残留进程后启动)
npm run dev:safe

# 验证启动状态
npm run dev:check
```

---

## 三、持久化检查清单

### 每日开发前检查
- [ ] Task #34: 前后端代码深度审计与服务启动
- [ ] Task #35: 系统性字段完整性审核与约束机制建立  
- [ ] Task #36: 深度检查 AbilityStep 数据流完整性

### 代码提交前检查
- [ ] ExportService.ts 中的 ROBOT_IDENTITY_FIELDS 是否完整
- [ ] ImportService.ts 是否 parse 了所有新字段
- [ ] Build 是否通过 (无 TypeScript 错误)
- [ ] 服务启动是否正常

---

**文件路径**: `/Users/wangfeifei/code/amr_studio_v4/docs/TODO_AND_DEVOPS_OPTIMIZATION_20260406.md`

保存了所有待办事项和服务启动优化方案。