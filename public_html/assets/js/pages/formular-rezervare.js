/**
 * Booking Form Functionality
 * Handles form validation, date restrictions, and submission
 */

class BookingForm {
    constructor() {
        this.form = document.getElementById('bookingForm');
        this.pickupDate = document.getElementById('pickupDate');
        this.dropoffDate = document.getElementById('dropoffDate');
        this.pickupTime = document.getElementById('pickupTime');
        this.dropoffTime = document.getElementById('dropoffTime');
        this.pickupLocation = document.getElementById('pickupLocation');
        this.dropoffLocation = document.getElementById('dropoffLocation');
        this.submitButton = this.form.querySelector('.btn-primary');
        
        this.init();
    }

    init() {
        this.setupDateRestrictions();
        this.setupEventListeners();
        this.setupTimeDefaults();
        this.setupLocationValidation();
    }

    setupDateRestrictions() {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        this.pickupDate.min = today;
        this.dropoffDate.min = today;

        // Set maximum date to 1 year from today
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        this.pickupDate.max = maxDate.toISOString().split('T')[0];
        this.dropoffDate.max = maxDate.toISOString().split('T')[0];
    }

    setupEventListeners() {
        // Pickup date change
        this.pickupDate.addEventListener('change', () => {
            this.updateDropoffDate();
            this.validateDates();
        });

        // Dropoff date change
        this.dropoffDate.addEventListener('change', () => {
            this.validateDates();
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Real-time validation
        this.form.addEventListener('input', (e) => {
            this.validateField(e.target);
        });

        // Location change validation
        this.pickupLocation.addEventListener('change', () => {
            this.validateLocations();
        });

        this.dropoffLocation.addEventListener('change', () => {
            this.validateLocations();
        });
    }

    setupTimeDefaults() {
        // Set default times
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Set pickup time to current time + 1 hour
        const pickupHour = (currentHour + 1) % 24;
        this.pickupTime.value = `${pickupHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        // Set dropoff time to pickup time + 24 hours
        const dropoffHour = (pickupHour + 24) % 24;
        this.dropoffTime.value = `${dropoffHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    }

    setupLocationValidation() {
        // Allow same pickup and dropoff location
        this.pickupLocation.addEventListener('change', () => {
            this.clearFieldError(this.dropoffLocation);
        });

        this.dropoffLocation.addEventListener('change', () => {
            this.clearFieldError(this.pickupLocation);
        });
    }

    updateDropoffDate() {
        if (this.pickupDate.value) {
            const pickupDate = new Date(this.pickupDate.value);
            const minDropoffDate = new Date(pickupDate);
            minDropoffDate.setDate(pickupDate.getDate() + 1);
            
            this.dropoffDate.min = minDropoffDate.toISOString().split('T')[0];
            
            // If current dropoff date is before new minimum, update it
            if (this.dropoffDate.value && new Date(this.dropoffDate.value) < minDropoffDate) {
                this.dropoffDate.value = minDropoffDate.toISOString().split('T')[0];
            }
        }
    }

    validateDates() {
        if (this.pickupDate.value && this.dropoffDate.value) {
            const pickup = new Date(this.pickupDate.value);
            const dropoff = new Date(this.dropoffDate.value);
            
            if (dropoff <= pickup) {
                this.showFieldError(this.dropoffDate, 'Data returnării trebuie să fie după data ridicării');
                return false;
            } else {
                this.clearFieldError(this.dropoffDate);
            }

            // Check if rental period is reasonable (max 30 days)
            const daysDiff = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
            if (daysDiff > 30) {
                this.showFieldError(this.dropoffDate, 'Perioada de închiriere nu poate depăși 30 de zile');
                return false;
            } else {
                this.clearFieldError(this.dropoffDate);
            }
        }
        return true;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Acest câmp este obligatoriu');
            return false;
        }
        
        // Specific field validations
        switch (fieldName) {
            case 'pickupDate':
            case 'dropoffDate':
                if (value && new Date(value) < new Date()) {
                    this.showFieldError(field, 'Data nu poate fi în trecut');
                    return false;
                }
                break;
                
            case 'pickupTime':
            case 'dropoffTime':
                if (value) {
                    const [hours, minutes] = value.split(':').map(Number);
                    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                        this.showFieldError(field, 'Ora introdusă nu este validă');
                        return false;
                    }
                }
                break;
        }
        
        return true;
    }

    validateLocations() {
        if (this.pickupLocation.value && this.dropoffLocation.value) {
            // Allow same pickup and dropoff location
            this.clearFieldError(this.pickupLocation);
            this.clearFieldError(this.dropoffLocation);
        }
        return true;
    }

    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!this.validateDates()) {
            isValid = false;
        }
        
        if (!this.validateLocations()) {
            isValid = false;
        }
        
        return isValid;
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showSuccessMessage(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    showErrorMessage(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    async handleFormSubmission() {
        if (!this.validateForm()) {
            return;
        }
        
        // Show loading state
        this.submitButton.classList.add('loading');
        this.submitButton.disabled = true;
        
        try {
            // Collect form data
            const formData = new FormData(this.form);
            const bookingData = Object.fromEntries(formData.entries());
            
            // Salvează datele în session storage
            if (window.BookingDataManager) {
                const dataManager = new BookingDataManager();
                
                // Transformă datele în formatul așteptat
                const formattedData = {
                    pickup: {
                        location: bookingData.pickupLocation,
                        date: bookingData.pickupDate,
                        time: bookingData.pickupTime
                    },
                    dropoff: {
                        location: bookingData.dropoffLocation,
                        date: bookingData.dropoffDate,
                        time: bookingData.dropoffTime
                    },
                    carType: bookingData.carType,
                    driverAge: bookingData.driverAge
                };
                
                const saved = dataManager.saveBookingData(formattedData);
                
                if (saved) {
                    this.showSuccessMessage('Datele au fost salvate cu succes! Se redirecționează către pagina de prețuri...');
                    
                    // Redirecționează către pagina de prețuri după 2 secunde
                    setTimeout(() => {
                        window.location.href = 'rezervare-preturi.html';
                    }, 2000);
                } else {
                    this.showErrorMessage('Eroare la salvarea datelor. Vă rugăm să încercați din nou.');
                }
            } else {
                // Fallback la metoda veche dacă BookingDataManager nu este disponibil
                await this.simulateApiCall(bookingData);
                this.showSuccessMessage('Rezervarea a fost trimisă cu succes! Vei primi un email de confirmare în curând.');
                this.form.reset();
                this.setupTimeDefaults();
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showErrorMessage('A apărut o eroare. Te rugăm să încerci din nou.');
        } finally {
            // Remove loading state
            this.submitButton.classList.remove('loading');
            this.submitButton.disabled = false;
        }
    }

    async simulateApiCall(data) {
        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Booking data:', data);
                resolve({ success: true });
            }, 2000);
        });
    }
}

// Initialize booking form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bookingForm')) {
        new BookingForm();
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookingForm;
} 