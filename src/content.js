import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import taskLists from 'markdown-it-task-lists';
import { full as emoji } from 'markdown-it-emoji';
import footnote from 'markdown-it-footnote';
import katexPlugin from '@vscode/markdown-it-katex';
import mermaid from 'mermaid';
import pageCss from './page.css';
import hljsCss from 'highlight.js/styles/github-dark.css';

const ALL_CSS = pageCss + '\n' + hljsCss;

// 归一化插件导出：有些包（如 @vscode/markdown-it-katex）在 ESM/CJS 互操作下
// 默认导出会变成 { default: fn }，而 markdown-it.use() 要求传入函数本身，
// 否则内部 plugin.apply(...) 会抛 "apply is not a function"。
function asPlugin(m) {
  return typeof m === 'function' ? m : (m && typeof m.default === 'function' ? m.default : m);
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
  breaks: false,
  highlight(str, lang) {
    // mermaid 代码块：原样输出并保留 language-mermaid 类，供 renderMermaid 识别
    if (lang === 'mermaid') {
      return '<pre><code class="language-mermaid">' + md.utils.escapeHtml(str) + '</code></pre>';
    }
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>';
      } catch (_) { /* fall through */ }
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
})
  .use(asPlugin(taskLists))
  .use(asPlugin(emoji))
  .use(asPlugin(footnote))
  .use(asPlugin(katexPlugin), { throwOnError: false });

const MD_EXT = /\.(md|markdown|mdown|mkd|mdwn)$/i;

function esc(s) {
  return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
function fileName() {
  try { return decodeURIComponent(location.pathname.split('/').pop()) || location.href; }
  catch (_) { return location.href; }
}
function slug(s) {
  return s.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'heading';
}

function setTheme(t) {
  document.body.dataset.theme = t;
  const b = document.getElementById('mdv-theme');
  if (b) b.textContent = t === 'dark' ? '☀️' : '🌙';
}

// 加载 KaTeX 样式（数学公式需要字体）
function loadKatexCss() {
  if (document.getElementById('mdv-katex-css')) return;
  const link = document.createElement('link');
  link.id = 'mdv-katex-css';
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('katex/katex.min.css');
  document.head.appendChild(link);
}

// 右侧目录：给标题加 id，生成可点击目录
function buildToc() {
  const tocEl = document.getElementById('mdv-toc');
  if (!tocEl) return;
  const heads = document.querySelectorAll('#mdv-main h1, #mdv-main h2, #mdv-main h3');
  if (!heads.length) { tocEl.hidden = true; tocEl.innerHTML = ''; return; }
  const seen = {};
  let html = '<div class="mdv-toc-title">目录</div><ul>';
  heads.forEach(h => {
    let id = h.id || slug(h.textContent);
    if (seen[id] != null) { seen[id]++; id = id + '-' + seen[id]; } else { seen[id] = 0; }
    h.id = id;
    const lv = h.tagName.toLowerCase();
    html += `<li class="mdv-toc-${lv}"><a href="#${encodeURIComponent(id)}">${esc(h.textContent.trim())}</a></li>`;
  });
  html += '</ul>';
  tocEl.innerHTML = html;
  tocEl.hidden = false;
  tocEl.onclick = (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.getElementById(decodeURIComponent(href.slice(1)));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
}

// Mermaid：把 ```mermaid 代码块就地渲染成 SVG。
// 直接 bundle mermaid 进内容脚本，在隔离世界用 render() 逐块渲染，
// 每块单独 try/catch，出错就地显示源码 + 错误信息（不再注入页面脚本）。
let mermaidReady = false;
function initMermaid(theme) {
  mermaid.initialize({
    startOnLoad: false,
    theme: theme === 'dark' ? 'dark' : 'default',
    securityLevel: 'loose',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
    flowchart: { htmlLabels: true, useMaxWidth: true },
  });
  mermaidReady = true;
}

async function renderMermaid(theme) {
  const blocks = document.querySelectorAll('pre code.language-mermaid');
  if (!blocks.length) return;
  initMermaid(theme);

  let i = 0;
  for (const code of blocks) {
    const pre = code.parentElement;
    if (!pre) continue;
    const src = code.textContent;
    const holder = document.createElement('div');
    holder.className = 'mdv-mermaid';
    holder.dataset.src = src; // 存源码，切换主题时可重渲染
    pre.replaceWith(holder);

    const id = 'mdv-mmd-' + (i++);
    try {
      const { svg, bindFunctions } = await mermaid.render(id, src);
      holder.innerHTML = svg;
      if (bindFunctions) bindFunctions(holder);
    } catch (e) {
      holder.classList.add('mdv-mermaid-error');
      holder.innerHTML =
        '<div class="mdv-mermaid-msg">⚠️ 流程图渲染失败：' + esc(e && e.message ? e.message : String(e)) + '</div>' +
        '<pre class="mdv-mermaid-raw">' + esc(src) + '</pre>';
      // mermaid 出错时会往 body 追加一个孤立的错误 SVG，清掉它
      const orphan = document.getElementById(id);
      if (orphan) orphan.remove();
    }
  }
}

// 主题切换后重渲染所有图表（用保存的源码）
async function rerenderMermaid(theme) {
  const holders = document.querySelectorAll('.mdv-mermaid');
  if (!holders.length) return;
  initMermaid(theme);
  let i = 0;
  for (const holder of holders) {
    const src = holder.dataset.src;
    if (!src) continue;
    const id = 'mdv-mmd-r-' + (i++);
    holder.classList.remove('mdv-mermaid-error');
    try {
      const { svg, bindFunctions } = await mermaid.render(id, src);
      holder.innerHTML = svg;
      if (bindFunctions) bindFunctions(holder);
    } catch (e) {
      holder.classList.add('mdv-mermaid-error');
      holder.innerHTML =
        '<div class="mdv-mermaid-msg">⚠️ 流程图渲染失败：' + esc(e && e.message ? e.message : String(e)) + '</div>' +
        '<pre class="mdv-mermaid-raw">' + esc(src) + '</pre>';
      const orphan = document.getElementById(id);
      if (orphan) orphan.remove();
    }
  }
}

function applyPage(raw) {
  const html = md.render(raw);
  const name = fileName();
  document.documentElement.innerHTML = `
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)}</title>
<style>${ALL_CSS}</style>
</head>
<body data-theme="light">
  <header id="mdv-topbar">
    <span class="mdv-brand">📄 Markdown Viewer Plus</span>
    <span class="mdv-file" title="${esc(location.href)}">${esc(name)}</span>
    <span class="mdv-spacer"></span>
    <button class="mdv-btn" id="mdv-src" title="源码 / 渲染切换">源码</button>
    <button class="mdv-btn" id="mdv-toc-toggle" title="显示/隐藏目录">≣</button>
    <button class="mdv-btn" id="mdv-theme" title="深色 / 浅色切换">🌙</button>
  </header>
  <div id="mdv-layout">
    <main id="mdv-main">
      <article class="markdown-body">${html}</article>
      <pre id="mdv-raw" class="mdv-raw" hidden>${esc(raw)}</pre>
    </main>
    <aside id="mdv-toc" hidden></aside>
  </div>
</body>`;
  document.title = name;

  // 先按系统主题设定（Mermaid 渲染时用），再异步读取已保存偏好覆盖
  setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  loadKatexCss();
  buildToc();
  renderMermaid(document.body.dataset.theme);

  chrome.storage.local.get(['mdv-theme'], (r) => {
    const saved = r['mdv-theme'];
    if (saved && saved !== document.body.dataset.theme) {
      setTheme(saved);
      rerenderMermaid(saved); // 保存的主题与初始不同，图表跟随重渲染
    }
  });

  const srcBtn = document.getElementById('mdv-src');
  const rawEl = document.getElementById('mdv-raw');
  const artEl = document.querySelector('article.markdown-body');
  let showSrc = false;
  srcBtn.addEventListener('click', () => {
    showSrc = !showSrc;
    rawEl.hidden = !showSrc;
    artEl.hidden = showSrc;
    srcBtn.textContent = showSrc ? '渲染' : '源码';
  });

  document.getElementById('mdv-toc-toggle').addEventListener('click', () => {
    const t = document.getElementById('mdv-toc');
    if (t) t.hidden = !t.hidden;
  });

  document.getElementById('mdv-theme').addEventListener('click', () => {
    const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    chrome.storage.local.set({ 'mdv-theme': next });
    rerenderMermaid(next); // 图表配色跟随主题
  });
}

function showHelp(message) {
  document.documentElement.innerHTML = `
<head><meta charset="utf-8"><style>${ALL_CSS}</style></head>
<body data-theme="light"><main id="mdv-main">
  <div class="mdv-help">
    <h1>📄 Markdown Viewer Plus</h1>
    <p class="mdv-err">${esc(message)}</p>
    <p>要在 <code>file://</code> 本地文件上生效，需开启扩展的文件访问权限：</p>
    <ol>
      <li>地址栏打开 <code>chrome://extensions</code>（Edge 为 <code>edge://extensions</code>）</li>
      <li>找到 <b>Markdown Viewer Plus</b>，点击 <b>详细信息</b></li>
      <li>开启 <b>“允许访问文件网址”</b></li>
      <li>刷新本页</li>
    </ol>
  </div>
</main></body>`;
}

function readRawFromDom() {
  const pre = document.querySelector('pre');
  if (pre && pre.textContent) return pre.textContent;
  if (document.body && document.body.textContent) return document.body.textContent;
  return '';
}

function fetchViaBackground(url) {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage({ type: 'fetch-file', url }, (resp) => {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, error: chrome.runtime.lastError.message });
          return;
        }
        resolve(resp || { ok: false, error: '无响应' });
      });
    } catch (e) {
      resolve({ ok: false, error: String(e) });
    }
  });
}

(async () => {
  if (!MD_EXT.test(location.pathname)) return;
  let raw = readRawFromDom();
  if (!raw) {
    const resp = await fetchViaBackground(location.href);
    if (resp && resp.ok && resp.text) {
      raw = resp.text;
    } else {
      showHelp('无法读取文件：' + ((resp && resp.error) || '未知错误'));
      return;
    }
  }
  try {
    applyPage(raw);
  } catch (e) {
    showHelp('渲染出错：' + e.message);
  }
})();
