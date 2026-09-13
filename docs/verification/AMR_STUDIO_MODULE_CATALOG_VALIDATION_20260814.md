# AMR Studio V4 模块目录恢复与装备验证报告

**日期**：2026-08-14  
**范围**：生产站点 `https://cloud-ai.work/` 的装备工坊模块目录、模块选择、安装位姿和装配落库  
**版本**：Cloudflare Worker `f54c08f3-8450-4807-97e8-880924bb65ad`

## 1. 问题与依据

用户反馈装备过程没有可用模块。检查确认，仓库已有生成的模块快照：

- `src/frontend/public/worker-data/schemas.json`
- 19 个模块类别，共 144 条真实模块定义
- 模块字段由现有 schema 快照和 `ImportService.mapEntityToComponent` 解析，不新增虚构参数

生产域名的 `/api/v1/schemas` 当前被更具体的共享路由截获并返回 404；项目自身 Worker 的通配页面路由仍可正常提供静态资源。由于该域名还承载其他 Worker，本次没有强行接管共享 `/api/*` 路由。

## 2. 实施内容

在 `useProjectStore.fetchSchemas()` 中增加有来源标识的回退链：

1. 优先请求在线 `/api/v1/schemas`，成功时标记 `schemaRegistrySource=api`。
2. API 失败时读取项目已有 `/worker-data/schemas.json`，标记 `schemaRegistrySource=static-snapshot`。
3. 两者均失败时保持空目录并标记 `unknown`，不静默构造模块。

装备工坊目录增加来源提示，明确区分在线注册表与项目生成的静态快照。

## 3. 生产浏览器验收

| 验证项 | 结果 | 证据 |
|---|---|---|
| 生产首页更新 | PASS | 显示 5-stage guided build |
| 进入装备工坊 | PASS | 导航显示 Step 3 / 5 |
| 模块快照回退 | PASS | 页面显示“当前使用项目生成的模块快照进行验证” |
| 行走与动力 | PASS | 30 个“选择”按钮 |
| 定位与导航 | PASS | 30 个“选择”按钮 |
| 能源与充电 | PASS | 24 个“选择”按钮 |
| 主控与通信 | PASS | 30 个“选择”按钮 |
| 声光与人机 | PASS | 30 个“选择”按钮 |
| 选择真实模块 | PASS | `MOTOR-R_SV18D1_200M02BA`，类型 `PMSMMotor` |
| 前部装配意图 | PASS | 当前底盘 1200 长度推导 X=600 |
| 装配到车辆 | PASS | 页面出现“已装配”，组件状态为“已定位” |
| 前端构建 | PASS | `npm run build` 通过，仅有 bundle 体积提示 |

## 4. 当前遗留问题

- 生产 `/api/v1/system/version` 和 `/api/v1/projects/saved-list` 仍返回 404；这会影响后端状态显示和项目列表，但不影响本次模块目录与装配验证。
- `/api/v1/schemas` 仍不是在线 API 正常链路；当前页面明确使用静态快照验证。后续应由域名所有者确认共享路由归属，再把 API 路由安全地指向 `amr-studio-v4`。
- 当前快照适合验证模块选择、字段映射、位姿和连接交互；不等同于线上实时模块库，报告中不得把快照状态描述为在线数据。

## 5. 后续建议

- 保留静态快照回退，避免生产 API 暂时不可用时装备工坊空白。
- 修复共享域名路由后，重新验证 `schemaRegistrySource=api`，并比较 API 与快照的类别、模块数量、接口和关键 Proto 字段。
- 继续使用真实接口完成至少一条主控—驱动器或传感器—处理器的连接，再执行完整 round-trip 导出校验。
