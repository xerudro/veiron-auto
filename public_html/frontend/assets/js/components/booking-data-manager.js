/**
 * Booking Data Manager
 * Gestionează salvarea și încărcarea datelor de rezervare în session storage cu fallback la localStorage
 *
 * Note: Requires logger.js to be loaded before this file
 */

// Simple logger if not defined globally
if (typeof logger === 'undefined') {
    window.logger = {
        log: (...args) => console.log('[BookingData]', ...args),
        error: (...args) => console.error('[BookingData]', ...args),
        warn: (...args) => console.warn('[BookingData]', ...args),
        info: (...args) => console.info('[BookingData]', ...args)
    };
}

class BookingDataManager {
    constructor() {
        this.storageKey = 'veironauto_booking_data';
        this.useSessionStorage = this.checkStorageAvailability();
        logger.log('BookingDataManager initialized. Using ' + (this.useSessionStorage ? 'sessionStorage' : 'localStorage'));
    }

    /**
     * Verifica disponibilitatea storage-ului
     */
    checkStorageAvailability() {
        try {
            sessionStorage.setItem('_test', 'test');
            sessionStorage.removeItem('_test');
            logger.log('✓ sessionStorage is available');
            return true;
        } catch (e) {
            logger.warn('⚠ sessionStorage not available, falling back to localStorage');
            return false;
        }
    }

    /**
     * Obține storage-ul activ
     */
    getStorage() {
        return this.useSessionStorage ? sessionStorage : localStorage;
    }

    /**
     * Salvează datele de rezervare în storage (sessionStorage cu fallback la localStorage)
     * @param {Object} bookingData - Datele de rezervare
     */
    saveBookingData(bookingData) {
        try {
            if (!bookingData || typeof bookingData !== 'object') {
                logger.error('Invalid booking data provided:', bookingData);
                return false;
            }

            const dataToSave = {
                ...bookingData,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            
            const storage = this.getStorage();
            const jsonString = JSON.stringify(dataToSave);
            storage.setItem(this.storageKey, jsonString);
            
            logger.log('✓ Booking data saved successfully (' + (this.useSessionStorage ? 'sessionStorage' : 'localStorage') + ')');
            logger.log('Saved data keys:', Object.keys(bookingData));
            return true;
        } catch (error) {
            logger.error('✗ Error saving booking data:', error);
            // Try to save to the other storage type
            try {
                const otherStorage = this.useSessionStorage ? localStorage : sessionStorage;
                const dataToSave = {
                    ...bookingData,
                    timestamp: new Date().toISOString(),
                    version: '1.0'
                };
                otherStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
                logger.log('✓ Fallback: Data saved to ' + (!this.useSessionStorage ? 'sessionStorage' : 'localStorage'));
                return true;
            } catch (fallbackError) {
                logger.error('✗ Fallback also failed:', fallbackError);
                return false;
            }
        }
    }

    /**
     * Încarcă datele de rezervare din storage
     * @returns {Object|null} Datele de rezervare sau null dacă nu există
     */
    loadBookingData() {
        try {
            const storage = this.getStorage();
            const data = storage.getItem(this.storageKey);
            
            if (data) {
                const bookingData = JSON.parse(data);
                logger.log('✓ Booking data loaded successfully from ' + (this.useSessionStorage ? 'sessionStorage' : 'localStorage'));
                logger.log('Loaded data keys:', Object.keys(bookingData));
                return bookingData;
            }
            
            // Try the other storage
            const otherStorage = this.useSessionStorage ? localStorage : sessionStorage;
            const otherData = otherStorage.getItem(this.storageKey);
            if (otherData) {
                const bookingData = JSON.parse(otherData);
                logger.log('✓ Booking data loaded from fallback storage');
                return bookingData;
            }
            
            logger.warn('⚠ No booking data found in either storage');
            return null;
        } catch (error) {
            logger.error('✗ Error loading booking data:', error);
            return null;
        }
    }

    /**
     * Șterge datele de rezervare din storage
     */
    clearBookingData() {
        try {
            const storage = this.getStorage();
            storage.removeItem(this.storageKey);
            
            // Also clear from other storage
            const otherStorage = this.useSessionStorage ? localStorage : sessionStorage;
            otherStorage.removeItem(this.storageKey);
            
            logger.log('✓ Booking data cleared successfully from all storage types');
            return true;
        } catch (error) {
            logger.error('✗ Error clearing booking data:', error);
            return false;
        }
    }

    /**
     * Verifică dacă există date de rezervare
     * @returns {boolean}
     */
    hasBookingData() {
        return sessionStorage.getItem(this.storageKey) !== null;
    }

    /**
     * Calculează perioada de închiriere în zile
     * @param {string} pickupDate - Data de ridicare
     * @param {string} dropoffDate - Data de returnare
     * @returns {number} Numărul de zile
     */
    calculateRentalDays(pickupDate, dropoffDate) {
        const pickup = new Date(pickupDate);
        const dropoff = new Date(dropoffDate);
        const diffTime = dropoff - pickup;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1; // Minim 1 zi
    }

    /**
     * Validează datele de rezervare
     * @param {Object} bookingData - Datele de rezervare
     * @returns {Object} Rezultatul validării
     */
    validateBookingData(bookingData) {
        const errors = [];

        // Validare locații
        if (!bookingData.pickup?.location) {
            errors.push('Locația de ridicare este obligatorie');
        }
        if (!bookingData.dropoff?.location) {
            errors.push('Locația de returnare este obligatorie');
        }

        // Validare date
        if (!bookingData.pickup?.date) {
            errors.push('Data de ridicare este obligatorie');
        }
        if (!bookingData.dropoff?.date) {
            errors.push('Data de returnare este obligatorie');
        }

        // Validare timpuri
        if (!bookingData.pickup?.time) {
            errors.push('Ora de ridicare este obligatorie');
        }
        if (!bookingData.dropoff?.time) {
            errors.push('Ora de returnare este obligatorie');
        }

        // Validare tip mașină
        if (!bookingData.carType) {
            errors.push('Tipul de mașină este obligatoriu');
        }

        // Validare vârstă șofer
        if (!bookingData.driverAge) {
            errors.push('Vârsta șoferului este obligatorie');
        } else if (parseInt(bookingData.driverAge) < 21) {
            errors.push('Vârsta minimă pentru șofer este 21 ani');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

// Export pentru utilizare globală
window.BookingDataManager = BookingDataManager; 