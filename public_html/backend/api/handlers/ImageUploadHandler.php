<?php
/**
 * Image Upload Handler
 * Handles file uploads, validation, resizing, and storage
 */

require_once __DIR__ . '/../../config/api.php';

class ImageUploadHandler {
    private $uploadPath;
    private $uploadUrl;
    private $maxSize;
    private $allowedTypes;
    private $errors = [];

    public function __construct() {
        $this->uploadPath = UPLOAD_PATH;
        $this->uploadUrl = UPLOAD_URL;
        $this->maxSize = UPLOAD_MAX_SIZE;
        $this->allowedTypes = UPLOAD_ALLOWED_TYPES;

        // Ensure upload directory exists
        if (!is_dir($this->uploadPath)) {
            mkdir($this->uploadPath, 0755, true);
        }

        // Create subdirectories
        $subdirs = ['cars', 'gallery', 'temp', 'thumbnails'];
        foreach ($subdirs as $subdir) {
            $path = $this->uploadPath . $subdir;
            if (!is_dir($path)) {
                mkdir($path, 0755, true);
            }
        }
    }

    /**
     * Upload single image
     * @param array $file - $_FILES array element
     * @param string $category - 'cars' or 'gallery'
     * @param bool $createThumbnails - Whether to create thumbnails
     * @return array|false - Returns image data on success, false on failure
     */
    public function upload($file, $category = 'cars', $createThumbnails = true) {
        $this->errors = [];

        // Validate file
        if (!$this->validateFile($file)) {
            return false;
        }

        // Generate unique filename
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $filename = $this->generateFilename($extension);
        $targetPath = $this->uploadPath . $category . '/' . $filename;
        $relativeUrl = $this->uploadUrl . $category . '/' . $filename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            $this->errors[] = 'Failed to move uploaded file';
            return false;
        }

        // Get image dimensions
        $imageInfo = getimagesize($targetPath);
        $width = $imageInfo[0];
        $height = $imageInfo[1];

        $result = [
            'filename' => $filename,
            'url' => $relativeUrl,
            'full_path' => $targetPath,
            'size' => filesize($targetPath),
            'width' => $width,
            'height' => $height,
            'type' => $extension,
            'thumbnails' => []
        ];

        // Create thumbnails if requested
        if ($createThumbnails) {
            $result['thumbnails'] = $this->createThumbnails($targetPath, $category, $filename);
        }

        return $result;
    }

    /**
     * Upload multiple images
     * @param array $files - Multiple files from $_FILES
     * @param string $category
     * @param bool $createThumbnails
     * @return array - Array of uploaded images
     */
    public function uploadMultiple($files, $category = 'cars', $createThumbnails = true) {
        $uploaded = [];

        // Handle both single and multiple file uploads
        if (isset($files['tmp_name']) && is_array($files['tmp_name'])) {
            // Multiple files
            $fileCount = count($files['tmp_name']);
            for ($i = 0; $i < $fileCount; $i++) {
                $file = [
                    'name' => $files['name'][$i],
                    'type' => $files['type'][$i],
                    'tmp_name' => $files['tmp_name'][$i],
                    'error' => $files['error'][$i],
                    'size' => $files['size'][$i]
                ];

                $result = $this->upload($file, $category, $createThumbnails);
                if ($result) {
                    $uploaded[] = $result;
                }
            }
        } else {
            // Single file
            $result = $this->upload($files, $category, $createThumbnails);
            if ($result) {
                $uploaded[] = $result;
            }
        }

        return $uploaded;
    }

    /**
     * Validate uploaded file
     * @param array $file
     * @return bool
     */
    private function validateFile($file) {
        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $this->errors[] = $this->getUploadErrorMessage($file['error']);
            return false;
        }

        // Check file size
        if ($file['size'] > $this->maxSize) {
            $maxSizeMB = $this->maxSize / 1024 / 1024;
            $this->errors[] = "File size exceeds maximum allowed size of {$maxSizeMB}MB";
            return false;
        }

        // Check file type by extension
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $this->allowedTypes)) {
            $this->errors[] = "File type '{$extension}' is not allowed. Allowed types: " . implode(', ', $this->allowedTypes);
            return false;
        }

        // Validate image using getimagesize
        $imageInfo = @getimagesize($file['tmp_name']);
        if ($imageInfo === false) {
            $this->errors[] = 'File is not a valid image';
            return false;
        }

        // Check MIME type
        $allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!in_array($imageInfo['mime'], $allowedMimeTypes)) {
            $this->errors[] = 'Invalid image MIME type';
            return false;
        }

        return true;
    }

    /**
     * Create thumbnails in different sizes
     * @param string $sourcePath
     * @param string $category
     * @param string $originalFilename
     * @return array
     */
    private function createThumbnails($sourcePath, $category, $originalFilename) {
        $thumbnails = [];
        $sizes = [
            'small' => THUMBNAIL_SMALL,
            'medium' => THUMBNAIL_MEDIUM,
            'large' => THUMBNAIL_LARGE
        ];

        $filenameWithoutExt = pathinfo($originalFilename, PATHINFO_FILENAME);
        $extension = pathinfo($originalFilename, PATHINFO_EXTENSION);

        foreach ($sizes as $sizeName => $dimensions) {
            $thumbFilename = "{$filenameWithoutExt}_{$sizeName}.{$extension}";
            $thumbPath = $this->uploadPath . 'thumbnails/' . $thumbFilename;
            $thumbUrl = $this->uploadUrl . 'thumbnails/' . $thumbFilename;

            if ($this->resizeImage($sourcePath, $thumbPath, $dimensions[0], $dimensions[1])) {
                $thumbnails[$sizeName] = [
                    'filename' => $thumbFilename,
                    'url' => $thumbUrl,
                    'width' => $dimensions[0],
                    'height' => $dimensions[1]
                ];
            }
        }

        return $thumbnails;
    }

    /**
     * Resize image maintaining aspect ratio
     * @param string $sourcePath
     * @param string $targetPath
     * @param int $maxWidth
     * @param int $maxHeight
     * @return bool
     */
    private function resizeImage($sourcePath, $targetPath, $maxWidth, $maxHeight) {
        try {
            $imageInfo = getimagesize($sourcePath);
            $sourceWidth = $imageInfo[0];
            $sourceHeight = $imageInfo[1];
            $mimeType = $imageInfo['mime'];

            // Create source image resource
            switch ($mimeType) {
                case 'image/jpeg':
                case 'image/jpg':
                    $sourceImage = imagecreatefromjpeg($sourcePath);
                    break;
                case 'image/png':
                    $sourceImage = imagecreatefrompng($sourcePath);
                    break;
                case 'image/webp':
                    $sourceImage = imagecreatefromwebp($sourcePath);
                    break;
                default:
                    return false;
            }

            if (!$sourceImage) {
                return false;
            }

            // Calculate new dimensions maintaining aspect ratio
            $ratio = min($maxWidth / $sourceWidth, $maxHeight / $sourceHeight);
            $newWidth = (int) ($sourceWidth * $ratio);
            $newHeight = (int) ($sourceHeight * $ratio);

            // Create new image
            $newImage = imagecreatetruecolor($newWidth, $newHeight);

            // Preserve transparency for PNG and WebP
            if ($mimeType === 'image/png' || $mimeType === 'image/webp') {
                imagealphablending($newImage, false);
                imagesavealpha($newImage, true);
                $transparent = imagecolorallocatealpha($newImage, 0, 0, 0, 127);
                imagefilledrectangle($newImage, 0, 0, $newWidth, $newHeight, $transparent);
            }

            // Resize
            imagecopyresampled($newImage, $sourceImage, 0, 0, 0, 0, $newWidth, $newHeight, $sourceWidth, $sourceHeight);

            // Save resized image
            $quality = 85;
            $success = false;

            switch ($mimeType) {
                case 'image/jpeg':
                case 'image/jpg':
                    $success = imagejpeg($newImage, $targetPath, $quality);
                    break;
                case 'image/png':
                    $success = imagepng($newImage, $targetPath, 9);
                    break;
                case 'image/webp':
                    $success = imagewebp($newImage, $targetPath, $quality);
                    break;
            }

            // Free memory
            imagedestroy($sourceImage);
            imagedestroy($newImage);

            return $success;
        } catch (Exception $e) {
            error_log('Image resize error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete image and its thumbnails
     * @param string $imageUrl - Relative URL from database
     * @return bool
     */
    public function deleteImage($imageUrl) {
        // Convert URL to file path
        $filePath = str_replace($this->uploadUrl, $this->uploadPath, $imageUrl);

        $deleted = false;

        // Delete main image
        if (file_exists($filePath)) {
            $deleted = unlink($filePath);
        }

        // Delete thumbnails
        $filenameWithoutExt = pathinfo($filePath, PATHINFO_FILENAME);
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $sizes = ['small', 'medium', 'large'];

        foreach ($sizes as $size) {
            $thumbFilename = "{$filenameWithoutExt}_{$size}.{$extension}";
            $thumbPath = $this->uploadPath . 'thumbnails/' . $thumbFilename;

            if (file_exists($thumbPath)) {
                unlink($thumbPath);
            }
        }

        return $deleted;
    }

    /**
     * Generate unique filename
     * @param string $extension
     * @return string
     */
    private function generateFilename($extension) {
        return uniqid('img_', true) . '_' . time() . '.' . $extension;
    }

    /**
     * Get upload error message
     * @param int $errorCode
     * @return string
     */
    private function getUploadErrorMessage($errorCode) {
        $errors = [
            UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive in php.ini',
            UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive in HTML form',
            UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
        ];

        return $errors[$errorCode] ?? 'Unknown upload error';
    }

    /**
     * Get validation errors
     * @return array
     */
    public function getErrors() {
        return $this->errors;
    }

    /**
     * Check if upload path is writable
     * @return bool
     */
    public function isWritable() {
        return is_writable($this->uploadPath);
    }

    /**
     * Get upload configuration
     * @return array
     */
    public function getConfig() {
        return [
            'upload_path' => $this->uploadPath,
            'upload_url' => $this->uploadUrl,
            'max_size' => $this->maxSize,
            'max_size_mb' => round($this->maxSize / 1024 / 1024, 2),
            'allowed_types' => $this->allowedTypes,
            'writable' => $this->isWritable()
        ];
    }
}
?>
