# mac_mock

`mac_mock/` 提供一个最小可运行的 mac 模拟框架骨架，用来验证下面这条链路：

`主进程模拟脚本 -> plugin_api.py -> worker.py`

当前骨架覆盖：

- 主进程通过 Python 调用插件入口
- 插件入口拉起 Worker 子进程
- Worker 通过 `stdout NDJSON` 输出结构化事件流
- 插件入口通过 `stdin` 向 Worker 发送请求 envelope
- Worker 返回贴近正式文档的标准 JSON
- 插件入口执行 5 秒超时控制
- 失败与超时路径

## 文件说明

- `config.json`: 运行时参数、任务参数、资源契约、场景参数
- `protocol.py`: 共享 IPC 契约与消息封装工具
- `plugin_api.py`: 插件主入口，负责拉起 Worker、监听事件、聚合最终 JSON
- `worker.py`: 模拟 Worker 子进程，输出结构化事件流
- `simulate_host.py`: 简单主进程模拟脚本

## 运行方式

在 `mac_mock/` 目录执行：

```bash
python3 simulate_host.py --scenario all
```

只跑单个场景：

```bash
python3 simulate_host.py --scenario success
python3 simulate_host.py --scenario fail
python3 simulate_host.py --scenario timeout
```

也可以直接调用插件入口：

```bash
python3 plugin_api.py --mode success
python3 plugin_api.py --mode fail
python3 plugin_api.py --mode timeout
```

## IPC 契约

插件壳到 Worker：

- 输入：单条 `stdin` JSON request
- 输出：多条 `stdout` NDJSON event

当前已实现的事件类型：

- `worker.ready`
- `task.accepted`
- `task.resource_snapshot`
- `task.progress`
- `task.result`
- `task.error`

## 预期结果

- `success`: 返回 `status=success`
- `fail`: 返回 `status=failed`
- `timeout`: 在 5 秒预算内返回 `status=timeout`

heartbeat 和事件摘要会由 `plugin_api.py` 转发到 stderr，最终结果 JSON 输出到 stdout。
