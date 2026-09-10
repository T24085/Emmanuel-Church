$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
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
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/" -Method Get -TimeoutSec 15 -UseBasicParsing
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

function Stop-EmmanuelProcessTree {
    param(
        [Parameter(Mandatory = $true)]
        [int]$ProcessId
    )

    $rootProcessId = $ProcessId
    $currentProcess = Get-CimInstance Win32_Process -Filter "ProcessId=$ProcessId" -ErrorAction SilentlyContinue

    for ($i = 0; $i -lt 8 -and $currentProcess; $i++) {
        $parentProcess = Get-CimInstance Win32_Process -Filter "ProcessId=$($currentProcess.ParentProcessId)" -ErrorAction SilentlyContinue
        if (-not $parentProcess) {
            break
        }

        if ($parentProcess.CommandLine -and $parentProcess.CommandLine -like '*next dev*') {
            $rootProcessId = [int]$parentProcess.ProcessId
            if ($parentProcess.Name -ieq 'cmd.exe') {
                break
            }
        }

        $currentProcess = $parentProcess
    }

    if ($rootProcessId -ne $ProcessId) {
        & taskkill.exe /PID $rootProcessId /T /F | Out-Null
    } else {
        Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue
    }
}

function Ensure-EmmanuelDependencies {
    $requiredPaths = @(
        (Join-Path $scriptRoot 'node_modules\next'),
        (Join-Path $scriptRoot 'node_modules\@vimeo\player')
    )

    if ($requiredPaths | Where-Object { -not (Test-Path -LiteralPath $_) }) {
        Write-Host 'Installing missing website dependencies...'
        & npm.cmd install
        if ($LASTEXITCODE -ne 0) {
            throw 'npm install failed. Check the terminal output and try again.'
        }
    }
}

function Wait-ForEmmanuelResponse {
    param(
        [Parameter(Mandatory = $true)]
        [int]$Port,
        [int]$Attempts = 60
    )

    for ($i = 0; $i -lt $Attempts; $i++) {
        if ((Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) -and (Test-EmmanuelResponse -Port $Port)) {
            return $true
        }

        Start-Sleep -Seconds 1
    }

    return $false
}

Ensure-EmmanuelDependencies

$existingProcessId = Get-EmmanuelDevProcessId -Port 3000

if ($existingProcessId) {
    if (Test-EmmanuelResponse -Port 3000) {
        Start-Process "http://127.0.0.1:3000/"
        return
    }

    Stop-EmmanuelProcessTree -ProcessId $existingProcessId
    Start-Sleep -Milliseconds 500
    if (Test-Path .next) {
        Get-ChildItem .next -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item .next -Force -ErrorAction SilentlyContinue
    }
}

if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) {
    $port = Get-FreePort -Ports (3001..3010)
} else {
    $port = 3000
}

Start-Process -FilePath 'npm.cmd' -ArgumentList @('run', 'dev', '--', '--port', $port, '--hostname', '127.0.0.1') -WorkingDirectory $scriptRoot -WindowStyle Hidden

if (Wait-ForEmmanuelResponse -Port $port) {
    Start-Process "http://127.0.0.1:$port/"
    return
}

Write-Host "Started the dev server on port $port, but it is still starting."
Write-Host "Open http://127.0.0.1:$port/ in a moment if it does not open automatically."
