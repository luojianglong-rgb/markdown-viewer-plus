// 服务工作线程：代理 content script 对 file:// 的读取
// （内容脚本运行在页面 file:// null 源下，fetch 本地文件会被同源策略拦截；
//   而扩展自身的服务工作线程具备文件访问权限，可正常 fetch）
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === 'fetch-file') {
    fetch(msg.url, { cache: 'no-store' })
      .then((r) => r.ok ? r.text() : Promise.reject(new Error('HTTP ' + r.status)))
      .then((text) => sendResponse({ ok: true, text }))
      .catch((e) => sendResponse({ ok: false, error: String((e && e.message) || e) }));
    return true; // 异步响应
  }
});
