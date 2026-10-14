param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$statePath = Join-Path $projectRoot '.local/server.json'
$sha = [System.Security.Cryptography.SHA256]::Create()
$expectedProject = ([BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($projectRoot))).Replace('-','').ToLowerInvariant()).Substring(0,16)
$sha.Dispose()
function Read-RunningServer {
    if (!(Test-Path -LiteralPath $statePath)) { return $null }
    try {
        $saved = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
        $health = Invoke-RestMethod -Uri "http://127.0.0.1:$($saved.port)/health" -TimeoutSec 2
        if ($health.app -eq 'last-shift-versions' -and $health.project -eq $expectedProject) { return $saved }
    } catch { }
    return $null
}
$running = Read-RunningServer
if (!$running) {
    $nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
    if (!$nodeCommand) { throw 'Node.js was not found. Install Node.js or run from the Codex terminal.' }
    $logRoot = Join-Path $projectRoot '.local'
    New-Item -ItemType Directory -Path $logRoot -Force | Out-Null
    $serverFile = Join-Path $projectRoot 'server.cjs'
    Start-Process -FilePath $nodeCommand.Source -ArgumentList @(('"' + $serverFile + '"'), '4174') -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logRoot 'server.log') -RedirectStandardError (Join-Path $logRoot 'server-error.log') | Out-Null
    for ($attempt=0; $attempt -lt 50; $attempt++) {
        Start-Sleep -Milliseconds 100
        $running = Read-RunningServer
        if ($running) { break }
    }
    if (!$running) { throw "Server did not start. See $logRoot/server-error.log" }
}
if (!$NoBrowser) { Start-Process $running.url }
Write-Output $running.url
