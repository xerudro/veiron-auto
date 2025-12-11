/**
 * Price Migration Script
 * Updates existing car pricing data with values from Excel
 * 
 * @author VEIRONAUTO Development Team
 * @version 1.0.0
 */

class PriceMigrationScript {
    constructor() {
        this.exchangeRate = 5.07; // EUR to RON
        this.excelData = null;
        this.currentBookingData = null;
        this.currentBookingDataEN = null;
    }

    /**
     * Load Excel pricing data
     * @returns {Promise<Object>} Excel data object
     */
    async loadExcelData() {
        try {
            const response = await fetch('/assets/json/car-pricing-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.excelData = await response.json();
            return this.excelData;
        } catch (error) {
            logger.error('Error loading Excel data:', error);
            throw error;
        }
    }

    /**
     * Load current booking data (Romanian version)
     * @returns {Promise<Object>} Current booking data
     */
    async loadCurrentBookingData() {
        try {
            const response = await fetch('/assets/js/booking.js');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsContent = await response.text();
            // Extract carData object from JavaScript file
            const carDataMatch = jsContent.match(/const carData = ({[\s\S]*?});/);
            if (carDataMatch) {
                this.currentBookingData = eval('(' + carDataMatch[1] + ')');
            }
            return this.currentBookingData;
        } catch (error) {
            logger.error('Error loading current booking data:', error);
            throw error;
        }
    }

    /**
     * Load current booking data (English version)
     * @returns {Promise<Object>} Current booking data EN
     */
    async loadCurrentBookingDataEN() {
        try {
            const response = await fetch('/assets/js/booking-en.js');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsContent = await response.text();
            // Extract carData object from JavaScript file
            const carDataMatch = jsContent.match(/const carData = ({[\s\S]*?});/);
            if (carDataMatch) {
                this.currentBookingDataEN = eval('(' + carDataMatch[1] + ')');
            }
            return this.currentBookingDataEN;
        } catch (error) {
            logger.error('Error loading current booking data EN:', error);
            throw error;
        }
    }

    /**
     * Map Excel car names to existing car IDs
     * @returns {Object} Mapping object
     */
    createCarMapping() {
        const mapping = {
            // Existing cars in system mapped to Excel data
            'audi-q3': 'audi-a3-automat', // Closest match
            'mazda-6': 'mazda-6-manual',
            'audi-a6': 'audi-a6-automat',
            'bmw-gt-530': 'bmw-seria-5-automat-nou', // Closest BMW 5 series
            'mercedes-e-class': 'mercedes-e-klasse',
            'renault-koleos': 'mitsubishi-outlander-automat', // Similar SUV
            'toyota-rav4': 'toyota-rav4-automat',
            'renault-traffic-8-1': 'renault-trafic-8-plus-1-automat',
            'vw-t-cross': 'vw-t-cross-automat',
            'skoda-scala': 'skoda-scala-automat'
        };
        return mapping;
    }

    /**
     * Get updated pricing for a car from Excel data
     * @param {string} excelCarId - Car ID in Excel data
     * @param {string} currency - Currency (EUR or RON)
     * @returns {Object|null} Updated pricing object
     */
    getUpdatedPricing(excelCarId, currency = 'EUR') {
        if (!this.excelData) {
            console.warn('Excel data not loaded');
            return null;
        }

        const excelCar = this.excelData.cars.find(car => car.id === excelCarId);
        if (!excelCar) {
            console.warn(`Car not found in Excel data: ${excelCarId}`);
            return null;
        }

        const pricing = {};
        Object.keys(excelCar.pricing).forEach(tier => {
            const priceEUR = excelCar.pricing[tier];
            pricing[tier] = currency === 'RON' ? Math.round(priceEUR * this.exchangeRate) : priceEUR;
        });

        return pricing;
    }

    /**
     * Generate migration report
     * @returns {Object} Migration report
     */
    generateMigrationReport() {
        if (!this.excelData || !this.currentBookingData) {
            throw new Error('Data not loaded. Call loadExcelData() and loadCurrentBookingData() first.');
        }

        const mapping = this.createCarMapping();
        const report = {
            timestamp: new Date().toISOString(),
            exchangeRate: this.exchangeRate,
            migrations: [],
            unmappedCars: [],
            newCarsInExcel: []
        };

        // Check existing cars for updates
        Object.keys(this.currentBookingData).forEach(currentCarId => {
            const excelCarId = mapping[currentCarId];
            if (excelCarId) {
                const currentCar = this.currentBookingData[currentCarId];
                const updatedPricingRON = this.getUpdatedPricing(excelCarId, 'RON');
                const updatedPricingEUR = this.getUpdatedPricing(excelCarId, 'EUR');

                if (updatedPricingRON) {
                    const migration = {
                        carId: currentCarId,
                        excelCarId: excelCarId,
                        currentPricing: {
                            tier1: currentCar.pricing?.tier1 || currentCar.dailyPrice,
                            tier2: currentCar.pricing?.tier2 || currentCar.weeklyPrice,
                            tier3: currentCar.pricing?.tier3 || currentCar.monthlyPrice,
                            tier4: currentCar.pricing?.tier4
                        },
                        newPricingRON: updatedPricingRON,
                        newPricingEUR: updatedPricingEUR,
                        displayPriceChange: {
                            old: currentCar.pricing?.tier1 || currentCar.dailyPrice,
                            new: updatedPricingRON.tier1,
                            difference: (updatedPricingRON.tier1 - (currentCar.pricing?.tier1 || currentCar.dailyPrice))
                        }
                    };
                    report.migrations.push(migration);
                }
            } else {
                report.unmappedCars.push(currentCarId);
            }
        });

        // Find new cars in Excel that don't exist in current system
        this.excelData.cars.forEach(excelCar => {
            const isInMapping = Object.values(mapping).includes(excelCar.id);
            if (!isInMapping) {
                report.newCarsInExcel.push({
                    id: excelCar.id,
                    name: excelCar.name,
                    pricing: excelCar.pricing,
                    transmission: excelCar.transmission
                });
            }
        });

        return report;
    }

    /**
     * Generate updated booking.js content
     * @returns {string} Updated JavaScript content
     */
    generateUpdatedBookingJS() {
        const report = this.generateMigrationReport();
        const mapping = this.createCarMapping();
        const updatedCarData = { ...this.currentBookingData };

        // Apply migrations
        report.migrations.forEach(migration => {
            const carId = migration.carId;
            if (updatedCarData[carId]) {
                // Update pricing with RON values
                updatedCarData[carId].pricing = {
                    tier1: migration.newPricingRON.tier1,
                    tier2: migration.newPricingRON.tier2,
                    tier3: migration.newPricingRON.tier3,
                    tier4: migration.newPricingRON.tier4
                };
                
                // Update legacy price fields if they exist
                if (updatedCarData[carId].dailyPrice !== undefined) {
                    updatedCarData[carId].dailyPrice = migration.newPricingRON.tier1;
                }
                if (updatedCarData[carId].weeklyPrice !== undefined) {
                    updatedCarData[carId].weeklyPrice = migration.newPricingRON.tier2;
                }
                if (updatedCarData[carId].monthlyPrice !== undefined) {
                    updatedCarData[carId].monthlyPrice = migration.newPricingRON.tier3;
                }
            }
        });

        // Generate JavaScript content
        const jsContent = `/**
 * Car Data Configuration - Updated from Excel
 * Generated on: ${new Date().toISOString()}
 * Exchange Rate: 1 EUR = ${this.exchangeRate} RON
 */

const carData = ${JSON.stringify(updatedCarData, null, 2)};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { carData };
}`;

        return jsContent;
    }

    /**
     * Generate updated booking-en.js content
     * @returns {string} Updated JavaScript content
     */
    generateUpdatedBookingENJS() {
        const report = this.generateMigrationReport();
        const mapping = this.createCarMapping();
        const updatedCarData = { ...this.currentBookingDataEN };

        // Apply migrations
        report.migrations.forEach(migration => {
            const carId = migration.carId;
            if (updatedCarData[carId]) {
                // Update pricing with EUR values
                updatedCarData[carId].pricing = {
                    tier1: migration.newPricingEUR.tier1,
                    tier2: migration.newPricingEUR.tier2,
                    tier3: migration.newPricingEUR.tier3,
                    tier4: migration.newPricingEUR.tier4
                };
                
                // Update legacy price fields if they exist
                if (updatedCarData[carId].dailyPrice !== undefined) {
                    updatedCarData[carId].dailyPrice = migration.newPricingEUR.tier1;
                }
                if (updatedCarData[carId].weeklyPrice !== undefined) {
                    updatedCarData[carId].weeklyPrice = migration.newPricingEUR.tier2;
                }
                if (updatedCarData[carId].monthlyPrice !== undefined) {
                    updatedCarData[carId].monthlyPrice = migration.newPricingEUR.tier3;
                }
            }
        });

        // Generate JavaScript content
        const jsContent = `/**
 * Car Data Configuration (English) - Updated from Excel
 * Generated on: ${new Date().toISOString()}
 * Prices in EUR
 */

const carData = ${JSON.stringify(updatedCarData, null, 2)};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { carData };
}`;

        return jsContent;
    }

    /**
     * Run complete migration process
     * @returns {Promise<Object>} Migration results
     */
    async runMigration() {
        try {
            logger.log('Starting price migration...');
            
            // Load all data
            await this.loadExcelData();
            await this.loadCurrentBookingData();
            await this.loadCurrentBookingDataEN();
            
            // Generate report
            const report = this.generateMigrationReport();
            
            // Generate updated files
            const updatedBookingJS = this.generateUpdatedBookingJS();
            const updatedBookingENJS = this.generateUpdatedBookingENJS();
            
            logger.log('Migration completed successfully');
            
            return {
                success: true,
                report: report,
                updatedFiles: {
                    'booking.js': updatedBookingJS,
                    'booking-en.js': updatedBookingENJS
                }
            };
        } catch (error) {
            logger.error('Migration failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PriceMigrationScript;
}

// Global instance for browser usage
if (typeof window !== 'undefined') {
    window.PriceMigrationScript = PriceMigrationScript;
    window.priceMigration = new PriceMigrationScript();
}

/**
 * Usage Example:
 * 
 * // Run migration
 * const migration = new PriceMigrationScript();
 * const result = await migration.runMigration();
 * 
 * if (result.success) {
 *     logger.log('Migration report:', result.report);
 *     logger.log('Updated booking.js:', result.updatedFiles['booking.js']);
 * }
 */