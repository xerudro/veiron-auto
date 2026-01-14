/**
 * Veiron Auto API Client
 * Optional backend integration layer
 *
 * Usage:
 * 1. Include this file in your HTML: <script src="assets/js/api-client.js"></script>
 * 2. Configure backend URL in config.js
 * 3. Use VeironautoAPI class to make requests
 */

class VeironautoAPI {
    /**
     * @param {string} baseUrl - Backend API URL (e.g., '../backend/api/v1' or 'https://api.veironauto.com/v1')
     */
    constructor(baseUrl = '/backend/api/v1') {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('veironauto_auth_token');
    }

    /**
     * Set authentication token
     * @param {string} token
     */
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('veironauto_auth_token', token);
        } else {
            localStorage.removeItem('veironauto_auth_token');
        }
    }

    /**
     * Make HTTP request
     * @private
     */
    async _request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // ============================================
    // CARS API
    // ============================================

    /**
     * Get all cars with optional filters
     * @param {object} filters - { brand, model, transmission, fuel_type, min_price, max_price, etc. }
     * @param {number} page
     * @param {number} limit
     * @returns {Promise<object>}
     */
    async getCars(filters = {}, page = 1, limit = 20) {
        const params = new URLSearchParams({
            page,
            limit,
            ...filters
        });

        return this._request(`/cars?${params}`);
    }

    /**
     * Get single car by ID
     * @param {number} carId
     * @returns {Promise<object>}
     */
    async getCar(carId) {
        return this._request(`/cars/${carId}`);
    }

    /**
     * Get available car brands
     * @returns {Promise<string[]>}
     */
    async getCarBrands() {
        return this._request('/cars/brands');
    }

    /**
     * Check car availability for date range
     * @param {number} carId
     * @param {string} startDate - Format: YYYY-MM-DD
     * @param {string} endDate - Format: YYYY-MM-DD
     * @returns {Promise<object>}
     */
    async checkAvailability(carId, startDate, endDate) {
        const params = new URLSearchParams({
            start_date: startDate,
            end_date: endDate
        });

        return this._request(`/cars/${carId}/availability?${params}`);
    }

    /**
     * Get car images
     * @param {number} carId
     * @returns {Promise<array>}
     */
    async getCarImages(carId) {
        return this._request(`/cars/${carId}/images`);
    }

    /**
     * Search cars
     * @param {string} query
     * @returns {Promise<object>}
     */
    async searchCars(query) {
        return this.getCars({ search: query });
    }

    // ============================================
    // BOOKINGS API (Phase 3 - Coming Soon)
    // ============================================

    /**
     * Create new booking
     * @param {object} bookingData
     * @returns {Promise<object>}
     */
    async createBooking(bookingData) {
        return this._request('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    /**
     * Get booking by ID
     * @param {number} bookingId
     * @returns {Promise<object>}
     */
    async getBooking(bookingId) {
        return this._request(`/bookings/${bookingId}`);
    }

    /**
     * Get all bookings (admin only)
     * @param {object} filters
     * @param {number} page
     * @param {number} limit
     * @returns {Promise<object>}
     */
    async getBookings(filters = {}, page = 1, limit = 20) {
        const params = new URLSearchParams({
            page,
            limit,
            ...filters
        });

        return this._request(`/bookings?${params}`);
    }

    // ============================================
    // AUTHENTICATION
    // ============================================

    /**
     * Login
     * @param {string} email
     * @param {string} password
     * @returns {Promise<object>}
     */
    async login(email, password) {
        const data = await this._request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data.success && data.data.token) {
            this.setToken(data.data.token);
        }

        return data;
    }

    /**
     * Logout
     * @returns {Promise<object>}
     */
    async logout() {
        const data = await this._request('/auth/logout', {
            method: 'POST'
        });

        this.setToken(null);
        return data;
    }

    // ============================================
    // HEALTH CHECK
    // ============================================

    /**
     * Check API health
     * @returns {Promise<object>}
     */
    async healthCheck() {
        return this._request('/health');
    }

    /**
     * Check if backend API is available
     * @returns {Promise<boolean>}
     */
    async isAvailable() {
        try {
            await this.healthCheck();
            return true;
        } catch (error) {
            return false;
        }
    }
}

// ============================================
// AUTO-DETECTION & INITIALIZATION
// ============================================

/**
 * Auto-detect backend availability and initialize API client
 */
async function initVeironautoAPI() {
    // Try to detect backend location
    const possibleBackendUrls = [
        '/backend/api/v1',              // Same domain, /backend folder
        '../backend/api/v1',            // Relative path
        'https://api.veironauto.com/v1', // Separate API domain (example)
        '/api/v1'                       // Root level API
    ];

    for (const url of possibleBackendUrls) {
        try {
            const api = new VeironautoAPI(url);
            const isAvailable = await api.isAvailable();

            if (isAvailable) {
                console.log(`✅ Veiron Auto API connected: ${url}`);
                window.veironautoAPI = api;
                window.API_ENABLED = true;
                return api;
            }
        } catch (error) {
            // Try next URL
            continue;
        }
    }

    console.log('ℹ️ Veiron Auto API not available - using static data mode');
    window.API_ENABLED = false;
    return null;
}

// ============================================
// USAGE EXAMPLE
// ============================================

/*
// Example 1: Manual initialization
const api = new VeironautoAPI('/backend/api/v1');

// Get all cars
api.getCars().then(response => {
    console.log('Cars:', response.data);
});

// Get specific car
api.getCar(1).then(response => {
    console.log('Car details:', response.data);
});

// Check availability
api.checkAvailability(1, '2025-12-20', '2025-12-27').then(response => {
    console.log('Available:', response.data.available);
});

// Search cars
api.searchCars('Toyota').then(response => {
    console.log('Search results:', response.data);
});

// Example 2: Auto-detection
initVeironautoAPI().then(api => {
    if (api) {
        // Backend is available
        api.getCars().then(response => {
            console.log('Cars from API:', response.data);
        });
    } else {
        // Use static data
        console.log('Using static data from car-pricing-data.json');
    }
});

// Example 3: Check if API is available globally
if (window.API_ENABLED) {
    window.veironautoAPI.getCars().then(response => {
        console.log('Cars:', response.data);
    });
} else {
    // Load from static JSON
    fetch('assets/json/car-pricing-data.json')
        .then(r => r.json())
        .then(data => {
            console.log('Static cars:', data.cars);
        });
}
*/

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VeironautoAPI, initVeironautoAPI };
}
