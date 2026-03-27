# Agent-Peer-Sync (APS) 协作系统详细设计

## 1. 核心愿景
实现一套与具体项目无关、基于局域网通信与 Git 同步的双 Agent 协作框架。确保“开发-评审-优化”链路的标准化与自动化。

## 2. 逻辑架构
- **真值来源 (Truth)**: GitHub 远程仓库。
- **脉冲通信 (Pulse)**: 局域网 REST API。
- **状态管理 (State)**: `.gemini/collaboration/state.json`。

## 3. 消息协议 (MCP-Style Schema)
### 3.1 `WORK_DONE_SIGNAL`
发送方完成工作，请求对端评审。
```json
{
  "header": { "version": "1.0", "timestamp": "ISO8601" },
  "action": "NOTIFY_WORK_DONE",
  "payload": {
    "commit_hash": "string",
    "review_scope": ["file_paths"],
    "test_report": "docs/test/..."
  }
}
```

### 3.2 `REVIEW_RESULT_SIGNAL`
评审方完成审计，返回反馈意见。
```json
{
  "action": "NOTIFY_REVIEW_DONE",
  "payload": {
    "status": "APPROVED | NEEDS_OPTIMIZATION",
    "comments": "markdown_string",
    "revision_branch": "string"
  }
}
```

## 4. 待办事项 (TODO)
- [ ] **T1: 配置文件初始化**：创建 `.gemini/collaboration/config.json` 并填入 IP 信息。
- [ ] **T2: 通用监听器开发**：编写 `agent_sentinel.py`，支持独立于业务后端运行。
- [ ] **T3: 技能手册编写**：在 `.gemini/skills/` 下定义如何调用 handoff 接口。
- [ ] **T4: 双机联调验证**：测试从 217 发送信号，213 是否能成功触发 Git 拉取。

## 5. 设计约束
- 监听器不得引用 `backend/` 目录下的任何业务逻辑。
- IP 地址禁止硬编码，必须从 `.gemini/collaboration/config.json` 动态加载。
