// 用 esbuild 把 content.js / popup.js 打包成扩展可直接加载的单文件
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');
const iconsSrc = path.join(__dirname, 'icons');

// 准备 dist（复用并覆盖；若浏览器正占用文件导致写入失败，需先在扩展页卸载）
fs.mkdirSync(path.join(dist, 'icons'), { recursive: true });

await esbuild.build({
  entryPoints: [path.join(src, 'content.js'), path.join(src, 'popup.js'), path.join(src, 'bg.js')],
  bundle: true,
  format: 'iife',
  outdir: dist,
  loader: { '.css': 'text' },
  target: ['chrome110'],
  minify: true,
  logLevel: 'info',
});

// 复制静态文件（manifest.json 在扩展根目录，popup.html 在 src）
fs.copyFileSync(path.join(__dirname, 'manifest.json'), path.join(dist, 'manifest.json'));
fs.copyFileSync(path.join(src, 'popup.html'), path.join(dist, 'popup.html'));

// 复制图标
if (fs.existsSync(iconsSrc)) {
  for (const f of fs.readdirSync(iconsSrc)) {
    fs.copyFileSync(path.join(iconsSrc, f), path.join(dist, 'icons', f));
  }
}

// 复制 KaTeX 样式 + 字体（运行时按需加载）。Mermaid 已直接 bundle 进 content.js。
// 优先用扩展自身的 node_modules（独立仓库场景），回退到父目录（monorepo 场景）。
const localNm = path.join(__dirname, 'node_modules');
const nm = fs.existsSync(localNm) ? localNm : path.join(__dirname, '..', 'node_modules');
function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}
const katexDist = path.join(nm, 'katex', 'dist');
fs.mkdirSync(path.join(dist, 'katex'), { recursive: true });
fs.copyFileSync(path.join(katexDist, 'katex.min.css'), path.join(dist, 'katex', 'katex.min.css'));
copyDir(path.join(katexDist, 'fonts'), path.join(dist, 'katex', 'fonts'));

console.log('✅ 构建完成 ->', dist);
