# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SupCopilot — 全栈桌面 AI 助手应用。Python FastAPI 后端 + Next.js/Electron 前端，通过 git submodule 管理。

## Repository Structure

```
├── SupBack/       # Python 后端 (FastAPI, port 8133) — git submodule
├── SupFront/      # Next.js 14 + Electron 前端 (port 3000) — git submodule
└── nvm-noinstall/ # 便携式 Node 版本管理
```

## Development Commands

### 后端 (SupBack)
```bash
cd SupBack
pip install -r requirements.txt    # 安装依赖 (Python 3.10.14)
python run_wsgi.py                 # 启动后端服务 127.0.0.1:8133
```

### 前端 (SupFront)
```bash
cd SupFront
nvm use 20.10.0                    # 切换 Node 版本
npm install                        # 安装依赖
npm run dev                        # Next.js 开发模式 (port 3000)
npm run dev_electron               # 同时启动 Next.js + Electron
npm run build                      # 构建 Next.js
npm run make                       # Electron 打包 (electron-forge)
npm run lint                       # ESLint 检查
```

### 构建发布 (SupBack/version/build_handle.py)

构建脚本位于 `SupBack/version/build_handle.py`，需在 supback conda 环境下运行，产物输出到 `F:\_out\sup`。

**后端打包**（Nuitka 编译为 `supback.exe`，自动完成编译+压缩+上传+版本号更新）：
```bash
cd SupBack
conda run -n supback python -m version.build_handle
# 在 build_handle.py __main__ 中启用: BuildHandlerWin.build("back")
```

**前端打包**（需要先手动 build，再用 build_handle 打包上传）：
```bash
# 1. 先构建 .next（若报 EPERM .next/trace，先 kill node 进程）
taskkill //F //IM node.exe
cd SupFront
npm run build

# 2. 取消注释 build_handle.py __main__ 中的 BuildHandlerWin.build(".next")，然后运行：
cd ../SupBack
conda run -n supback python -m version.build_handle
# 运行完后将该行重新注释回去
```

`build_handle.py` 的 `__main__` 块通过注释控制要执行的打包项，按需取消注释对应的 `BuildHandlerWin.build(...)` 行，**运行后务必还原注释**。`build(".next")` 流程：`next_copy()`（复制 .next 到输出目录并压缩为 .next.zip）→ `upload()`（上传到 TOS）→ `update_cloud_pak_ver()`（更新云端版本号）。

> 注意：`next_copy()` 等函数依赖 `__main__` 中定义的 `dev_next_dir`、`next_dir`、`out_dir` 模块级变量，不能脱离 `__main__` 直接调用。

## Architecture

### 后端核心模式: Receiver Pattern

所有 API 请求走 **action 路由机制**：
```
POST /ai?action=method_name&param1=value1
    → AIReceiver(params_dict) → handle_action() → 找到对应 @action 方法执行
```

定义新功能的方式：
```python
@receiver_cls
class MyReceiver(RequestReceiver):
    @action
    def my_action(self):
        value = self.arg_dict["param_name"]    # 参数自动从 query+form 解析
        return self.handle_result.form(200, data=result)
```

- `@receiver_cls` 装饰器自动收集类中所有 `@action` 方法，注册到 `cls.actions` 字典
- `@action` 方法的参数名会被自动提取，从请求中解析对应值到 `self.arg_dict`
- 参数值会自动尝试 JSON 解析 (`UtilUtils.try_parse_str_as_json`)
- 核心代码：`base_class/base_receiver.py`

### 后端 API 路由 (main.py)

| 路由 | Receiver | 功能 |
|------|----------|------|
| `/ai` | AIReceiver | AI 对话 (OpenAI, ByteDance) |
| `/dir_file` | DirFileReceiver | 文件系统操作 |
| `/audio` | AudioReceiver | 音频处理 |
| `/database` | DatabaseReceiver | 数据库 CRUD (JSON DB / MongoDB) |
| `/version` | VersionReceiver | 版本管理 |
| `/plugin` | PluginReceiver | 插件系统 |
| `/plugin_sse` | PluginReceiverSSE | 插件 SSE 流 |
| `/client`, `/server` | LocalServerReceiver | 本地 C/S 操作 |
| `/cloud` | CloudServerReceiver | 云端操作 |
| `/copiper` | CoPiperReceiver | TTS 文字转语音 |

### 前端架构

- **状态管理**: Zustand (`useSupDataStore`)
- **UI**: Ant Design 5.x
- **认证**: Supabase email OTP (`src/app/action/spabse.ts`)
- **路径别名**: `@/*` → `./src/*`
- 页面结构: `src/app/main/` 下按功能分目录 (ai/, audio/, database/, dir_file/, plugins/, settings/ 等)

### 进程编排 (sup_server.py)

`SupHandler` 管理三个进程：
1. **back** — supback.exe (后端 port 8133)
2. **next** — npm run next_start (前端 port 3000)
3. **electron** — Electron 桌面壳 (加载 localhost:3000)

## JNPM 本地任务文件

"更新单子到飞书" 脚本运行时，会同时将王军懿名下所有任务导出到本地固定文件，供其它项目（如 lumit SVN 自动提交）读取。

- **文件路径**: `~/jnpm_my_tasks.txt`（即 `C:\Users\Admin\jnpm_my_tasks.txt`）
- **编码**: UTF-8
- **写入方式**: 完全覆盖
- **格式**: 纯文本，每行一条任务：`周版本 #id 标题`
  ```
  2026-03-11版本 #93041 【通用】鬼屋搜撤玩法 音频
  2026-03-04版本 #91396 【Play】咖啡厅骗子酒馆玩法 音频
  ```
- **筛选条件**: assignee（执行人）== 王军懿，覆盖近5个周版本
- **代码位置**: `SupBack/plugins/copiper/jnpm/jnpm.py` → `JNPMHandler.save_my_tasks_to_local()`
- **读取方式** (Python):
  ```python
  import os
  tasks_file = os.path.join(os.path.expanduser("~"), "jnpm_my_tasks.txt")
  with open(tasks_file, "r", encoding="utf-8") as f:
      lines = f.read().strip().split("\n")
  # lines: ["#12345 任务标题A", "#12346 任务标题B", ...]
  ```

## 开发同步规则

修改了 `SupBack/plugins/` 下的插件代码或 `SupBack/databases/plugins.jdb` 后，必须同步到正式运行目录，否则运行中的 supback 不会加载新代码。

**同步插件代码**（改了 `plugins/copiper/` 下任何文件后执行）：
```bash
cd /d/GitDownload/Sup/SupBack && conda run -n supback python -c "from utils.util_utils import DirFileUtils; import os, shutil; app_dir = DirFileUtils.get_app_dir('supcopilot'); target = os.path.join(app_dir, 'plugins', 'copiper'); shutil.rmtree(target) if os.path.isdir(target) else None; DirFileUtils.copy_dir(os.path.join(os.getcwd(), 'plugins', 'copiper'), target, True); pycache = os.path.join(target, '__pycache__'); shutil.rmtree(pycache) if os.path.isdir(pycache) else None; print('done')"
```

**同步插件注册表**（改了 `databases/plugins.jdb` 后执行）：
```bash
cd /d/GitDownload/Sup/SupBack && conda run -n supback python -c "from utils.util_utils import DirFileUtils; import os, shutil; app_dir = DirFileUtils.get_app_dir('supcopilot'); shutil.copy2(os.path.join(os.getcwd(), 'databases', 'plugins.jdb'), os.path.join(app_dir, 'databases', 'plugins.jdb')); print('done')"
```

正式目录: `C:\Users\Admin\AppData\Local\supcopilot\`

## Key Conventions

- 后端端口固定 **8133**，前端端口固定 **3000**
- CORS 全开 (`allow_origins=["*"]`)
- 数据库默认使用 JSON 文件存储 (`databases/` 目录)
- Windows 为主要目标平台，Linux 有基本支持
- 代码中使用中文注释和日志
