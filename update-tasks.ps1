# update-tasks.ps1
param(
    [string]$TasksFile = "memory-bank/tasks.md",
    [string]$TodoFile = "memory-bank/todo.md",
    [string]$Batch = ""
)

function Mark-Blocked {
    param($lines)
    $deps = @{}
    $blocked = @()
    foreach ($i in 0..($lines.Count-1)) {
        $line = $lines[$i]
        if ($line -match 'depinde de ([^\\n]+)') {
            $dep = $Matches[1].Trim()
            $deps[$i] = $dep
        }
    }
    foreach ($i in $deps.Keys) {
        $dep = $deps[$i]
        $found = $lines | Where-Object { $_ -match "\[x\].*$dep" }
        if (-not $found) {
            $lines[$i] = $lines[$i] -replace '^- \[ \]', '- [ ] **BLOCKED**'
            $blocked += $lines[$i]
        }
    }
    return ,$lines
}

function Batch-Complete {
    param($lines, $batch)
    foreach ($task in $batch.Split(',')) {
        $task = $task.Trim()
        for ($i=0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match "\[ \].*$task") {
                $lines[$i] = $lines[$i] -replace '\[ \]', '[x]'
            }
        }
    }
    return ,$lines
}

$lines = Get-Content $TasksFile
if ($Batch) { $lines = Batch-Complete $lines $Batch }
$lines = Mark-Blocked $lines
Set-Content $TasksFile $lines

$lines2 = Get-Content $TodoFile
if ($Batch) { $lines2 = Batch-Complete $lines2 $Batch }
$lines2 = Mark-Blocked $lines2
Set-Content $TodoFile $lines2

Write-Host "Batch complete & BLOCKED update done."