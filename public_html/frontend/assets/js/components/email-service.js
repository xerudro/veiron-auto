/**
 * Email Service
 * Gestionează trimiterea emailurilor de confirmare către client și proprietar
 */

class EmailService {
    constructor() {
        this.apiEndpoint = '/frontend/api/send-booking.php';
        this.dataManager = new BookingDataManager();
        this.language = this.detectLanguage();
    }

    /**
     * Detectează limba curentă a paginii
     * @returns {string} 'ro' sau 'en'
     */
    detectLanguage() {
        // Verifică dacă URL-ul conține '-en'
        const url = window.location.pathname;
        if (url.includes('-en.html') || url.includes('/en/')) {
            return 'en';
        }

        // Verifică atributul lang din HTML
        const htmlLang = document.documentElement.lang;
        if (htmlLang && htmlLang.toLowerCase().startsWith('en')) {
            return 'en';
        }

        // Default: română
        return 'ro';
    }

    /**
     * Trimite rezervarea finală și emailurile de confirmare
     * @param {Object} clientInfo - Informațiile clientului
     * @param {Object} pricingInfo - Informațiile despre prețuri
     * @returns {Promise<Object>} Rezultatul operației
     */
    async submitFinalBooking(clientInfo, pricingInfo) {
        try {
            // Încarcă datele de rezervare
            const bookingData = this.dataManager.loadBookingData();
            if (!bookingData) {
                throw new Error('Nu există date de rezervare');
            }

            // Construiește obiectul complet pentru trimitere
            const completeBookingData = {
                clientInfo: clientInfo,
                booking: bookingData,
                pricing: pricingInfo,
                timestamp: new Date().toISOString()
            };

            // Trimite datele către server
            const response = await this.sendBookingToServer(completeBookingData);

            if (response.success) {
                // Șterge datele din session storage după trimiterea cu succes
                this.dataManager.clearBookingData();
                return {
                    success: true,
                    message: 'Rezervarea a fost trimisă cu succes! Veți primi un email de confirmare.',
                    bookingId: response.bookingId
                };
            } else {
                throw new Error(response.message || 'Eroare la trimiterea rezervării');
            }

        } catch (error) {
            logger.error('Error submitting final booking:', error);
            return {
                success: false,
                message: error.message || 'Eroare la trimiterea rezervării. Vă rugăm să încercați din nou.'
            };
        }
    }

    /**
     * Trimite datele către server
     * @param {Object} bookingData - Datele complete de rezervare
     * @returns {Promise<Object>} Răspunsul de la server
     */
    async sendBookingToServer(bookingData) {
        try {
            // Transform datele în formatul așteptat de PHP API
            const flatData = this.transformBookingDataForAPI(bookingData);

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(flatData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;

        } catch (error) {
            logger.error('Error sending booking to server:', error);
            throw error;
        }
    }

    /**
     * Transformă datele de booking în formatul așteptat de PHP API
     * @param {Object} bookingData - Datele structurate de rezervare
     * @returns {Object} Datele în format flat pentru API
     */
    transformBookingDataForAPI(bookingData) {
        const { clientInfo, booking, pricing } = bookingData;

        // Generează număr de rezervare unic
        const bookingNumber = 'BK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        return {
            booking_number: bookingNumber,
            client_name: clientInfo.name || '',
            client_email: clientInfo.email || '',
            client_phone: clientInfo.phone || '',
            car_name: booking.carType || booking.carName || '',
            pickup_location: booking.pickup?.location || '',
            pickup_date: booking.pickup?.date || '',
            pickup_time: booking.pickup?.time || '',
            dropoff_location: booking.dropoff?.location || '',
            dropoff_date: booking.dropoff?.date || '',
            dropoff_time: booking.dropoff?.time || '',
            duration_days: booking.rentalDays || 0,
            total_cost_eur: pricing.totalPriceEUR || (pricing.totalPrice / 5).toFixed(2), // Convert RON to EUR
            total_cost_ron: pricing.totalPrice || 0,
            status: 'Pending',
            payment_status: 'Pending',
            language: this.language // Add detected language
        };
    }

    /**
     * Generează conținutul emailului pentru client
     * @param {Object} bookingData - Datele de rezervare
     * @returns {string} Conținutul emailului
     */
    generateClientEmailContent(bookingData) {
        const { clientInfo, booking, pricing } = bookingData;
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ff4500;">Confirmare Rezervare VEIRONAUTO</h2>
                
                <p>Stimate ${clientInfo.name},</p>
                
                <p>Vă mulțumim pentru rezervarea făcută la VEIRONAUTO!</p>
                
                <h3>Detaliile rezervării:</h3>
                <ul>
                    <li><strong>Ridicare:</strong> ${booking.pickup.location} - ${booking.pickup.date} la ${booking.pickup.time}</li>
                    <li><strong>Returnare:</strong> ${booking.dropoff.location} - ${booking.dropoff.date} la ${booking.dropoff.time}</li>
                    <li><strong>Tip mașină:</strong> ${booking.carType}</li>
                    <li><strong>Perioada:</strong> ${booking.rentalDays} zile</li>
                </ul>
                
                <h3>Detaliile de cost:</h3>
                <ul>
                    <li><strong>Preț de bază:</strong> ${pricing.basePrice} RON</li>
                    <li><strong>Asigurare:</strong> ${pricing.insurance.type} - ${pricing.insurance.price} RON</li>
                    <li><strong>Depozit de garanție:</strong> ${pricing.deposit} RON</li>
                    <li><strong>Total:</strong> ${pricing.totalPrice} RON</li>
                </ul>
                
                <p><strong>Numărul de rezervare:</strong> ${bookingData.bookingId}</p>
                
                <p>Pentru orice întrebări, ne puteți contacta la:</p>
                <ul>
                    <li>Email: contact@veironauto.ro</li>
                    <li>Telefon: +40 XXX XXX XXX</li>
                </ul>
                
                <p>Cu stimă,<br>Echipa VEIRONAUTO</p>
            </div>
        `;
    }

    /**
     * Generează conținutul emailului pentru proprietar
     * @param {Object} bookingData - Datele de rezervare
     * @returns {string} Conținutul emailului
     */
    generateOwnerEmailContent(bookingData) {
        const { clientInfo, booking, pricing } = bookingData;
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ff4500;">Nouă Rezervare - VEIRONAUTO</h2>
                
                <p>O nouă rezervare a fost făcută pe platforma VEIRONAUTO.</p>
                
                <h3>Informații client:</h3>
                <ul>
                    <li><strong>Nume:</strong> ${clientInfo.name}</li>
                    <li><strong>Email:</strong> ${clientInfo.email}</li>
                    <li><strong>Telefon:</strong> ${clientInfo.phone}</li>
                </ul>
                
                <h3>Detaliile rezervării:</h3>
                <ul>
                    <li><strong>Ridicare:</strong> ${booking.pickup.location} - ${booking.pickup.date} la ${booking.pickup.time}</li>
                    <li><strong>Returnare:</strong> ${booking.dropoff.location} - ${booking.dropoff.date} la ${booking.dropoff.time}</li>
                    <li><strong>Tip mașină:</strong> ${booking.carType}</li>
                    <li><strong>Perioada:</strong> ${booking.rentalDays} zile</li>
                    <li><strong>Vârsta șoferului:</strong> ${booking.driverAge} ani</li>
                </ul>
                
                <h3>Detaliile financiare:</h3>
                <ul>
                    <li><strong>Preț de bază:</strong> ${pricing.basePrice} RON</li>
                    <li><strong>Asigurare:</strong> ${pricing.insurance.type} - ${pricing.insurance.price} RON</li>
                    <li><strong>Depozit de garanție:</strong> ${pricing.deposit} RON</li>
                    <li><strong>Total:</strong> ${pricing.totalPrice} RON</li>
                </ul>
                
                <p><strong>Numărul de rezervare:</strong> ${bookingData.bookingId}</p>
                <p><strong>Data rezervării:</strong> ${new Date(bookingData.timestamp).toLocaleString('ro-RO')}</p>
                
                <p>Vă rugăm să contactați clientul pentru confirmarea finală și aranjarea detaliilor de ridicare.</p>
            </div>
        `;
    }

    /**
     * Simulează trimiterea emailurilor (pentru dezvoltare)
     * @param {Object} bookingData - Datele de rezervare
     * @returns {Promise<Object>} Rezultatul simulării
     */
    async simulateEmailSending(bookingData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                logger.log('Simulating email sending...');
                logger.log('Client email content:', this.generateClientEmailContent(bookingData));
                logger.log('Owner email content:', this.generateOwnerEmailContent(bookingData));
                
                resolve({
                    success: true,
                    message: 'Emailurile au fost trimise cu succes (simulare)',
                    bookingId: 'BK' + Date.now()
                });
            }, 2000); // Simulează o întârziere de 2 secunde
        });
    }
}

// Export pentru utilizare globală
window.EmailService = EmailService; 