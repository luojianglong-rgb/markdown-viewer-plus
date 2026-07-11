const statusEl = document.getElementById('status');
const openBtn = document.getElementById('open-ext');
const themeSel = document.getElementById('theme');

// 检查“允许访问文件网址”是否开启
try {
  if (chrome.extension && typeof chrome.extension.isAllowedFileSchemeAccess === 'function') {
    chrome.extension.isAllowedFileSchemeAccess((allowed) => {
      if (allowed) {
        statusEl.textContent = '✅ 已允许访问文件网址';
        statusEl.className = 'status ok';
      } else {
        statusEl.textContent = '⚠️ 未开启「允许访问文件网址」，本地 .md 不会渲染';
        statusEl.className = 'status warn';
      }
    });
  } else {
    statusEl.textContent = '请在扩展详情页开启「允许访问文件网址」';
    statusEl.className = 'status warn';
  }
} catch (_) {
  statusEl.textContent = '请在扩展详情页开启「允许访问文件网址」';
  statusEl.className = 'status warn';
}

openBtn.addEventListener('click', () => {
  const isEdge = navigator.userAgent.includes('Edg/');
  chrome.tabs.create({ url: isEdge ? 'edge://extensions/' : 'chrome://extensions/' });
});

chrome.storage.local.get(['mdv-theme'], (r) => {
  themeSel.value = r['mdv-theme'] ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
});
themeSel.addEventListener('change', () => {
  chrome.storage.local.set({ 'mdv-theme': themeSel.value });
});
