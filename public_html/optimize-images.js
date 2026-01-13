#!/usr/bin/env node

/**
 * VEIRONAUTO - PNG Image Optimization Script
 * Uses TinyPNG API for high-quality image compression
 *
 * Reduces image sizes by 60-80% with minimal quality loss
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const TINYPNG_API_KEY = '3DSy38YkPl2PvBym9137f1c8Sl035XNj';
const IMAGES_PATH = 'frontend/assets/images/cars';
const MIN_SIZE_TO_OPTIMIZE = 500 * 1024; // 500KB

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
};

function log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

// Recursively find all PNG files
function findPngFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findPngFiles(filePath, fileList);
        } else if (path.extname(file).toLowerCase() === '.png') {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Optimize image using TinyPNG API
function optimizeImage(filePath) {
    return new Promise((resolve, reject) => {
        const fileData = fs.readFileSync(filePath);
        const sizeBefore = fileData.length;

        const options = {
            hostname: 'api.tinify.com',
            path: '/shrink',
            method: 'POST',
            auth: 'api:' + TINYPNG_API_KEY,
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        };

        const req = https.request(options, (res) => {
            if (res.statusCode === 201) {
                // Get optimized image URL
                const optimizedUrl = res.headers.location;

                // Download optimized image
                https.get(optimizedUrl, (downloadRes) => {
                    const chunks = [];

                    downloadRes.on('data', (chunk) => {
                        chunks.push(chunk);
                    });

                    downloadRes.on('end', () => {
                        const optimizedData = Buffer.concat(chunks);
                        const sizeAfter = optimizedData.length;
                        const reduction = ((1 - (sizeAfter / sizeBefore)) * 100).toFixed(1);

                        // Save optimized image
                        fs.writeFileSync(filePath, optimizedData);

                        resolve({
                            success: true,
                            sizeBefore,
                            sizeAfter,
                            reduction
                        });
                    });
                }).on('error', reject);
            } else {
                let errorData = '';
                res.on('data', (chunk) => {
                    errorData += chunk;
                });
                res.on('end', () => {
                    try {
                        const error = JSON.parse(errorData);
                        reject(new Error(error.message || 'Optimization failed'));
                    } catch (e) {
                        reject(new Error('Optimization failed with status ' + res.statusCode));
                    }
                });
            }
        });

        req.on('error', reject);
        req.write(fileData);
        req.end();
    });
}

// Format bytes to KB/MB
function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Main function
async function main() {
    log('\n=== VEIRONAUTO Image Optimization ===\n', 'cyan');

    // Check if images directory exists
    if (!fs.existsSync(IMAGES_PATH)) {
        log('[ERROR] Images directory not found: ' + IMAGES_PATH, 'red');
        process.exit(1);
    }

    // Find all PNG files
    log('Scanning for PNG files...', 'cyan');
    const pngFiles = findPngFiles(IMAGES_PATH);

    if (pngFiles.length === 0) {
        log('[ERROR] No PNG files found', 'red');
        process.exit(1);
    }

    log(`Found ${pngFiles.length} PNG files\n`, 'green');

    // Calculate total size
    let totalSizeBefore = 0;
    const filesToOptimize = [];

    pngFiles.forEach(file => {
        const stats = fs.statSync(file);
        totalSizeBefore += stats.size;

        if (stats.size >= MIN_SIZE_TO_OPTIMIZE) {
            filesToOptimize.push(file);
        }
    });

    log(`Total size: ${formatBytes(totalSizeBefore)}`, 'yellow');
    log(`Files to optimize: ${filesToOptimize.length} (> 500KB)`, 'yellow');
    log(`Files to skip: ${pngFiles.length - filesToOptimize.length} (already optimized)\n`, 'gray');

    if (filesToOptimize.length === 0) {
        log('[OK] All images are already optimized!', 'green');
        process.exit(0);
    }

    // Create backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupPath = `${IMAGES_PATH}-backup-${timestamp}`;

    log('Creating backup...', 'cyan');

    function copyDir(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const entries = fs.readdirSync(src, { withFileTypes: true });

        entries.forEach(entry => {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                copyDir(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        });
    }

    copyDir(IMAGES_PATH, backupPath);
    log(`[OK] Backup created: ${backupPath}\n`, 'green');

    // Optimize images
    log('Optimizing images...\n', 'cyan');

    let optimized = 0;
    let failed = 0;
    let totalSizeAfter = totalSizeBefore;

    for (let i = 0; i < filesToOptimize.length; i++) {
        const file = filesToOptimize[i];
        const relativePath = file.replace(/\\/g, '/');
        const stats = fs.statSync(file);

        log(`[${i + 1}/${filesToOptimize.length}] Processing: ${relativePath}`, 'gray');
        log(`    Size: ${formatBytes(stats.size)}`, 'gray');

        try {
            const result = await optimizeImage(file);

            if (result.success) {
                log(`    [OK] ${formatBytes(result.sizeBefore)} -> ${formatBytes(result.sizeAfter)} (-${result.reduction}%)`, 'green');
                optimized++;
                totalSizeAfter = totalSizeAfter - result.sizeBefore + result.sizeAfter;
            }
        } catch (error) {
            log(`    [FAIL] ${error.message}`, 'red');
            failed++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Summary
    log('\n=== Optimization Complete ===\n', 'cyan');

    const totalReduction = ((1 - (totalSizeAfter / totalSizeBefore)) * 100).toFixed(1);

    log('Results:', 'cyan');
    log(`  - Optimized: ${optimized} files`, 'green');
    log(`  - Skipped: ${pngFiles.length - filesToOptimize.length} files (already optimized)`, 'yellow');
    log(`  - Failed: ${failed} files`, failed > 0 ? 'red' : 'gray');
    log('');
    log('Size comparison:', 'cyan');
    log(`  - Before: ${formatBytes(totalSizeBefore)}`, 'yellow');
    log(`  - After:  ${formatBytes(totalSizeAfter)}`, 'green');
    log(`  - Saved:  ${formatBytes(totalSizeBefore - totalSizeAfter)} (-${totalReduction}%)`, 'cyan');
    log('');

    if (failed === 0) {
        log('[OK] All images optimized successfully!\n', 'green');
        log('Next steps:', 'cyan');
        log('  1. Test the site locally to verify images load correctly', 'gray');
        log('  2. Upload optimized images to live server', 'gray');
        log('  3. Clear browser cache and test', 'gray');
    } else {
        log('[!] Some files failed. Check errors above.\n', 'yellow');
        log(`Backup available at: ${backupPath}`, 'gray');
    }

    log('');
}

// Run main function
main().catch(error => {
    log('\n[ERROR] ' + error.message, 'red');
    process.exit(1);
});
