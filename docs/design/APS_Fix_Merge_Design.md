# APS-Fix-Merge 问题与方案描述文档 (2026-03-25)

## 1. 现状审计 (Post-Merge Audit)
经过对 `main` 分支的深度代码扫描，确认以下情况：
- **[Status: OK]** 编解码核心修复（`proto_final_sync`, `always_print`）已在 `main` 分支留存。
- **[Status: OK]** 后端运行时模块已重命名为 `*_runtime.py` 且引用已同步。
- **[Status: RISK]** **资源超市沙箱化缺失**：新组件选型时，前端若直接引用 `backend/resources/modules/`，会打破项目的物理隔离原则。

## 2. 核心问题定义 (Issues)
| ID | 问题描述 | 潜在后果 | 优先级 |
| :--- | :--- | :--- | :---: |
| **I-01** | **跨域/沙箱逃逸**：选型后的组件碎片未被复制到 `saved_projects/{id}/modules/`。 | 修改组件会导致公共资源库被篡改，且构建引擎无法定位碎片。 | P0 |
| **I-02** | **Blueprint 路径污染**：`blueprint_CompDesc.json` 中 `$ref` 可能包含绝对路径或跨目录路径。 | 构建生成的 `.cmodel` 拓扑结构失效。 | P0 |
| **I-03** | **刷新状态丢失**：所有 UI 状态（Step 进度等）未持久化。 | 工业建模中断代价极高。 | P1 |

## 3. 修复方案 (Solution)
### 3.1 资源沙箱化 (Resource Sandboxing)
- **后端拦截**：在 `main.py` 的组件添加/选型接口中，强制将选中的标准组件 JSON **物理拷贝**至 `saved_projects/{id}/modules/`。
- **引用归一化**：确保所有 `$ref` 路径始终相对于项目根目录，格式统一为 `modules/xxx.json`。

### 3.2 构建引擎防御 (Build Hardening)
- **路径校验**：在 `encoder.py` 的 `resolve_with_fidelity` 函数中增加路径安全检查，只允许解析当前项目目录下的 `$ref`。

### 3.3 前端状态固化 (State Persistence)
- **Local Storage**：将 Zustand Store 中的 `projectId` 和 `currentStep` 同步至浏览器本地存储。

## 4. 验证计划
1. **沙箱测试**：从超市选择一个“雷达”，修改其安装位姿，确认 `backend/resources/modules/` 下的原始文件未被改变，而项目 `modules/` 下的副本已更新。
2. **构建测试**：执行导出，确认生成的二进制位对齐。
