# AMR Studio V4：Windows 一键部署

本文适用于最新 `codex/equipment-workshop-refactor` 方案，在 Windows 10/11 上部署 AMR Studio V4 本机运行环境。

> 该方案用于开发、演示和验收环境。默认只监听本机 `127.0.0.1`，不是面向公网的生产部署方案。

## 1. 一次性准备

安装以下软件，并在安装完成后重新打开终端：

| 软件 | 最低要求 | 建议版本 | 安装注意事项 |
| --- | --- | --- | --- |
| Python | 3.10+ | 3.11 x64 | 安装时勾选 `Add Python to PATH` |
| Node.js | 18+ | 20 LTS x64 | 必须同时提供 `node` 和 `npm` 命令 |
| Git | 可选 | 当前稳定版 | 仅通过 `git clone` 获取代码时需要 |

下载地址：

- Python：<https://www.python.org/downloads/windows/>
- Node.js：<https://nodejs.org/>
- Git：<https://git-scm.com/download/win>

建议将项目放在较短的纯英文路径，例如：

```text
C:\amr_studio_v4
```

路径包含空格时脚本也会加引号处理，但过深目录可能触发 Windows 路径长度限制。

## 2. 获取代码

### 方式 A：Git 克隆

在 PowerShell 或 Windows Terminal 中执行：

```powershell
cd C:\
git clone -b codex/equipment-workshop-refactor https://github.com/doghelWang/amr_studio_v4.git
cd C:\amr_studio_v4
```

### 方式 B：下载 ZIP

从 GitHub 下载 `codex/equipment-workshop-refactor` 分支 ZIP，解压后进入包含 `start.bat`、`start.py` 和 `src` 的目录。

## 3. 一键部署与启动

双击：

```text
start.bat
```

也可以在终端中运行：

```bat
cd /d C:\amr_studio_v4
start.bat
```

脚本会按顺序完成：

1. 检查 Python 3.10+、Node.js 18+ 和 npm。
2. 创建或复用 `src\backend\venv`。
3. 按 `src\backend\requirements.txt` 安装 Python 依赖。
4. 按 `src\frontend\package-lock.json` 安装前端依赖。
5. 清理被旧进程占用的 8002、3001 端口。
6. 启动 Python 后端和 Vite 前端。
7. 检查后端版本接口和前端首页。
8. 健康检查通过后打开默认浏览器。

首次运行需要访问 Python 和 npm 软件源，耗时取决于网络；后续运行会复用虚拟环境和 npm 缓存。

## 4. 访问地址

部署成功后：

- 前端：<http://127.0.0.1:3001>
- 后端：<http://127.0.0.1:8002>
- 后端健康接口：<http://127.0.0.1:8002/api/v1/system/version>

前端通过 Vite 代理访问 `/api`，正常使用时只需打开前端地址。

## 5. 日常更新

Git 方式获取代码时：

```bat
cd /d C:\amr_studio_v4
git pull
start.bat
```

`start.bat` 会再次校验依赖，并重新启动占用 8002、3001 端口的旧实例。

## 6. 自定义端口与局域网访问

自定义端口：

```bat
start.bat --backend-port 18002 --frontend-port 13001
```

允许局域网其他设备访问：

```bat
start.bat --host 0.0.0.0
```

然后使用 Windows 主机的局域网 IP 访问，例如：

```text
http://192.168.1.100:3001
```

局域网模式可能触发 Windows Defender 防火墙提示。只应在可信网络中放行专用网络访问；不要直接把 3001 或 8002 端口暴露到公网。

## 7. 日志与故障排查

运行日志：

```text
src\backend\backend_runtime.log
src\frontend\frontend_runtime.log
```

### Python 找不到

确认以下命令至少一个可用：

```bat
py -3 --version
python --version
```

若均不可用，重新安装 Python，并启用 `Add Python to PATH`。

### Node.js 或 npm 找不到

```bat
node --version
npm --version
```

若命令不可用，重新安装 Node.js 18+，然后关闭并重新打开终端。

### 依赖安装失败

确认电脑可以访问 Python 和 npm 软件源，再重新运行 `start.bat`。脚本不会删除项目模型、模块模板或用户保存数据。

### 服务健康检查失败

分别检查两个日志文件末尾，重点确认：

- 8002 或 3001 是否被安全软件阻止。
- Python 依赖是否完整安装。
- npm 是否成功生成 `src\frontend\node_modules`。
- 项目目录是否有写权限。

### 完全重建依赖

只有依赖环境损坏时才执行。先关闭 AMR Studio，然后删除以下两个可再生目录，再重新运行 `start.bat`：

```text
src\backend\venv
src\frontend\node_modules
```

不要删除 `src\backend\resources`、`specifications`、`saved_projects` 或 `user_saves`。

## 8. 数据与事实边界

- Proto 来源仍为 `specifications\protocols`，一键启动不会重写 Proto。
- 模块数据来自项目模块模板；脚本不会根据名称补全缺失参数。
- `saved_projects` 和 `user_saves` 属于用户数据，更新代码前应单独备份。
- 视图透明度、相机、爆炸偏移和未定位停放只属于前端显示状态，不写回 CModel。

## 9. 当前验证边界

- 项目已完成 macOS/Linux 侧前端构建、Python 单元测试、Worker TypeScript 检查和 CModel 回归。
- Windows 启动脚本已按 Windows 命令语法和项目实际目录结构进行静态检查。
- 在没有真实 Windows 主机执行结果前，不把本方案描述为已完成 Windows 10/11 实机验证；首次部署后应以健康检查结果和两个运行日志为准。
