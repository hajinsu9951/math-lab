# 소스 조각을 합쳐 dist\index.html (단일 파일) 을 만든다.
# 사용: powershell -ExecutionPolicy Bypass -File build.ps1
# Node.js 가 없어도 동작합니다.

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $root 'src'

function Get-Src($name) { Get-Content -Raw -Encoding UTF8 (Join-Path $src $name) }

$parts = @(
  (Get-Src '00-head.html'),
  '<style>',
  (Get-Src 'styles.css'),
  '</style>',
  (Get-Src '01-body-top.html'),
  (Get-Src '10-pane1-labs.html'),
  (Get-Src '20-pane2-vibe.html'),
  (Get-Src '30-pane3-flow.html'),
  '<script>',
  (Get-Src '40-demos.js'),
  (Get-Src '50-labs-spec.js'),
  (Get-Src '60-engine.js'),
  '</script>',
  (Get-Src '99-foot.html')
)

$out = $parts -join "`n"
$dist = Join-Path $root 'dist'
if (-not (Test-Path $dist)) { New-Item -ItemType Directory -Path $dist | Out-Null }

# BOM 없는 UTF-8 로 저장
[System.IO.File]::WriteAllText((Join-Path $dist 'index.html'), $out, (New-Object System.Text.UTF8Encoding $false))
Write-Host "dist\index.html 생성 완료 ($($out.Length) 자)"
