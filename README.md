# Markdown Viewer Plus

在 Chrome / Edge 里打开本地 `.md` 文件时，自动渲染成带样式的页面 —— 无需服务器、不联网、纯本地运行。

告别双击 `.md` 只能看源码的痛点。

## ✨ 特性

- **GitHub 风格渲染**：标题、表格、列表、任务列表、引用、分割线
- **代码高亮**：JavaScript、Python、TypeScript、SQL、Bash 等常见语言（基于 highlight.js）
- **数学公式**：行内与块级 LaTeX 公式（基于 KaTeX）
- **Mermaid 图表**：流程图、时序图、类图、状态图、甘特图、饼图、Git 图等，逐块渲染 + 出错就地提示
- **自动目录**：右侧从标题生成，点击跳转
- **深色 / 浅色模式**：一键切换、记住偏好，图表配色自动跟随
- **源码 / 渲染切换**：随时查看原始 Markdown
- **相对链接与图片**：点击 `.md` 链接跳转，自动显示相对路径图片

## 🔒 隐私

完全本地运行，不联网、不收集任何数据，不请求浏览记录 / 标签页 / Cookie 等任何网站权限。详见 [PRIVACY.md](./PRIVACY.md)。

## 📦 安装

### 方式一：从应用商店（发布后）

Chrome 网上应用店搜索 **Markdown Viewer Plus**。

### 方式二：加载解压扩展（开发 / 抢先）

1. 克隆并构建：
   ```bash
   git clone https://github.com/luojianglong-rgb/markdown-viewer-plus.git
   cd markdown-viewer-plus
   npm install
   npm run build
   ```
2. 打开扩展管理页：Chrome `chrome://extensions`，Edge `edge://extensions`
3. 开启右上角 **开发者模式**
4. 点 **加载解压缩的扩展**，选择本项目下的 `dist` 目录
5. 点扩展卡片 **详细信息** → 开启 **允许访问文件网址**（关键，否则本地文件不渲染）

## 🚀 使用

- 用浏览器打开任意本地 `.md` 文件 → 自动渲染
- 顶栏 **源码** 按钮：切换源码 / 渲染
- 顶栏 **🌙 / ☀️**：切换深色 / 浅色（记忆偏好）
- 点击正文里的相对 `.md` 链接：自动跳转并渲染

想让双击 `.md` 直接用浏览器打开？把浏览器设为 `.md` 的默认程序即可（见 [add-context-menu.ps1](./add-context-menu.ps1) 可加右键菜单）。

## 🛠️ 开发

```bash
npm install        # 安装依赖
npm run build      # 构建到 dist/
npm run pack       # 构建并打成可上架的 zip（输出到 releases/）
```

改完 `src/` 后重新 `npm run build`，在扩展管理页点刷新即可。

### 项目结构

```
markdown-viewer-plus/
├── manifest.json        # MV3 清单
├── build.mjs            # esbuild 打包脚本
├── pack.mjs             # 发布打包（生成 zip）
├── icons/               # 扩展图标（16/48/128）
├── src/
│   ├── content.js       # 内容脚本：抓取 .md → 渲染 → 替换页面
│   ├── popup.js / .html # 工具栏弹窗：文件权限状态 + 主题
│   └── page.css         # 页面样式（含深色模式）
└── dist/                # 构建产物（浏览器加载这个，不入库）
```

### 技术栈

markdown-it · highlight.js · KaTeX · Mermaid · esbuild —— 全部本地打包，运行时不联网。

## 📄 许可

[MIT](./LICENSE)
