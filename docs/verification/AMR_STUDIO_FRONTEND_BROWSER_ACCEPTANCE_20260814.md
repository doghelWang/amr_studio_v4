# AMR Studio V4 前端逐页浏览器验收报告

日期：2026-08-14

## 1. 验收环境

- Frontend：`http://127.0.0.1:3001`
- Backend：`http://127.0.0.1:8002`
- Backend health：HTTP 200
- Frontend health：HTTP 200
- 验收方式：本地浏览器逐页打开、读取可见 DOM、执行关键交互、检查控制台 warning/error

## 2. 页面验收

| 页面 | 结果 | 证据 |
| --- | --- | --- |
| 欢迎页 | 通过 | 显示 5-stage guided build、创建新机型、已有项目和 CModel 导入入口 |
| 身份信息 | 通过 | 机器人名称、物料代码、供应商、版本、导航方式、驱动类型均可见 |
| 底盘与动力 | 通过 | 物理尺寸、运动中心、空载/满载参数和动力组成标签可见 |
| 装备工坊 | 通过 | 真实模块库返回 30 张装备卡片；模块分类、底盘中心、装配清单、连接选择器可见 |
| 功能映射 | 通过 | 定位、避障、急停、码识别等功能能力区域可见；未绑定状态明确显示 |
| 审计导出 | 通过 | 组件、接口、连接、能力、FuncDesc 统计和警告可见；导出入口可见 |

## 3. 关键交互

### 3.1 身份到页面联动

在身份页输入 `browser_acceptance_demo` 后切换底盘页，页面标题和机器人名称同步更新。

### 3.2 模块库加载

首次验收发现前端只读取 `data.registry`，而当前 Python API 返回按系统分类的顶层对象：`sensor`、`battery`、`driver`、`driveWheel` 等，导致模块库为空。

已修复 `useProjectStore.fetchSchemas()`，兼容：

- `{ registry: {...}, boardInterfaces: {...} }`
- `{ sensor: [...], battery: [...], driver: [...] }`

修复后真实模块卡片可见，样例包括 `MOTOR-R_SV18D1_200M02BA`、`Steerwheel0`、`servo_driver_*` 等。

### 3.3 装备槽位和坐标

选择模块后，页面出现：

- 前部
- 后部
- 左侧
- 右侧
- 顶部
- 中心

点击“前部”后，坐标编辑器 X 显示由底盘尺寸推导的 `600`，Y 保持 `0`。该值被标记为装配意图预览，不是 Proto 默认值。

### 3.4 接口级联

完成模块装配后，源模块选择器可以选择底盘和已装配模块；选择电机模块后，源接口选择器出现：

- `LINE_1 · LINE`
- `ENCR_1 · ENCR`

说明接口数据已从模块模型进入工坊，而不是前端虚构。

### 3.5 控制台

最终全新页面验收未发现新增 error/warning。此前出现的 Ant Design 静态消息主题警告已改为组件级 `message.useMessage()`。

## 4. 构建验证

```bash
cd src/frontend && npm run build
```

结果：通过。仅保留既有 JavaScript bundle 体积提示。

## 5. 发布阻塞

远程仓库已确认：`https://github.com/doghelWang/amr_studio_v4.git`。

当前 `gh auth status` 返回默认账号令牌失效，因此本轮没有执行 commit、push 或 GitHub 部署，避免在无法确认身份时进行远程写入。

