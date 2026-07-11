# 为 .md 文件添加右键菜单「用浏览器渲染」
# 用法:
#   powershell -ExecutionPolicy Bypass -File add-context-menu.ps1          安装
#   powershell -ExecutionPolicy Bypass -File add-context-menu.ps1 remove   卸载

param([string]$Action = "install")

# 查找 Edge 或 Chrome
$candidates = @(
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
)
$browser = $null
foreach ($p in $candidates) { if (Test-Path $p) { $browser = $p; break } }
if (-not $browser) {
  Write-Host "未找到 Edge 或 Chrome，请先安装其一。" -ForegroundColor Red
  exit 1
}

$key = "HKCU:\Software\Classes\.md\shell\MDViewerRender"

if ($Action -eq "remove") {
  Remove-Item $key -Recurse -Force -ErrorAction SilentlyContinue
  Write-Host "已移除右键菜单「用浏览器渲染」" -ForegroundColor Green
  exit 0
}

New-Item -Path $key -Force | Out-Null
Set-ItemProperty -Path $key -Name "(Default)" -Value "用浏览器渲染"
Set-ItemProperty -Path $key -Name "Icon" -Value $browser

$cmdKey = "$key\command"
New-Item -Path $cmdKey -Force | Out-Null
Set-ItemProperty -Path $cmdKey -Name "(Default)" -Value "`"$browser`" `"%1`""

Write-Host "已添加右键菜单「用浏览器渲染」" -ForegroundColor Green
Write-Host "浏览器: $browser"
Write-Host "现在右键任意 .md 文件即可看到该菜单项。"
Write-Host ""
Write-Host "若右键看不到该菜单，可能是 .md 已绑定到某个 ProgId；改用「设置 → 默认应用 → .md → 浏览器」即可双击打开。"
