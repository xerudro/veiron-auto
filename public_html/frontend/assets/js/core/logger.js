/**
 * VEIRON AUTO - Logging Utility
 *
 * Environment-aware logging system that only outputs to console in development.
 * In production, logs are suppressed to improve performance and hide debugging info.
 *
 * Usage:
 *   import logger from './core/logger.js';
 *   logger.log('Debug message');
 *   logger.warn('Warning message');
 *   logger.error('Error message');
 *
 * Or in non-module environments:
 *   <script src="assets/js/core/logger.js"></script>
 *   logger.log('Message');
 */

(function(window) {
    'use strict';

    /**
     * Detect if we're in development environment
     * Checks for localhost, 127.0.0.1, or file:// protocol
     */
    const isDevelopment = (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '' || // file:// protocol
        window.location.protocol === 'file:' ||
        window.location.hostname.includes('192.168.') || // Local network
        window.location.hostname.includes('10.0.') ||    // Local network
        window.location.search.includes('debug=true')    // Force debug mode with ?debug=true
    );

    /**
     * Logger object with conditional logging
     */
    const logger = {
        /**
         * Development mode flag (read-only)
         */
        isDev: isDevelopment,

        /**
         * Log informational messages
         * @param {...any} args - Arguments to log
         */
        log: function(...args) {
            if (isDevelopment) {
                console.log('[VEIRON AUTO]', ...args);
            }
        },

        /**
         * Log warning messages
         * @param {...any} args - Arguments to log
         */
        warn: function(...args) {
            if (isDevelopment) {
                console.warn('[VEIRON AUTO WARNING]', ...args);
            }
        },

        /**
         * Log error messages
         * Always logged, even in production (errors should always be visible)
         * @param {...any} args - Arguments to log
         */
        error: function(...args) {
            console.error('[VEIRON AUTO ERROR]', ...args);
        },

        /**
         * Log informational messages with custom prefix
         * @param {string} prefix - Custom prefix
         * @param {...any} args - Arguments to log
         */
        info: function(prefix, ...args) {
            if (isDevelopment) {
                console.info(`[VEIRON AUTO - ${prefix}]`, ...args);
            }
        },

        /**
         * Log debug messages (only in development)
         * @param {...any} args - Arguments to log
         */
        debug: function(...args) {
            if (isDevelopment) {
                console.debug('[VEIRON AUTO DEBUG]', ...args);
            }
        },

        /**
         * Group console messages
         * @param {string} label - Group label
         */
        group: function(label) {
            if (isDevelopment && console.group) {
                console.group(`[VEIRON AUTO] ${label}`);
            }
        },

        /**
         * End console group
         */
        groupEnd: function() {
            if (isDevelopment && console.groupEnd) {
                console.groupEnd();
            }
        },

        /**
         * Log a table (useful for arrays/objects)
         * @param {any} data - Data to display as table
         */
        table: function(data) {
            if (isDevelopment && console.table) {
                console.table(data);
            }
        }
    };

    // Export for different module systems
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = logger;
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(function() { return logger; });
    } else {
        // Browser global
        window.logger = logger;
    }

})(typeof window !== 'undefined' ? window : this);
