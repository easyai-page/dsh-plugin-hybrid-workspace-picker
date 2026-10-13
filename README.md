# dsh-plugin-hybrid-workspace-picker

<div align="center">

<img src="./icon.svg" width="80" height="80" alt="Hybrid Workspace Picker Logo" />

### DeepSeek Harness 混合工作区目录选择器插件
**同时支持直接输入路径与文件浏览器选择的添加工作区插件**

[English](#english) | [中文说明](#中文说明)

</div>

---

<a id="中文说明"></a>

## 📖 简介

在 DeepSeek Harness (DSH) 原生体验中，点击“添加工作区”默认会强制唤起宿主系统的文件管理器窗口（macOS Finder / Windows 资源管理器 / Linux 文件选择器）。

在许多开发场景下：
- 开发者希望从终端直接复制绝对路径并快速回车粘贴；
- 远程部署、Docker 容器或 SSH 会话中没有本地 GUI 窗口，系统原生选择器不可用；
- 同时，有时用户也依然希望可视化浏览与寻找目录。

**`dsh-plugin-hybrid-workspace-picker`** 彻底解决了这个问题：**零修改任何项目源码**，通过 Cordis 插槽接缝（Slots）无缝接管工作区添加流程。

### ✨ 核心特性

- ⚡ **直接输入路径**：弹窗中央提供自动聚焦的输入框，支持粘贴绝对路径，按 **Enter 键** 即刻完成创建。
- 🖥️ **本地文件管理器（Desktop / 本地 Web）**：输入框旁保留「浏览…」按钮，点击直接呼出系统级文件选择器，选定后自动提交。
- 🌐 **内嵌目录树优雅降级（远程服务器 / 无 GUI Web）**：如果原生文件选择器不可用，插件自动在弹窗内无缝展开宿主目录树，支持直接点击面包屑与文件夹逐级导航。
- 🎨 **原生设计规范**：严格适配 DeepSeek Harness 设计系统与主题变量（`--dsw-alias-*`），自适应浅色与深色模式。
- 🌍 **双语国际化支持**：内置完整的中英文语言包。
- 🔌 **零侵入热更新**：完全作为插件运行，不修改官方核心代码，支持热加载与热卸载。

---

## 🚀 安装方法

### 方式一：在当前会话中让 AI Agent 安装（推荐）

在与 DeepSeek Harness 对话时，直接对 AI 说：

```text
请帮我安装并启用插件 bundle: github:easyai-page/dsh-plugin-hybrid-workspace-picker
```

Agent 将会调用 `plugin_manager` 工具自动安装并即时激活生效。

---

### 方式二：通过 Git 克隆到本地安装

1. 克隆本仓库到你的本地目录：
   ```bash
   git clone https://github.com/easyai-page/dsh-plugin-hybrid-workspace-picker.git ~/.dsh-plugins/hybrid-workspace-picker
   ```

2. 让 AI Agent 安装本地目录，或者在 DSH Profile 的配置中加载：
   ```text
   请帮我安装本地插件 bundle: /绝对路径/~/.dsh-plugins/hybrid-workspace-picker
   ```

---

### 方式三：手动写入 Profile 配置（`cordis.patch.yml`）

在你的 Profile 配置文件（如 `~/.dsh/profiles/<profile-name>/cordis.patch.yml`）中添加：

```yaml
- insert:
    - id: hybrid-workspace-picker
      name: 'dsh-plugin-hybrid-workspace-picker'
```

并在该 Profile 目录的 `package.json` 中添加相应依赖即可。

---

## 🎯 使用指南

安装插件后刷新页面，或者在当前运行中的 Web / 桌面客户端中：

1. 点击左侧侧边栏工作区列表顶部的 **「+」添加工作区** 按钮，或者在空白会话主屏幕工作区选择菜单点击 **「添加工作区…」**。
2. 弹出「添加工作区目录」对话框：
   - **方式 A**：直接输入或粘贴目标路径（例如 `/Users/yourname/projects/my-app`），按下回车；
   - **方式 B**：点击右侧 **「浏览…」** 按钮，在弹出的文件管理器中选取文件夹；
   - **方式 C**（远程 Web 模式）：在无 GUI 环境下点击「浏览…」，弹窗下方会自动展开网页目录树供点选。

---

<a id="english"></a>

## 📖 English Introduction

In the default DeepSeek Harness (DSH) experience, clicking "Add Workspace" triggers the host OS file chooser window (macOS Finder, Windows Explorer, or Linux chooser).

However, in many development workflows:
- Developers want to quickly paste an absolute path copied from the terminal and hit Enter;
- In headless/remote environments (Docker, SSH, cloud instances), native file dialogs are unavailable;
- Yet, visual browsing capability is still desired occasionally.

**`dsh-plugin-hybrid-workspace-picker`** provides the best of both worlds: **without touching any core project source code**, it seamlessly occupies Cordis Slots to offer both path input and directory browsing.

### ✨ Features

- ⚡ **Direct Path Input**: Focused text input for pasting absolute paths, submit directly with **Enter**.
- 🖥️ **System File Browser (Desktop & Local Web)**: Click "Browse…" to open the OS native directory dialog.
- 🌐 **In-page Directory Tree Fallback (Remote/Headless Web)**: If native file dialogs are unavailable, the plugin expands an in-page directory browser for visual navigation.
- 🎨 **DeepSeek Harness Design System**: Pure CSS module adhering to official theme tokens (`--dsw-alias-*`), perfectly adapting to light/dark themes.
- 🌍 **Bilingual Support**: Full English and Simplified Chinese localization included.
- 🔌 **Zero Source Code Intrusion**: Completely modular Cordis plugin with hot-reload support.

---

## 🚀 Installation

### Option 1: Install via AI Agent in conversation (Recommended)

Simply say to your DeepSeek Harness assistant:

```text
Please install and enable the bundle: github:easyai-page/dsh-plugin-hybrid-workspace-picker
```

The agent will invoke `plugin_manager` to install and activate it immediately.

---

### Option 2: Clone and Install Locally

1. Clone this repository locally:
   ```bash
   git clone https://github.com/easyai-page/dsh-plugin-hybrid-workspace-picker.git ~/.dsh-plugins/hybrid-workspace-picker
   ```

2. Ask the assistant to install from the absolute path:
   ```text
   Please install the local bundle: /path/to/dsh-plugin-hybrid-workspace-picker
   ```

---

## 📄 License

[MIT License](LICENSE) © 2026 easyai-page
