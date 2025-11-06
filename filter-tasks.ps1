param(
    [string]$TasksFile = "memory-bank/tasks.md",
    [string]$Filter = "BLOCKED" # sau "independent"
)

$lines = Get-Content $TasksFile
if ($Filter -eq "BLOCKED") {
    $lines | Where-Object { $_ -match '\*\*BLOCKED\*\*' } | ForEach-Object { Write-Host $_ }
} elseif ($Filter -eq "independent") {
    $lines | Where-Object { $_ -match '🟢' } | ForEach-Object { Write-Host $_ }
}