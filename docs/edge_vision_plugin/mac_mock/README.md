# mac_mock

`mac_mock/` 提供一个更接近正式落地形态的 mac 模拟框架，用来验证下面这条链路：

`C 主进程 -> Python plugin_api.py -> worker.py -> 编译态算法库`

这一版重点验证：

- 主进程由 C 程序模拟，并向 Python 暴露宿主回调接口
- 插件入口拉起 Worker 子进程，使用正式 `stdin request / stdout NDJSON event` 协议
- 算法核心以编译动态库形式运行，不以 Python 源码承载算法实现
- 授权校验内聚在 `algo_core` 内部，未授权时算法步骤不会执行
- Worker 把授权结果、资源快照、进度、终态统一走结构化事件

## 文件说明

- `config.json`: 运行时参数、任务参数、资源契约、授权配置、场景参数
- `protocol.py`: 共享 IPC 契约与消息封装工具
- `plugin_api.py`: 插件主入口，负责拉起 Worker、注入 license/context、聚合最终 JSON
- `worker.py`: 模拟 Worker 子进程，调用编译动态库并输出结构化事件流
- `host_simulator.c`: C 主进程模拟器，嵌入 Python 并提供 `host_runtime` 回调接口
- `native/auth_core.c`: 编译态授权库核心
- `native/algo_core.c`: 编译态算法库，内部调用授权校验并拒绝未授权执行
- `licenses/`: mock 授权文件
- `Makefile`: 编译动态库和 C 主进程模拟器

## 运行方式

在 `mac_mock/` 目录执行：

```bash
make
./host_simulator --scenario all
```

只跑单个场景：

```bash
./host_simulator --scenario success
./host_simulator --scenario fail
./host_simulator --scenario timeout
./host_simulator --scenario license_invalid
```

也可以直接调用插件入口：

```bash
python3 plugin_api.py --mode success
python3 plugin_api.py --mode fail
python3 plugin_api.py --mode timeout
python3 plugin_api.py --mode license_invalid
```

## IPC 契约

插件壳到 Worker：

- 输入：单条 `stdin` JSON request
- 输出：多条 `stdout` NDJSON event

当前已实现的事件类型：

- `worker.ready`
- `task.accepted`
- `task.resource_snapshot`
- `task.auth.valid`
- `task.auth.failed`
- `task.progress`
- `task.result`
- `task.error`

## 授权与算法机制

- `plugin_api.py` 不做外层“先授权再放行”的信任判断，只负责把 license/context 下发给 Worker
- `worker.py` 调用 `libalgo_core.dylib`
- `libalgo_core.dylib` 内部通过 `algo_authorize()` 调用编译态授权逻辑
- 如果授权失败，`algo_get_required_steps()` / `algo_process_step()` / `algo_finalize()` 都不会工作

这意味着即使有人绕过独立授权库，直接调用算法库，也仍然需要先通过算法库内部授权状态校验。
