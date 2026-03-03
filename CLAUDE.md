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
后端通过 Nuitka 编译为 `supback.exe`，前端打包为 `.next` 和 Electron，产物输出到 `F:\_out\sup`。

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

## Key Conventions

- 后端端口固定 **8133**，前端端口固定 **3000**
- CORS 全开 (`allow_origins=["*"]`)
- 数据库默认使用 JSON 文件存储 (`databases/` 目录)
- Windows 为主要目标平台，Linux 有基本支持
- 代码中使用中文注释和日志
