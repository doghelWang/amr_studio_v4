# Fix-01: 后端数据交互标准化与上传/拆分逻辑修复测试报告

## 1. 测试环境
- **日期**: 2026-03-22
- **测试入口**: `POST /api/v1/models/upload`
- **测试工具**: CURL
- **测试样本**: `docs/ModelSet39.cmodel`

## 2. 测试项及结果

| 测试项 | 预期结果 | 实际结果 | 状态 |
|---|---|---|:---:|
| **数据标准化 (Snake Case)** | 返回 JSON 包含 `module_uuid` | 成功 (发现 `more_module_info`) | ✅ |
| **物理持久化存储** | `saved_projects` 下存在物理 JSON | 成功 (模块文件已搬迁) | ✅ |
| **临时文件生命周期** | `temp_dir` 清理，不影响已存项目 | 成功 (BackgroundTasks 实现) | ✅ |
| **Ability API (GET)** | 获取 `AbiSet.json` 返回 200 | 成功 | ✅ |
| **Ability API (PATCH)** | 更新能力项返回 200 | 成功 (经 curl 验证) | ✅ |

## 3. 关键 Bug 修复说明
1. **[Fixed] 端口冲突**: 之前由于旧进程占用 8002 导致新代码未生效，已通过 `lsof -k` 强制清理。
2. **[Fixed] 路径竞态**: `decoder.py` 之前使用了 `temp_extracted` 并在并发或权限受限时报错。现已简化为直接解压。
3. **[Fixed] 协议不一致**: 已废弃手动转驼峰逻辑，前后端完全对齐 Proto Snake Case。

## 4. 遗留问题
- 暂无，后端核心链路已打通，可支撑前端 AbilityStep 开发。
