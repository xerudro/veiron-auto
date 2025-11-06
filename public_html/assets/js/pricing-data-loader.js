/**
 * Car Pricing Data Loader
 * Utility functions for loading and processing car pricing data from Excel
 * 
 * @author VEIRONAUTO Development Team
 * @version 1.0.0
 */

class CarPricingDataLoader {
    constructor() {
        this.data = null;
        this.exchangeRate = 5.07; // EUR to RON
    }

    /**
     * Load pricing data from JSON file
     * @returns {Promise<Object>} Pricing data object
     */
    async loadData() {
        try {
            const response = await fetch('/assets/json/car-pricing-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error('Error loading pricing data:', error);
            throw error;
        }
    }

    /**
     * Get car by ID
     * @param {string} carId - Car identifier
     * @returns {Object|null} Car object or null if not found
     */
    getCarById(carId) {
        if (!this.data) {
            console.warn('Data not loaded. Call loadData() first.');
            return null;
        }
        return this.data.cars.find(car => car.id === carId) || null;
    }

    /**
     * Get car by name (case insensitive)
     * @param {string} carName - Car name
     * @returns {Object|null} Car object or null if not found
     */
    getCarByName(carName) {
        if (!this.data) {
            console.warn('Data not loaded. Call loadData() first.');
            return null;
        }
        return this.data.cars.find(car => 
            car.name.toLowerCase().includes(carName.toLowerCase())
        ) || null;
    }

    /**
     * Get price for specific tier (1-3 days pricing)
     * @param {string} carId - Car identifier
     * @param {string} tier - Pricing tier (tier1, tier2, tier3, tier4)
     * @param {string} currency - Currency (EUR or RON)
     * @returns {number|null} Price or null if not found
     */
    getPrice(carId, tier = 'tier1', currency = 'EUR') {
        const car = this.getCarById(carId);
        if (!car || !car.pricing[tier]) {
            return null;
        }

        const priceEUR = car.pricing[tier];
        return currency === 'RON' ? Math.round(priceEUR * this.exchangeRate) : priceEUR;
    }

    /**
     * Get display price (tier1 pricing for website display)
     * @param {string} carId - Car identifier
     * @param {string} currency - Currency (EUR or RON)
     * @returns {number|null} Display price or null if not found
     */
    getDisplayPrice(carId, currency = 'EUR') {
        return this.getPrice(carId, 'tier1', currency);
    }

    /**
     * Get all pricing tiers for a car
     * @param {string} carId - Car identifier
     * @param {string} currency - Currency (EUR or RON)
     * @returns {Object|null} Pricing object or null if not found
     */
    getAllPrices(carId, currency = 'EUR') {
        const car = this.getCarById(carId);
        if (!car) {
            return null;
        }

        const pricing = {};
        Object.keys(car.pricing).forEach(tier => {
            const priceEUR = car.pricing[tier];
            pricing[tier] = currency === 'RON' ? Math.round(priceEUR * this.exchangeRate) : priceEUR;
        });

        return pricing;
    }

    /**
     * Get cars by transmission type
     * @param {string} transmission - Transmission type (automat, manual)
     * @returns {Array} Array of car objects
     */
    getCarsByTransmission(transmission) {
        if (!this.data) {
            console.warn('Data not loaded. Call loadData() first.');
            return [];
        }
        return this.data.cars.filter(car => car.transmission === transmission);
    }

    /**
     * Get cars by price range
     * @param {number} minPrice - Minimum price (EUR)
     * @param {number} maxPrice - Maximum price (EUR)
     * @param {string} tier - Pricing tier to check
     * @returns {Array} Array of car objects
     */
    getCarsByPriceRange(minPrice, maxPrice, tier = 'tier1') {
        if (!this.data) {
            console.warn('Data not loaded. Call loadData() first.');
            return [];
        }
        return this.data.cars.filter(car => {
            const price = car.pricing[tier];
            return price >= minPrice && price <= maxPrice;
        });
    }

    /**
     * Get cars with specific number of seats
     * @param {number} seats - Number of seats
     * @returns {Array} Array of car objects
     */
    getCarsBySeats(seats) {
        if (!this.data) {
            console.warn('Data not loaded. Call loadData() first.');
            return [];
        }
        return this.data.cars.filter(car => car.seats === seats);
    }

    /**
     * Get insurance pricing for a car
     * @param {string} carId - Car identifier
     * @returns {Object|null} Insurance object or null if not found
     */
    getInsurancePricing(carId) {
        const car = this.getCarById(carId);
        return car ? car.insurance : null;
    }

    /**
     * Get deposit amount for a car
     * @param {string} carId - Car identifier
     * @returns {number|null} Deposit amount in EUR or null if not found
     */
    getDeposit(carId) {
        const car = this.getCarById(carId);
        return car ? car.deposit : null;
    }

    /**
     * Search cars by keyword
     * @param {string} keyword - Search keyword
     * @returns {Array} Array of matching car objects
     */
    searchCars(keyword) {
        if (!this.data) {
            console.warn('Data not loaded. Call loadData() first.');
            return [];
        }
        const searchTerm = keyword.toLowerCase();
        return this.data.cars.filter(car => 
            car.name.toLowerCase().includes(searchTerm) ||
            car.id.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Get metadata information
     * @returns {Object|null} Metadata object or null if not loaded
     */
    getMetadata() {
        return this.data ? this.data.metadata : null;
    }

    /**
     * Get pricing tier descriptions
     * @returns {Object|null} Pricing tiers object or null if not loaded
     */
    getPricingTiers() {
        return this.data ? this.data.pricingTiers : null;
    }

    /**
     * Convert price between currencies
     * @param {number} amount - Amount to convert
     * @param {string} fromCurrency - Source currency (EUR or RON)
     * @param {string} toCurrency - Target currency (EUR or RON)
     * @returns {number} Converted amount
     */
    convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) {
            return amount;
        }
        
        if (fromCurrency === 'EUR' && toCurrency === 'RON') {
            return Math.round(amount * this.exchangeRate);
        }
        
        if (fromCurrency === 'RON' && toCurrency === 'EUR') {
            return Math.round((amount / this.exchangeRate) * 100) / 100;
        }
        
        throw new Error(`Unsupported currency conversion: ${fromCurrency} to ${toCurrency}`);
    }

    /**
     * Update exchange rate
     * @param {number} newRate - New EUR to RON exchange rate
     */
    setExchangeRate(newRate) {
        this.exchangeRate = newRate;
    }

    /**
     * Get all cars sorted by price (ascending)
     * @param {string} tier - Pricing tier to sort by
     * @returns {Array} Sorted array of car objects
     */
    getCarsSortedByPrice(tier = 'tier1') {
        if (!this.data) {
            console.warn('Data not loaded. Call loadData() first.');
            return [];
        }
        return [...this.data.cars].sort((a, b) => a.pricing[tier] - b.pricing[tier]);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarPricingDataLoader;
}

// Global instance for browser usage
if (typeof window !== 'undefined') {
    window.CarPricingDataLoader = CarPricingDataLoader;
    window.carPricingLoader = new CarPricingDataLoader();
}

/**
 * Usage Examples:
 * 
 * // Load data and get car price
 * await carPricingLoader.loadData();
 * const price = carPricingLoader.getDisplayPrice('toyota-rav4-automat', 'RON');
 * 
 * // Search for cars
 * const bmwCars = carPricingLoader.searchCars('BMW');
 * 
 * // Get cars by transmission
 * const automaticCars = carPricingLoader.getCarsByTransmission('automat');
 * 
 * // Get cars in price range
 * const affordableCars = carPricingLoader.getCarsByPriceRange(30, 60);
 */