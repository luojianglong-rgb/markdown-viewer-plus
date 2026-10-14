# 隐私政策 · Privacy Policy — Markdown Viewer Plus

_最后更新：2026-10-14_

## 中文

**Markdown Viewer Plus**（下称"本扩展"）是一个 Markdown 渲染工具，渲染全程在本机浏览器内完成。我们高度重视你的隐私，特此声明：

### 我们收集什么数据
**不收集任何数据。** 本扩展不收集、不存储、不传输任何个人信息或使用数据。

### 数据如何处理
**本地文件场景（`file://`）**
- 你打开本地 `.md`（及 `.markdown`/`.mdown`/`.mkd`/`.mdwn`）文件时，扩展读取该文件内容并在**你的浏览器本地**完成解析与渲染。
- 此过程**全程不联网**：内容不会上传、不会离开你的设备。

**在线场景（`http(s)://`）**
- 你在地址栏主动访问在线 `.md` 源代码地址时，扩展会通过自身的后台代理重新读取**你当前正看的那个 `.md` 地址**的原始文本，用于渲染。
- 这一读取请求与你直接在地址栏打开该链接**指向的是同一个目标服务器**（即该 `.md` 所在站点），且**以不缓存方式发起（`cache: no-store`）、不做任何本地缓存**，更**不会上传到本扩展的任何服务器**。
- 扩展**只读取该 `.md` 地址的内容**用于渲染；若网页已是站点渲染好的形式（如 GitHub/Gitee blob 页），扩展会**自动跳过、不读取其页面结构**。
- Markdown 正文里的相对链接与相对图片，其引用仍指向该 `.md` 所在站点——若你点击跳转或浏览器加载这些相对资源，请求也仅发往该站点。

**通用承诺**
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
**Local files (`file://`)**
- When you open a local `.md` (or `.markdown`/`.mdown`/`.mkd`/`.mdwn`) file, the Extension reads that file's content and parses/renders it **entirely in your browser, locally**.
- This process is **fully offline** — content is not uploaded and never leaves your device.

**Online files (`http(s)://`)**
- When you open an online `.md` source URL in the address bar, the Extension re-fetches the raw text of **that same `.md` URL you are viewing** through its own background proxy, in order to render it.
- This read request points to **the same destination server as if you had opened that link directly** (i.e. the site hosting the `.md`), is made **without caching (`cache: no-store`), stores nothing locally**, and is **never sent to any server of the Extension's own**.
- The Extension **reads only that `.md` URL's content** for rendering. If the page is already a rendered site (e.g. GitHub/Gitee blob pages), the Extension **skips it without reading the page structure**.
- Relative links and images in the Markdown still point to the site hosting the `.md` — if you click them or the browser loads those relative resources, the requests likewise go only to that site.

**General commitments**
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