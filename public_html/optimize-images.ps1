# VEIRONAUTO - PNG Image Optimization Script
# Reduces image sizes by 60-80% with minimal quality loss

Write-Host "=== VEIRONAUTO Image Optimization ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$imagesPath = "frontend/assets/images/cars"
$quality = "70-80" # Quality range (lower = smaller files)
$backupPath = "frontend/assets/images/cars-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Check if pngquant is installed
$pngquantPath = Get-Command pngquant -ErrorAction SilentlyContinue

if (-not $pngquantPath) {
    Write-Host "[!] pngquant not found. Installing..." -ForegroundColor Yellow
    Write-Host ""

    # Check if Chocolatey is installed
    $chocoPath = Get-Command choco -ErrorAction SilentlyContinue

    if ($chocoPath) {
        Write-Host "Installing pngquant via Chocolatey..." -ForegroundColor Green
        choco install pngquant -y

        # Refresh PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

        $pngquantPath = Get-Command pngquant -ErrorAction SilentlyContinue
    }

    if (-not $pngquantPath) {
        Write-Host ""
        Write-Host "[!] Unable to install pngquant automatically." -ForegroundColor Red
        Write-Host ""
        Write-Host "Please install pngquant manually:" -ForegroundColor Yellow
        Write-Host "  1. Download from: https://pngquant.org/" -ForegroundColor White
        Write-Host "  2. Extract to C:\Program Files\pngquant\" -ForegroundColor White
        Write-Host "  3. Add to PATH or run this script again" -ForegroundColor White
        Write-Host ""
        Write-Host "Alternatively, install Chocolatey and run:" -ForegroundColor Yellow
        Write-Host "  choco install pngquant -y" -ForegroundColor White
        Write-Host ""

        $manual = Read-Host "Do you have pngquant.exe available? Enter full path or 'n' to exit"

        if ($manual -eq 'n' -or $manual -eq '') {
            exit 1
        }

        $pngquantPath = @{ Source = $manual }
    }
}

Write-Host "[OK] pngquant found: $($pngquantPath.Source)" -ForegroundColor Green
Write-Host ""

# Count PNG files
$pngFiles = Get-ChildItem -Path $imagesPath -Filter "*.png" -Recurse
$totalFiles = $pngFiles.Count

Write-Host "Found $totalFiles PNG files to optimize" -ForegroundColor Cyan
Write-Host ""

# Calculate total size before optimization
$totalSizeBefore = ($pngFiles | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Total size before: $([math]::Round($totalSizeBefore, 2)) MB" -ForegroundColor Yellow
Write-Host ""

# Ask for confirmation
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  - Create backup at: $backupPath" -ForegroundColor White
Write-Host "  - Optimize all PNG files with quality $quality" -ForegroundColor White
Write-Host "  - Expected reduction: 60-80%" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Continue? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "[!] Cancelled" -ForegroundColor Red
    exit 0
}

# Create backup
Write-Host ""
Write-Host "Creating backup..." -ForegroundColor Cyan
Copy-Item -Path $imagesPath -Destination $backupPath -Recurse -Force
Write-Host "[OK] Backup created at: $backupPath" -ForegroundColor Green
Write-Host ""

# Optimize images
Write-Host "Optimizing images..." -ForegroundColor Cyan
Write-Host ""

$optimized = 0
$failed = 0
$skipped = 0

foreach ($file in $pngFiles) {
    $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 1)
    $sizeBefore = $file.Length / 1KB

    Write-Host "  Processing: $relativePath" -ForegroundColor Gray
    Write-Host "    Size: $([math]::Round($sizeBefore, 0)) KB" -ForegroundColor DarkGray

    # Skip already optimized images (< 500KB)
    if ($file.Length -lt 512000) {
        Write-Host "    [SKIP] Already optimized" -ForegroundColor DarkGray
        $skipped++
        continue
    }

    try {
        # Run pngquant
        $output = & $pngquantPath.Source --quality=$quality --force --ext=.png "$($file.FullName)" 2>&1

        if ($LASTEXITCODE -eq 0) {
            # Get new size
            $fileAfter = Get-Item $file.FullName
            $sizeAfter = $fileAfter.Length / 1KB
            $reduction = [math]::Round((1 - ($sizeAfter / $sizeBefore)) * 100, 1)

            Write-Host "    [OK] $([math]::Round($sizeBefore, 0)) KB -> $([math]::Round($sizeAfter, 0)) KB (-$reduction%)" -ForegroundColor Green
            $optimized++
        } else {
            Write-Host "    [FAIL] $output" -ForegroundColor Red
            $failed++
        }
    } catch {
        Write-Host "    [ERROR] $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "=== Optimization Complete ===" -ForegroundColor Cyan
Write-Host ""

# Calculate total size after optimization
$pngFilesAfter = Get-ChildItem -Path $imagesPath -Filter "*.png" -Recurse
$totalSizeAfter = ($pngFilesAfter | Measure-Object -Property Length -Sum).Sum / 1MB
$totalReduction = [math]::Round((1 - ($totalSizeAfter / $totalSizeBefore)) * 100, 1)

Write-Host "Results:" -ForegroundColor Cyan
Write-Host "  - Optimized: $optimized files" -ForegroundColor Green
Write-Host "  - Skipped: $skipped files (already optimized)" -ForegroundColor Yellow
Write-Host "  - Failed: $failed files" -ForegroundColor Red
Write-Host ""
Write-Host "Size comparison:" -ForegroundColor Cyan
Write-Host "  - Before: $([math]::Round($totalSizeBefore, 2)) MB" -ForegroundColor Yellow
Write-Host "  - After:  $([math]::Round($totalSizeAfter, 2)) MB" -ForegroundColor Green
Write-Host "  - Saved:  $([math]::Round($totalSizeBefore - $totalSizeAfter, 2)) MB (-$totalReduction%)" -ForegroundColor Cyan
Write-Host ""

if ($failed -eq 0) {
    Write-Host "[OK] All images optimized successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Test the site locally to verify images load correctly" -ForegroundColor White
    Write-Host "  2. Upload optimized images to live server" -ForegroundColor White
    Write-Host "  3. Clear browser cache and test" -ForegroundColor White
} else {
    Write-Host "[!] Some files failed. Check errors above." -ForegroundColor Yellow
    Write-Host "Backup available at: $backupPath" -ForegroundColor White
}

Write-Host ""
