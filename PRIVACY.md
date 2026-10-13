# 隐私政策 · Privacy Policy — Markdown Viewer Plus

_最后更新：2026-10-13_

## 中文

**Markdown Viewer Plus**（下称"本扩展"）是一个 Markdown 渲染工具，渲染全程在本机浏览器内完成。我们高度重视你的隐私，特此声明：

### 我们收集什么数据
**不收集任何数据。** 本扩展不收集、不存储、不传输任何个人信息或使用数据。

### 数据如何处理
- 本扩展仅在你主动打开 `.md`（及 `.markdown`/`.mdown`/`.mkd`/`.mdwn`）文件时运行，包括本地文件与在线源代码地址。
- 所有 Markdown 解析与渲染均在**你的浏览器本地**完成，内容只会发送给——你正在看的那个 `.md` 文件所在的服务端（仅当它来自在线地址时，此请求即你主动访问该 URL 本身），**不上传到任何本扩展的服务器**。
- 在线渲染时，本扩展**只读取该 `.md` 地址的内容用于渲染**；若网页已是站点渲染好的形式（如 GitHub/Gitee blob 页），扩展会**自动跳过、不读取其页面结构**。
- 本扩展**不含分析、遥测、广告或更新回传**。
- 唯一的本地存储是你的**主题偏好**（浅色/深色），通过浏览器 `chrome.storage.local` 保存，仅存于你本机、不上传。

### 权限说明
| 权限 | 用途 |
| --- | --- |
| `storage` | 记住你的深色/浅色主题偏好（仅本地） |
| `host_permissions: file:///*` | 读取你打开的本地 `.md` 文件内容以渲染 |
| `host_permissions: http(s)://*/*` | 读取你在地址栏主动访问的在线 `.md` 源代码内容以渲染 |

本扩展**不请求**访问网页浏览记录、标签页、书签或 Cookie。

### 第三方
本扩展不含任何第三方分析、追踪或广告 SDK。渲染所用的开源库（markdown-it、highlight.js、KaTeX、Mermaid）均已打包进扩展本地运行，不联网。

### 联系方式
如有疑问，请通过扩展商店页面的开发者联系方式与我们联系。

---

## English

**Markdown Viewer Plus** ("the Extension") is a Markdown rendering tool. All rendering happens locally in your browser. We take your privacy seriously:

### Data We Collect
**None.** The Extension does not collect, store, or transmit any personal information or usage data.

### How Data Is Handled
- The Extension runs only when you open a `.md` (or `.markdown`/`.mdown`/`.mkd`/`.mdwn`) file — whether local or an online source URL.
- All Markdown parsing and rendering happens **locally in your browser**. Content is sent only to the server hosting the `.md` file you are viewing (for online files — that is the same request your direct visit makes), and **never to the Extension's own servers**.
- For online files, the Extension **reads only that `.md` URL's content** for rendering. If the page is already a rendered site (e.g. GitHub/Gitee blob pages), the Extension **skips it without reading the page structure**.
- The Extension has **no analytics, telemetry, ads, or update callbacks**.
- The only local storage is your **theme preference** (light/dark), saved via `chrome.storage.local` on your machine and never uploaded.

### Permissions
| Permission | Purpose |
| --- | --- |
| `storage` | Remember your light/dark theme preference (local only) |
| `host_permissions: file:///*` | Read the local `.md` file you open, in order to render it |
| `host_permissions: http(s)://*/*` | Read the online `.md` source you open in the address bar, in order to render it |

The Extension does **not** request access to browsing history, tabs, bookmarks, or cookies.

### Third Parties
The Extension contains no third-party analytics, tracking, or advertising SDKs. All open-source rendering libraries (markdown-it, highlight.js, KaTeX, Mermaid) are bundled and run locally, offline.

### Contact
For questions, please reach the developer via the contact listed on the extension's store page.