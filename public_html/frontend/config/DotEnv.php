<?php
/**
 * Simple .env File Parser
 * Loads environment variables from .env file
 */

class DotEnv {

    /**
     * Load .env file
     */
    public static function load($filePath) {
        if (!file_exists($filePath)) {
            throw new Exception('.env file not found at: ' . $filePath);
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            // Skip comments
            if (strpos(trim($line), '#') === 0) {
                continue;
            }

            // Parse line
            if (strpos($line, '=') !== false) {
                list($name, $value) = explode('=', $line, 2);

                $name = trim($name);
                $value = trim($value);

                // Remove quotes from value
                $value = trim($value, '"\'');

                // Set environment variable
                if (!array_key_exists($name, $_ENV)) {
                    $_ENV[$name] = $value;
                    putenv("$name=$value");
                }
            }
        }
    }

    /**
     * Get environment variable
     */
    public static function get($key, $default = null) {
        return $_ENV[$key] ?? getenv($key) ?: $default;
    }

    /**
     * Check if environment variable exists
     */
    public static function has($key) {
        return isset($_ENV[$key]) || getenv($key) !== false;
    }
}
?>
