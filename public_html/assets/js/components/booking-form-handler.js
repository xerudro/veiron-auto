/**
 * Booking Form Handler
 * Gestionează colectarea și validarea datelor din formularul de rezervare
 *
 * Note: Requires logger.js to be loaded before this file
 */

class BookingFormHandler {
    constructor() {
        this.dataManager = new BookingDataManager();
        this.form = document.getElementById('booking-form');
        this.submitButton = document.getElementById('submit-booking');
        
        this.initializeForm();
    }

    /**
     * Inițializează formularul și adaugă event listeners
     */
    initializeForm() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        if (this.submitButton) {
            this.submitButton.addEventListener('click', (e) => this.handleSubmitClick(e));
        }

        // Adaugă validare în timp real pentru câmpuri
        this.addRealTimeValidation();
        
        logger.log('Booking form handler initialized');
    }

    /**
     * Gestionează submit-ul formularului
     * @param {Event} e - Event-ul de submit
     */
    handleFormSubmit(e) {
        e.preventDefault();
        this.processBookingData();
    }

    /**
     * Gestionează click-ul pe butonul de submit
     * @param {Event} e - Event-ul de click
     */
    handleSubmitClick(e) {
        e.preventDefault();
        this.processBookingData();
    }

    /**
     * Procesează datele din formular și le salvează
     */
    processBookingData() {
        const bookingData = this.collectFormData();
        const validation = this.dataManager.validateBookingData(bookingData);

        if (!validation.isValid) {
            this.showValidationErrors(validation.errors);
            return;
        }

        // Salvează datele
        const saved = this.dataManager.saveBookingData(bookingData);
        
        if (saved) {
            this.showSuccessMessage();
            this.redirectToPricingPage();
        } else {
            this.showErrorMessage('Eroare la salvarea datelor. Vă rugăm să încercați din nou.');
        }
    }

    /**
     * Colectează datele din formular
     * @returns {Object} Datele de rezervare
     */
    collectFormData() {
        const formData = {
            pickup: {
                location: this.getFieldValue('pickup-location'),
                date: this.getFieldValue('pickup-date'),
                time: this.getFieldValue('pickup-time')
            },
            dropoff: {
                location: this.getFieldValue('dropoff-location'),
                date: this.getFieldValue('dropoff-date'),
                time: this.getFieldValue('dropoff-time')
            },
            carType: this.getFieldValue('car-type'),
            driverAge: this.getFieldValue('driver-age')
        };

        // Calculează perioada de închiriere
        formData.rentalDays = this.dataManager.calculateRentalDays(
            formData.pickup.date, 
            formData.dropoff.date
        );

        return formData;
    }

    /**
     * Obține valoarea unui câmp din formular
     * @param {string} fieldId - ID-ul câmpului
     * @returns {string} Valoarea câmpului
     */
    getFieldValue(fieldId) {
        const field = document.getElementById(fieldId);
        return field ? field.value.trim() : '';
    }

    /**
     * Adaugă validare în timp real pentru câmpuri
     */
    addRealTimeValidation() {
        const requiredFields = [
            'pickup-location', 'dropoff-location',
            'pickup-date', 'dropoff-date',
            'pickup-time', 'dropoff-time',
            'car-type', 'driver-age'
        ];

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldId));
                field.addEventListener('input', () => this.clearFieldError(fieldId));
            }
        });
    }

    /**
     * Validează un câmp individual
     * @param {string} fieldId - ID-ul câmpului
     */
    validateField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Validări specifice pentru fiecare câmp
        switch (fieldId) {
            case 'pickup-location':
            case 'dropoff-location':
                isValid = value.length > 0;
                errorMessage = 'Această câmp este obligatoriu';
                break;
            
            case 'pickup-date':
            case 'dropoff-date':
                isValid = value.length > 0;
                errorMessage = 'Data este obligatorie';
                break;
            
            case 'pickup-time':
            case 'dropoff-time':
                isValid = value.length > 0;
                errorMessage = 'Ora este obligatorie';
                break;
            
            case 'car-type':
                isValid = value.length > 0;
                errorMessage = 'Tipul de mașină este obligatoriu';
                break;
            
            case 'driver-age':
                const age = parseInt(value);
                isValid = age >= 21 && age <= 80;
                errorMessage = 'Vârsta trebuie să fie între 21 și 80 ani';
                break;
        }

        if (!isValid) {
            this.showFieldError(fieldId, errorMessage);
        } else {
            this.clearFieldError(fieldId);
        }
    }

    /**
     * Afișează eroarea pentru un câmp
     * @param {string} fieldId - ID-ul câmpului
     * @param {string} message - Mesajul de eroare
     */
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        // Adaugă clasa de eroare
        field.classList.add('error');
        
        // Afișează mesajul de eroare
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    /**
     * Șterge eroarea pentru un câmp
     * @param {string} fieldId - ID-ul câmpului
     */
    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Afișează erorile de validare
     * @param {Array} errors - Lista de erori
     */
    showValidationErrors(errors) {
        // Afișează erorile într-un modal sau alert
        const errorMessage = errors.join('\n');
        alert('Vă rugăm să corectați următoarele erori:\n\n' + errorMessage);
    }

    /**
     * Afișează mesajul de succes
     */
    showSuccessMessage() {
        // Poți personaliza acest mesaj
        logger.log('Booking data saved successfully');
    }

    /**
     * Afișează mesajul de eroare
     * @param {string} message - Mesajul de eroare
     */
    showErrorMessage(message) {
        alert(message);
    }

    /**
     * Redirecționează către pagina parc-auto cu parametrii de filtrare
     */
    redirectToPricingPage() {
        // Colectează datele din formular pentru filtrare
        const formData = this.collectFormData();
        
        // Construiește URL-ul cu parametrii de filtrare
        const params = new URLSearchParams();
        
        // Adaugă parametrii de filtrare
        if (formData.carType) {
            params.append('category', formData.carType);
        }
        
        if (formData.pickup.location) {
            params.append('location', formData.pickup.location);
        }
        
        if (formData.pickup.date) {
            params.append('pickupDate', formData.pickup.date);
        }
        
        if (formData.dropoff.date) {
            params.append('dropoffDate', formData.dropoff.date);
        }
        
        if (formData.driverAge) {
            params.append('driverAge', formData.driverAge);
        }
        
        // Redirecționează către parc-auto cu parametrii
        const url = `parc-auto.html${params.toString() ? '?' + params.toString() : ''}`;
        window.location.href = url;
    }
}

// Export pentru utilizare globală
window.BookingFormHandler = BookingFormHandler; 