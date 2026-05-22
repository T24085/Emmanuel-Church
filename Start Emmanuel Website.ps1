$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptRoot

function Get-FreePort {
    param(
        [Parameter(Mandatory = $true)]
        [int[]]$Ports
    )

    foreach ($port in $Ports) {
        $listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if (-not $listener) {
            return $port
        }
    }

    throw "No free port found in the requested range."
}

function Get-EmmanuelDevProcessId {
    param(
        [int]$Port = 3000
    )

    $listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $listener) {
        return $null
    }

    $process = Get-CimInstance Win32_Process -Filter "ProcessId=$($listener.OwningProcess)" -ErrorAction SilentlyContinue
    if (-not $process) {
        return $null
    }

    $commandLine = $process.CommandLine
    if ($commandLine -and $commandLine -like "*$scriptRoot*" -and $commandLine -like '*next*start-server*') {
        return $listener.OwningProcess
    }

    return $null
}

function Test-EmmanuelResponse {
    param(
        [Parameter(Mandatory = $true)]
        [int]$Port
    )

    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/" -Method Head -TimeoutSec 5 -UseBasicParsing
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

if (Get-EmmanuelDevProcessId -Port 3000) {
    if (Test-EmmanuelResponse -Port 3000) {
        Start-Process "http://127.0.0.1:3000/"
        return
    }

    Stop-Process -Id (Get-EmmanuelDevProcessId -Port 3000) -Force -ErrorAction SilentlyContinue
    if (Test-Path .next) {
        Get-ChildItem .next -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item .next -Force -ErrorAction SilentlyContinue
    }

    Start-Process -FilePath 'npm.cmd' -ArgumentList @('run', 'dev', '--', '--port', '3000', '--hostname', '127.0.0.1') -WorkingDirectory $scriptRoot -WindowStyle Hidden
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) {
            Start-Process "http://127.0.0.1:3000/"
            return
        }
    }

    Write-Host "Restarted the dev server on port 3000, but it is still starting."
    return
}

if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) {
    $port = Get-FreePort -Ports (3001..3010)
} else {
    $port = 3000
}

Start-Process -FilePath 'npm.cmd' -ArgumentList @('run', 'dev', '--', '--port', $port, '--hostname', '127.0.0.1') -WorkingDirectory $scriptRoot -WindowStyle Hidden

for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 1
    if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
        Start-Process "http://127.0.0.1:$port/"
        return
    }
}

Write-Host "Started the dev server on port $port, but it is still starting."
Write-Host "Open http://127.0.0.1:$port/ in a moment if it does not open automatically."
