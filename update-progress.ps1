# update-progress.ps1
$tasksFile = "memory-bank/tasks.md"
$todoFile = "memory-bank/todo.md"
$progressFile = "memory-bank/progress.md"
$logFile = "memory-bank/progress-log.md"

# Citește ambele fișiere
$lines1 = Get-Content $tasksFile
$lines2 = Get-Content $todoFile

# Combină toate liniile
$allLines = $lines1 + $lines2

# Elimină dublurile (după textul taskului, ignorând statusul)
$uniqueTasks = @{}
foreach ($line in $allLines) {
    if ($line -match '^\s*- \[( |x)\] (.+)$') {
        $taskText = $Matches[2].Trim()
        if (-not $uniqueTasks.ContainsKey($taskText)) {
            $uniqueTasks[$taskText] = $line
        } elseif ($line -match '\[x\]') {
            $uniqueTasks[$taskText] = $line
        }
    }
}

# Reconstruiește progresul pe faze
$phases = @{}
$phase = "General"
foreach ($line in $allLines) {
    if ($line -match '^## (PHASE [0-9]+):') {
        $phase = $Matches[1]
        if (-not $phases.ContainsKey($phase)) { $phases[$phase] = @{done=0; total=0} }
    } elseif ($line -match '^\s*- \[( |x)\] (.+)$') {
        if (-not $phases.ContainsKey($phase)) { $phases[$phase] = @{done=0; total=0} }
        $taskText = $Matches[2].Trim()
        if ($uniqueTasks.ContainsKey($taskText)) {
            $phases[$phase].total++
            if ($uniqueTasks[$taskText] -match '\[x\]') { $phases[$phase].done++ }
        }
    }
}

# Numără taskurile finalizate și totale
$done = ($uniqueTasks.Values | Where-Object { $_ -match '\[x\]' }).Count
$total = $uniqueTasks.Count
$percent = if ($total -gt 0) { [math]::Round(($done / $total) * 100, 1) } else { 0 }

# Faze detectate
$today = (Get-Date -Format 'yyyy-MM-dd')
$doneToday = @()

foreach ($line in $allLines) {
    if ($line -match '^\s*- \[( |x)\]') {
        # Detectează taskuri finalizate azi (doar dacă există timestamp la final)
        if ($line -match '\[x\].*\[($today)\]') { $doneToday += $line.Trim() }
    }
}

# Progres general
$done = ($allLines | Select-String -Pattern '^\s*- \[x\]').Count
$total = ($allLines | Select-String -Pattern '^\s*- \[').Count
if ($total -gt 0) { $percent = [math]::Round(($done / $total) * 100, 1) } else { $percent = 0 }

# Sumar progres pe faze
$phaseSummary = ""
foreach ($p in $phases.Keys) {
    $pd = $phases[$p].done
    $pt = $phases[$p].total
    if ($pt -gt 0) {
        $pp = [math]::Round(($pd / $pt) * 100, 1)
        $phaseSummary += "- ${p}: $pd/$pt ($pp%)`n"
    }
}

# Log zilnic
if ($doneToday.Count -eq 0) { $logToday = "- Nicio task finalizată azi." } else { $logToday = ($doneToday | ForEach-Object { "- $_" }) -join "`n" }

# Creează sumar progres
$summary = @"
# Progress - VEIRONAUTO

## What works
- $done din $total taskuri finalizate ($percent%)
- Ultima actualizare: $(Get-Date -Format 'yyyy-MM-dd HH:mm')

## Progress by Phase
$phaseSummary
## What's left to build
- $($total - $done) taskuri rămase

## Current status
- Progres general: $percent%
- Se lucrează la faza de front-end (HTML/CSS/JS)

## Known issues
- Fără backend/admin momentan
- Date demo limitate, urmează generare suplimentară

## Daily Progress Log ($today)
$logToday
"@

Set-Content -Path $progressFile -Value $summary

# Scrie și logul zilnic separat (append)
$logEntry = "### $today`n$logToday`n"
Add-Content -Path $logFile -Value $logEntry

Write-Host "Progress updated: $done/$total ($percent%) | Log salvat pentru $today" 