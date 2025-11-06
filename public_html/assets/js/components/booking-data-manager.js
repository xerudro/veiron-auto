/**
 * Booking Data Manager
 * Gestionează salvarea și încărcarea datelor de rezervare în session storage
 */

class BookingDataManager {
    constructor() {
        this.storageKey = 'veironauto_booking_data';
    }

    /**
     * Salvează datele de rezervare în session storage
     * @param {Object} bookingData - Datele de rezervare
     */
    saveBookingData(bookingData) {
        try {
            const dataToSave = {
                ...bookingData,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            
            sessionStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
            console.log('Booking data saved successfully:', dataToSave);
            return true;
        } catch (error) {
            console.error('Error saving booking data:', error);
            return false;
        }
    }

    /**
     * Încarcă datele de rezervare din session storage
     * @returns {Object|null} Datele de rezervare sau null dacă nu există
     */
    loadBookingData() {
        try {
            const data = sessionStorage.getItem(this.storageKey);
            if (data) {
                const bookingData = JSON.parse(data);
                console.log('Booking data loaded successfully:', bookingData);
                return bookingData;
            }
            return null;
        } catch (error) {
            console.error('Error loading booking data:', error);
            return null;
        }
    }

    /**
     * Șterge datele de rezervare din session storage
     */
    clearBookingData() {
        try {
            sessionStorage.removeItem(this.storageKey);
            console.log('Booking data cleared successfully');
            return true;
        } catch (error) {
            console.error('Error clearing booking data:', error);
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