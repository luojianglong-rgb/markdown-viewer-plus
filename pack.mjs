// 发布打包：先构建 dist，把上架必需文件复制到干净的 staging 目录，再压成 zip。
// 复制到 staging 可避免浏览器占用 dist 导致压缩失败，也能剔除 .map 等无关文件。
// 用法：node extension/pack.mjs
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, 'dist');
const releases = path.join(__dirname, 'releases');
const staging = path.join(releases, '_staging');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf8'));
const version = manifest.version;

// 1) 构建
console.log('▶ 构建 dist …');
execSync('node ' + JSON.stringify(path.join(__dirname, 'build.mjs')), { stdio: 'inherit' });

// 2) 校验产物齐全
const required = ['manifest.json', 'content.js', 'popup.js', 'popup.html', 'bg.js', 'icons/16.png', 'icons/48.png', 'icons/128.png'];
const missing = required.filter((f) => !fs.existsSync(path.join(dist, f)));
if (missing.length) {
  console.error('✖ dist 缺少文件：', missing.join(', '));
  process.exit(1);
}

// 3) 复制到干净 staging（跳过 .map 源码映射，减小体积）
console.log('▶ 准备发布文件（剔除 .map）…');
fs.rmSync(staging, { recursive: true, force: true });
fs.mkdirSync(staging, { recursive: true });
function copyClean(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.name.endsWith('.map')) continue; // 不上传 sourcemap
    const s = path.join(srcDir, entry.name);
    const d = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyClean(s, d);
    else fs.copyFileSync(s, d);
  }
}
copyClean(dist, staging);

// 4) 打 zip（Compress-Archive 为 Windows 自带；从 staging 打，避免占用问题）
const zipName = `markdown-viewer-plus-v${version}.zip`;
const zipPath = path.join(releases, zipName);
if (fs.existsSync(zipPath)) fs.rmSync(zipPath);

console.log('▶ 打包 zip …');
// 用 .NET ZipFile.CreateFromDirectory，比 Compress-Archive 更稳（不易被 Defender 锁文件）
const psScript = [
  'Add-Type -AssemblyName System.IO.Compression.FileSystem;',
  `[System.IO.Compression.ZipFile]::CreateFromDirectory(${JSON.stringify(staging)}, ${JSON.stringify(zipPath)});`,
].join(' ');
execSync(`powershell -NoProfile -Command "${psScript.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });

// 5) 清理 staging
fs.rmSync(staging, { recursive: true, force: true });

const sizeMB = (fs.statSync(zipPath).size / 1024 / 1024).toFixed(2);
console.log(`\n✅ 发布包已生成：${zipPath}  (${sizeMB} MB)`);
console.log('   上传到 Chrome 网上应用店开发者后台即可。');
