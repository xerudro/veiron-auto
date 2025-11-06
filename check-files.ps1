param(
    [string]$TasksFile = "memory-bank/tasks.md"
)

$lines = Get-Content $TasksFile
foreach ($line in $lines) {
    if ($line -match 'Create ([\w\-/\.]+)') {
        $file = $Matches[1]
        if (-not (Test-Path $file)) {
            Write-Host "LIPSEȘTE: $file"
        }
    }
}