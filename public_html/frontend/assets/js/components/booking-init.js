/**
 * Booking System Initialization
 * Conectează toate componentele sistemului de rezervare
 */

// Ensure logger exists globally FIRST
if (typeof window.logger === 'undefined') {
    window.logger = {
        log: (...args) => console.log('[Booking]', ...args),
        error: (...args) => console.error('[Booking]', ...args),
        warn: (...args) => console.warn('[Booking]', ...args),
        info: (...args) => console.info('[Booking]', ...args)
    };
}

// Use global logger
const logger = window.logger;

class BookingSystem {
    constructor() {
        this.dataManager = null;
        this.formHandler = null;
        this.emailService = null;
        
        this.init();
    }

    /**
     * Inițializează sistemul de rezervare
     */
    init() {
        try {
            // Verifică dacă toate componentele sunt disponibile
            if (typeof BookingDataManager === 'undefined') {
                logger.error('BookingDataManager not found');
                return;
            }

            if (typeof BookingFormHandler === 'undefined') {
                logger.error('BookingFormHandler not found');
                return;
            }

            if (typeof EmailService === 'undefined') {
                logger.error('EmailService not found');
                return;
            }

            // Inițializează componentele
            this.dataManager = new BookingDataManager();
            // Pass dataManager to EmailService so they share the same instance
            this.emailService = new EmailService(this.dataManager);

            // Inițializează form handler doar dacă există formularul
            const bookingForm = document.getElementById('bookingForm');
            if (bookingForm) {
                this.formHandler = new BookingFormHandler();
                logger.log('Booking form handler initialized');
            }

            logger.log('Booking system initialized successfully');
            
            // Adaugă event listeners pentru debugging
            this.addDebugListeners();
            
        } catch (error) {
            logger.error('Error initializing booking system:', error);
        }
    }

    /**
     * Adaugă event listeners pentru debugging
     */
    addDebugListeners() {
        // Adaugă un buton de debug în consolă pentru a verifica datele salvate
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.debugBookingData = () => {
                const data = this.dataManager.loadBookingData();
                logger.log('Current booking data:', data);
                return data;
            };

            window.clearBookingData = () => {
                this.dataManager.clearBookingData();
                logger.log('Booking data cleared');
            };

            logger.log('Debug functions available:');
            logger.log('- debugBookingData() - to view current booking data');
            logger.log('- clearBookingData() - to clear booking data');
        }
    }

    /**
     * Verifică dacă există date de rezervare salvate
     * @returns {boolean} True dacă există date salvate
     */
    hasBookingData() {
        return this.dataManager && this.dataManager.hasBookingData();
    }

    /**
     * Obține datele de rezervare salvate
     * @returns {Object|null} Datele de rezervare sau null
     */
    getBookingData() {
        return this.dataManager ? this.dataManager.loadBookingData() : null;
    }

    /**
     * Trimite rezervarea finală
     * @param {Object} clientInfo - Informațiile clientului
     * @param {Object} pricingInfo - Informațiile despre prețuri
     * @returns {Promise<Object>} Rezultatul operației
     */
    async submitFinalBooking(clientInfo, pricingInfo) {
        if (!this.emailService) {
            throw new Error('Email service not initialized');
        }

        return await this.emailService.submitFinalBooking(clientInfo, pricingInfo);
    }
}

// Inițializează sistemul când DOM-ul este gata
document.addEventListener('DOMContentLoaded', () => {
    // Așteptă ca toate componentele să fie încărcate
    const checkComponents = () => {
        if (typeof BookingDataManager === 'undefined' ||
            typeof BookingFormHandler === 'undefined' ||
            typeof EmailService === 'undefined') {
            // Componente încă nu sunt încărcate, așteptă 100ms
            setTimeout(checkComponents, 100);
            return;
        }
        
        // Toate componentele sunt disponibile, inițializează sistemul
        window.bookingSystem = new BookingSystem();
    };
    
    checkComponents();
});

// Export pentru utilizare globală
window.BookingSystem = BookingSystem; 