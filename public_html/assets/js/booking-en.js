// Booking system for VEIRONAUTO - English version

// Car data with pricing tiers
const carData = [
    {
        id: 1,
        name: "Audi Q3",
        category: "suv",
        transmission: "automatic",
        passengers: 5,
        luggage: 4,
        doors: 5,
        fuel: "Petrol",
        image: "assets/images/cars/Audi-Q3.jpg",
        pricing: {
            tier1: { daily: 80, weekly: 480, monthly: 1600 },
            tier2: { daily: 75, weekly: 450, monthly: 1500 },
            tier3: { daily: 70, weekly: 420, monthly: 1400 },
            tier4: { daily: 65, weekly: 390, monthly: 1300 }
        },
        warranty: 1500,
        highlighted: true
    },
    {
        id: 2,
        name: "Mazda 6",
        category: "sedan",
        transmission: "manual",
        passengers: 5,
        luggage: 3,
        doors: 4,
        fuel: "Petrol",
        image: "assets/images/cars/Mazda_6.jpg",
        pricing: {
            tier1: { daily: 40, weekly: 240, monthly: 800 },
            tier2: { daily: 38, weekly: 228, monthly: 760 },
            tier3: { daily: 36, weekly: 216, monthly: 720 },
            tier4: { daily: 34, weekly: 204, monthly: 680 }
        },
        warranty: 1000,
        highlighted: false
    },
    {
        id: 3,
        name: "Audi A6",
        category: "premium",
        transmission: "automatic",
        passengers: 5,
        luggage: 3,
        doors: 4,
        fuel: "Diesel",
        image: "assets/images/cars/audi-a6.jpg",
        pricing: {
            tier1: { daily: 70, weekly: 420, monthly: 1400 },
            tier2: { daily: 67, weekly: 402, monthly: 1340 },
            tier3: { daily: 63, weekly: 378, monthly: 1260 },
            tier4: { daily: 60, weekly: 360, monthly: 1200 }
        },
        warranty: 2000,
        highlighted: true
    },
    {
        id: 4,
        name: "BMW GT 530",
        category: "suv",
        transmission: "automatic",
        passengers: 5,
        luggage: 4,
        doors: 4,
        fuel: "Diesel",
        image: "assets/images/cars/bmw_gt_530.jpg",
        pricing: {
            tier1: { daily: 80, weekly: 480, monthly: 1600 },
            tier2: { daily: 76, weekly: 456, monthly: 1520 },
            tier3: { daily: 72, weekly: 432, monthly: 1440 },
            tier4: { daily: 68, weekly: 408, monthly: 1360 }
        },
        warranty: 2500,
        highlighted: false
    },
    {
        id: 5,
        name: "Mercedes E-Class",
        category: "premium",
        transmission: "automatic",
        passengers: 5,
        luggage: 3,
        doors: 4,
        fuel: "Diesel",
        image: "assets/images/cars/mercedes-e-class.jpg",
        pricing: {
            tier1: { daily: 65, weekly: 390, monthly: 1300 },
            tier2: { daily: 62, weekly: 372, monthly: 1240 },
            tier3: { daily: 60, weekly: 360, monthly: 1200 },
            tier4: { daily: 57, weekly: 342, monthly: 1140 }
        },
        warranty: 2000,
        highlighted: true
    },
    {
        id: 6,
        name: "Renault Koleos",
        category: "suv",
        transmission: "automatic",
        passengers: 5,
        luggage: 4,
        doors: 5,
        fuel: "Diesel",
        image: "assets/images/cars/renault_koleos.jpg",
        pricing: {
            tier1: { daily: 70, weekly: 420, monthly: 1400 },
            tier2: { daily: 65, weekly: 390, monthly: 1300 },
            tier3: { daily: 60, weekly: 360, monthly: 1200 },
            tier4: { daily: 55, weekly: 330, monthly: 1100 }
        },
        warranty: 1500,
        highlighted: false
    },
    {
        id: 7,
        name: "Toyota RAV4",
        category: "suv",
        transmission: "automatic",
        passengers: 5,
        luggage: 4,
        doors: 5,
        fuel: "Hybrid",
        image: "assets/images/cars/toyota-rav4.jpg",
        pricing: {
            tier1: { daily: 100, weekly: 600, monthly: 2000 },
            tier2: { daily: 95, weekly: 570, monthly: 1900 },
            tier3: { daily: 90, weekly: 540, monthly: 1800 },
            tier4: { daily: 85, weekly: 510, monthly: 1700 }
        },
        warranty: 1500,
        highlighted: true
    },
    {
        id: 8,
        name: "Renault Traffic 8+1",
        category: "van",
        transmission: "automatic",
        passengers: 9,
        luggage: 6,
        doors: 4,
        fuel: "Diesel",
        image: "assets/images/cars/renault_traffic_8+1_van.jpg",
        pricing: {
            tier1: { daily: 90, weekly: 540, monthly: 1800 },
            tier2: { daily: 85, weekly: 510, monthly: 1700 },
            tier3: { daily: 80, weekly: 480, monthly: 1600 },
            tier4: { daily: 75, weekly: 450, monthly: 1500 }
        },
        warranty: 2000,
        highlighted: false
    },
    {
        id: 9,
        name: "VW T-Cross",
        category: "suv",
        transmission: "automatic",
        passengers: 5,
        luggage: 3,
        doors: 5,
        fuel: "Petrol",
        image: "assets/images/cars/vw-t-cross.jpg",
        pricing: {
            tier1: { daily: 60, weekly: 360, monthly: 1200 },
            tier2: { daily: 55, weekly: 330, monthly: 1100 },
            tier3: { daily: 50, weekly: 300, monthly: 1000 },
            tier4: { daily: 45, weekly: 270, monthly: 900 }
        },
        warranty: 1200,
        highlighted: false
    },
    {
        id: 10,
        name: "Skoda Scala",
        category: "compact",
        transmission: "automatic",
        passengers: 5,
        luggage: 3,
        doors: 5,
        fuel: "Petrol",
        image: "assets/images/cars/skoda-scala.jpg",
        pricing: {
            tier1: { daily: 50, weekly: 300, monthly: 1000 },
            tier2: { daily: 45, weekly: 270, monthly: 900 },
            tier3: { daily: 40, weekly: 240, monthly: 800 },
            tier4: { daily: 35, weekly: 210, monthly: 700 }
        },
        warranty: 1000,
        highlighted: false
    }
];

// Additional services data
const additionalServices = {
    insurance: {
        premium: { daily: 13, name: "Premium", deposit: 100 },
        full: { daily: 20, name: "Full", deposit: 0 }
    },
    equipment: {
        gps: { daily: 5, name: "GPS" },
        "baby-seat": { daily: 2, name: "Baby Seat" },
        "child-seat": { daily: 2, name: "Child Seat" },
        "additional-driver": { daily: 10, name: "Additional Driver" }
    }
};

// Booking state
let bookingState = {
    currentStep: 1,
    visitDetails: {},
    selectedCar: null,
    selectedInsurance: null,
    selectedEquipment: [],
    personalDetails: {},
    totalDays: 0,
    pricingTier: 'tier1'
};

// DOM elements
let elements = {};

// QUICK BOOKING SUPPORT
let quickBookingMode = false
let quickCarId = null

function getUrlParams() {
  const params = {}
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    params[key] = decodeURIComponent(value)
  })
  return params
}

(function handleQuickBookingInit() {
  const params = getUrlParams()
  if (params.quick === '1' && params.carId) {
    quickBookingMode = true
    quickCarId = params.carId
    // Preselectează mașina în sumar
    selectCarByQuickBooking(quickCarId)
    // Sari la pasul 1 (alegere dată/locație)
    bookingState.currentStep = 1
    // Eliminat: updateStepDisplay() aici
  }
})()

function selectCarByQuickBooking(carId) {
  // Găsește mașina după carId (nume fără spații/simboluri, lowercase)
  const normalizedId = carId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const car = carData.find(c => c.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === normalizedId);
  if (car) {
    bookingState.selectedCar = car;
    updateReservationBar();
    renderCarGrid();
  }
}

// Initialize booking system
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeDateInputs();
    renderCarGrid();
    setupEventListeners();
    updateReservationBar();
    
    // Initial validation for step 1
    validateStep1AndUpdateButton();
    
    // Initialize footer overlap prevention
    initFooterOverlapPrevention();
});

// Initialize DOM elements
function initializeElements() {
    elements = {
        steps: document.querySelectorAll('.progress-step'),
        bookingSteps: document.querySelectorAll('.booking-step'),
        carGrid: document.getElementById('car-grid'),
        reservationBar: document.getElementById('reservation-bar'),
        reservationDetails: document.getElementById('reservation-details'),
        selectedCarInfo: document.getElementById('selected-car-info'),
        reservationDates: document.getElementById('reservation-dates'),
        reservationTotal: document.getElementById('reservation-total'),
        bookingBreakdown: document.getElementById('booking-breakdown'),
        finalSummary: document.getElementById('final-summary'),
        expandBtn: document.getElementById('expand-btn'),
        nextStepBtns: document.querySelectorAll('.next-step-btn'),
        expandedNextBtn: document.querySelector('.expanded-next-btn'),
        pickupDate: document.getElementById('pickup-date'),
        dropoffDate: document.getElementById('dropoff-date')
    };
}

// Initialize date inputs with minimum date as today
function initializeDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    if (elements.pickupDate) {
        elements.pickupDate.min = today;
        elements.pickupDate.addEventListener('change', calculateDays);
    }
    if (elements.dropoffDate) {
        elements.dropoffDate.min = today;
        elements.dropoffDate.addEventListener('change', calculateDays);
    }
    
    // Add event listeners for form fields in step 1
    const pickupLocationSelect = document.getElementById('pickup-location');
    const dropoffLocationSelect = document.getElementById('dropoff-location');
    const pickupTimeSelect = document.getElementById('pickup-time');
    const dropoffTimeSelect = document.getElementById('dropoff-time');
    
    if (pickupLocationSelect) {
        pickupLocationSelect.addEventListener('change', validateStep1AndUpdateButton);
    }
    if (dropoffLocationSelect) {
        dropoffLocationSelect.addEventListener('change', validateStep1AndUpdateButton);
    }
    if (pickupTimeSelect) {
        pickupTimeSelect.addEventListener('change', validateStep1AndUpdateButton);
    }
    if (dropoffTimeSelect) {
        dropoffTimeSelect.addEventListener('change', validateStep1AndUpdateButton);
    }
}

// Calculate rental days and update pricing tier
function calculateDays() {
    const pickupDate = elements.pickupDate?.value;
    const dropoffDate = elements.dropoffDate?.value;
    
    if (pickupDate && dropoffDate) {
        const pickup = new Date(pickupDate);
        const dropoff = new Date(dropoffDate);
        const diffTime = Math.abs(dropoff - pickup);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        bookingState.totalDays = diffDays;
        
        // Determine pricing tier based on rental duration using getPriceCategory
        bookingState.pricingTier = getPriceCategory(diffDays);
        
        // Store visit details
        bookingState.visitDetails = {
            pickupLocation: document.getElementById('pickup-location')?.value,
            dropoffLocation: document.getElementById('dropoff-location')?.value,
            pickupDate: pickupDate,
            pickupTime: document.getElementById('pickup-time')?.value,
            dropoffDate: dropoffDate,
            dropoffTime: document.getElementById('dropoff-time')?.value
        };
        
        updateReservationBar();
        renderCarGrid(); // Re-render to update prices
        validateStep1AndUpdateButton();
    }
}

// Validate step 1 and update button state
function validateStep1AndUpdateButton() {
    const pickupLocation = document.getElementById('pickup-location')?.value;
    const dropoffLocation = document.getElementById('dropoff-location')?.value;
    const pickupDate = document.getElementById('pickup-date')?.value;
    const dropoffDate = document.getElementById('dropoff-date')?.value;
    const pickupTime = document.getElementById('pickup-time')?.value;
    const dropoffTime = document.getElementById('dropoff-time')?.value;
    
    const isStep1Valid = pickupLocation && dropoffLocation && pickupDate && dropoffDate && pickupTime && dropoffTime;

    // Enable/disable next step buttons based on current step
    if (elements.nextStepBtns) {
        elements.nextStepBtns.forEach(btn => {
            if (bookingState.currentStep === 1) {
                // Dacă e quick booking și toate câmpurile sunt completate, activează butonul
                if (quickBookingMode && isStep1Valid) {
                    btn.disabled = false;
                } else {
                    btn.disabled = !isStep1Valid;
                }
            } else if (bookingState.currentStep === 2) {
                btn.disabled = !bookingState.selectedCar;
            } else {
                btn.disabled = false;
            }
        });
    }
    
    if (elements.expandedNextBtn) {
        if (bookingState.currentStep === 1) {
            if (quickBookingMode && isStep1Valid) {
                elements.expandedNextBtn.disabled = false;
            } else {
                elements.expandedNextBtn.disabled = !isStep1Valid;
            }
        } else if (bookingState.currentStep === 2) {
            elements.expandedNextBtn.disabled = !bookingState.selectedCar;
        } else {
            elements.expandedNextBtn.disabled = false;
        }
    }
}

// Render car grid
function renderCarGrid() {
    if (!elements.carGrid) return;
    
    const filteredCars = getFilteredCars();
    
    elements.carGrid.innerHTML = filteredCars.map(car => {
        const pricing = car.pricing[bookingState.pricingTier];
        const isSelected = bookingState.selectedCar?.id === car.id;
        
        return `
            <div class="car-card ${isSelected ? 'selected' : ''}" data-car-id="${car.id}">
                <div class="car-image-container">
                    <img class="car-image" src="${car.image}" alt="${car.name}" onerror="this.src='assets/images/cars/placeholder.svg'; this.onerror=null;">
                </div>
                <div class="car-info">
                    <h3 class="car-name">${car.name}</h3>
                    <div class="car-similar-text">or Similar</div>
                    <div class="car-details">
                        <div class="car-detail">
                            <i class="fas fa-users"></i>
                            <span>${car.passengers} passengers</span>
                        </div>
                        <div class="car-detail">
                            <i class="fas fa-suitcase"></i>
                            <span>${car.luggage} luggage</span>
                        </div>
                        <div class="car-detail">
                            <i class="fas fa-door-open"></i>
                            <span>${car.doors} doors</span>
                        </div>
                        <div class="car-detail">
                            <i class="fas fa-cog"></i>
                            <span>${car.transmission === 'automatic' ? 'Automatic' : 'Manual'}</span>
                        </div>
                        <div class="car-detail">
                            <i class="fas fa-gas-pump"></i>
                            <span>${car.fuel}</span>
                        </div>
                    </div>
                    <div class="car-pricing">
                        <div class="car-price">
                            <span class="price-amount">€${pricing.daily}</span>
                            <span class="price-period">/day</span>
                        </div>
                        <div class="warranty-info">
                            <i class="fas fa-road"></i>
                            <span>300 Km included</span>
                        </div>
                    </div>
                    <button class="btn btn-primary car-select-btn" onclick="selectCar(${car.id})">
                        ${isSelected ? 'Selected' : 'Select'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Get filtered cars based on current filters
function getFilteredCars() {
    const transmissionFilters = Array.from(document.querySelectorAll('input[value="automatic"], input[value="manual"]'))
        .filter(input => input.checked)
        .map(input => input.value);
    
    const classFilters = Array.from(document.querySelectorAll('input[value="economy"], input[value="compact"], input[value="sedan"], input[value="suv"], input[value="premium"], input[value="van"]'))
        .filter(input => input.checked)
        .map(input => input.value);
    
    return carData.filter(car => {
        const transmissionMatch = transmissionFilters.length === 0 || transmissionFilters.includes(car.transmission);
        const classMatch = classFilters.length === 0 || classFilters.includes(car.category);
        return transmissionMatch && classMatch;
    });
}

// Select a car
function selectCar(carId) {
    const car = carData.find(c => c.id === carId);
    if (car) {
        bookingState.selectedCar = car;
        renderCarGrid();
        updateReservationBar();
        
        // Enable next step buttons based on current step
        validateStep1AndUpdateButton();
    }
}

// Update reservation bar
function updateReservationBar() {
    if (!elements.selectedCarInfo || !elements.reservationDates || !elements.reservationTotal) return;
    
    if (bookingState.selectedCar) {
        const car = bookingState.selectedCar;
        const pricing = car.pricing[bookingState.pricingTier];
        
        elements.selectedCarInfo.innerHTML = `
            <div class="selected-car">
                <img class="selected-car-image" src="${car.image}" alt="${car.name}" onerror="this.src='assets/images/cars/placeholder.jpg'">
                <div class="selected-car-info">
                    <h4 class="selected-car-name">${car.name}</h4>
                </div>
            </div>
        `;
        
        if (bookingState.visitDetails.pickupDate && bookingState.visitDetails.dropoffDate) {
            elements.reservationDates.innerHTML = `
                <div class="reservation-period">
                    <div class="period-dates">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${formatDate(bookingState.visitDetails.pickupDate)} - ${formatDate(bookingState.visitDetails.dropoffDate)}</span>
                    </div>
                    <div class="duration">${bookingState.totalDays} days</div>
                    ${bookingState.visitDetails.pickupTime && bookingState.visitDetails.dropoffTime ? `
                    <div class="period-times">
                        <span>Pickup time: ${bookingState.visitDetails.pickupTime}</span>
                        <span>Drop-off time: ${bookingState.visitDetails.dropoffTime}</span>
                    </div>
                    ` : ''}
                </div>
            `;
        }
        
        const total = calculateTotal();
        elements.reservationTotal.innerHTML = `
            <div class="total-price">
                <span class="total-label">Total:</span>
                <span class="total-amount">€${total}</span>
            </div>
        `;
    } else {
        elements.selectedCarInfo.innerHTML = '<span class="no-selection">Select a car to continue</span>';
        elements.reservationDates.innerHTML = '';
        elements.reservationTotal.innerHTML = '';
        
        // Show times in reservation bar even without car selection
        if (bookingState.visitDetails.pickupDate && bookingState.visitDetails.dropoffDate) {
            elements.reservationDates.innerHTML = `
                <div class="reservation-period">
                    <div class="period-dates">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${formatDate(bookingState.visitDetails.pickupDate)} - ${formatDate(bookingState.visitDetails.dropoffDate)}</span>
                    </div>
                    <div class="duration">${bookingState.totalDays} days</div>
                    ${bookingState.visitDetails.pickupTime && bookingState.visitDetails.dropoffTime ? `
                    <div class="period-times">
                        <span>Pickup time: ${bookingState.visitDetails.pickupTime}</span>
                        <span>Drop-off time: ${bookingState.visitDetails.dropoffTime}</span>
                    </div>
                    ` : ''}
                </div>
            `;
        }
    }
    
    updateBookingBreakdown();
}

// Calculate total price
function calculateTotal() {
    let total = 0;
    
    if (bookingState.selectedCar && bookingState.totalDays > 0) {
        const carPrice = bookingState.selectedCar.pricing[bookingState.pricingTier].daily * bookingState.totalDays;
        total += carPrice;
        
        // Add insurance
        if (bookingState.selectedInsurance) {
            total += additionalServices.insurance[bookingState.selectedInsurance].daily * bookingState.totalDays;
        }
        
        // Add equipment
        bookingState.selectedEquipment.forEach(equipmentId => {
            total += additionalServices.equipment[equipmentId].daily * bookingState.totalDays;
        });
    }
    
    return total;
}

// Update booking breakdown
function updateBookingBreakdown() {
    if (!elements.bookingBreakdown) return;
    
    let breakdown = '';
    
    if (bookingState.selectedCar && bookingState.totalDays > 0) {
        const car = bookingState.selectedCar;
        const carPrice = car.pricing[bookingState.pricingTier].daily * bookingState.totalDays;
        
        breakdown += `
            <div class="breakdown-item">
                <span class="item-name">${car.name} (${bookingState.totalDays} days)</span>
                <span class="item-price">€${carPrice}</span>
            </div>
        `;
        
        if (bookingState.selectedInsurance) {
            const insurancePrice = additionalServices.insurance[bookingState.selectedInsurance].daily * bookingState.totalDays;
            breakdown += `
                <div class="breakdown-item">
                    <span class="item-name">${additionalServices.insurance[bookingState.selectedInsurance].name} Insurance</span>
                    <span class="item-price">€${insurancePrice}</span>
                </div>
            `;
        }
        
        bookingState.selectedEquipment.forEach(equipmentId => {
            const equipmentPrice = additionalServices.equipment[equipmentId].daily * bookingState.totalDays;
            breakdown += `
                <div class="breakdown-item">
                    <span class="item-name">${additionalServices.equipment[equipmentId].name}</span>
                    <span class="item-price">€${equipmentPrice}</span>
                </div>
            `;
        });
        
        const total = calculateTotal();
        breakdown += `
            <div class="breakdown-total">
                <span class="total-label">Total:</span>
                <span class="total-amount">€${total}</span>
            </div>
        `;
    }
    
    elements.bookingBreakdown.innerHTML = breakdown;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Toggle reservation details
function toggleReservationDetails() {
    if (!elements.reservationDetails || !elements.expandBtn) return;
    
    const isExpanded = elements.reservationDetails.classList.contains('expanded');
    
    if (isExpanded) {
        elements.reservationDetails.classList.remove('expanded');
        elements.expandBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
        elements.reservationDetails.classList.add('expanded');
        elements.expandBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Filter change listeners
    document.querySelectorAll('.filter-option input').forEach(input => {
        input.addEventListener('change', renderCarGrid);
    });
    
    // Insurance selection
    document.querySelectorAll('.insurance-select').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.insurance-card');
            const plan = card.dataset.plan;
            
            // Remove previous selection
            document.querySelectorAll('.insurance-card').forEach(c => c.classList.remove('selected'));
            document.querySelectorAll('.insurance-select').forEach(b => {
                b.textContent = 'Select';
                b.classList.remove('btn-primary');
                b.classList.add('btn-outline');
            });
            
            // Add new selection
            card.classList.add('selected');
            this.textContent = 'Selected';
            this.classList.remove('btn-outline');
            this.classList.add('btn-primary');
            
            bookingState.selectedInsurance = plan;
            updateReservationBar();
        });
    });
    
    // Equipment selection
    document.querySelectorAll('.equipment-item input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const equipmentId = this.value;
            
            if (this.checked) {
                if (!bookingState.selectedEquipment.includes(equipmentId)) {
                    bookingState.selectedEquipment.push(equipmentId);
                }
            } else {
                bookingState.selectedEquipment = bookingState.selectedEquipment.filter(id => id !== equipmentId);
            }
            
            updateReservationBar();
        });
    });
}

// Navigation functions
function nextStep() {
    if (validateCurrentStep()) {
        if (quickBookingMode && bookingState.currentStep === 1) {
            bookingState.currentStep = 3 // Sari direct la pasul 3 dacă e quick booking
            updateStepDisplay()
            return
        }
        if (bookingState.currentStep < 4) {
            bookingState.currentStep++;
            updateStepDisplay();
        }
    }
}

function prevStep() {
    if (bookingState.currentStep > 1) {
        bookingState.currentStep--;
        updateStepDisplay();
    }
}

// Validate current step
function validateCurrentStep() {
    switch (bookingState.currentStep) {
        case 1:
            const pickupLocation = document.getElementById('pickup-location')?.value;
            const dropoffLocation = document.getElementById('dropoff-location')?.value;
            const pickupDate = document.getElementById('pickup-date')?.value;
            const dropoffDate = document.getElementById('dropoff-date')?.value;
            
            if (!pickupLocation || !dropoffLocation || !pickupDate || !dropoffDate) {
                alert('Please fill in all visit details.');
                return false;
            }
            
            if (new Date(pickupDate) >= new Date(dropoffDate)) {
                alert('Drop-off date must be after pickup date.');
                return false;
            }
            
            return true;
            
        case 2:
            if (!bookingState.selectedCar) {
                alert('Please select a car.');
                return false;
            }
            return true;
            
        case 3:
            return true; // Optional services
            
        case 4:
            const firstName = document.getElementById('first-name')?.value;
            const lastName = document.getElementById('last-name')?.value;
            const email = document.getElementById('email')?.value;
            const phone = document.getElementById('phone')?.value;
            const birthDate = document.getElementById('birth-date')?.value;
            const licenseNumber = document.getElementById('license-number')?.value;
            const privacyPolicy = document.getElementById('privacy-policy')?.checked;
            
            if (!firstName || !lastName || !email || !phone || !birthDate || !licenseNumber) {
                alert('Please fill in all required fields.');
                return false;
            }
            
            if (!privacyPolicy) {
                alert('Please accept the privacy policy.');
                return false;
            }
            
            return true;
    }
    
    return true;
}

// Update step display
function updateStepDisplay() {
    // Update progress indicator
    elements.steps.forEach((step, index) => {
        if (index + 1 <= bookingState.currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update step content
    elements.bookingSteps.forEach((step, index) => {
        if (index + 1 === bookingState.currentStep) {
            step.classList.remove('hidden');
        } else {
            step.classList.add('hidden');
        }
    });
    
    // Update final summary on step 4
    if (bookingState.currentStep === 4) {
        updateFinalSummary();
    }
}

// Update final summary
function updateFinalSummary() {
    if (!elements.finalSummary) {
        return;
    }
    
    const car = bookingState.selectedCar;
    const total = calculateTotal();
    
    if (car) {
        // Calculate price based on rental days
        const priceCategory = getPriceCategory(bookingState.totalDays);
        const dailyPrice = car.pricing[priceCategory].daily;
        const carTotal = dailyPrice * bookingState.totalDays;
        
        // Calculate additional services
        let insuranceTotal = 0;
        if (bookingState.selectedInsurance) {
            insuranceTotal = additionalServices.insurance[bookingState.selectedInsurance].daily * bookingState.totalDays;
        }
        
        let equipmentTotal = 0;
        bookingState.selectedEquipment.forEach(eq => {
            equipmentTotal += additionalServices.equipment[eq].daily * bookingState.totalDays;
        });
        
        const totalPrice = carTotal + insuranceTotal + equipmentTotal;
        
        elements.finalSummary.innerHTML = `
            <div class="summary-car">
                <img src="${car.image}" alt="${car.name}" class="summary-car-image" onerror="this.src='assets/images/cars/placeholder.jpg'">
                <div class="summary-car-details">
                    <div class="summary-car-name">${car.name}</div>
                    <div class="summary-car-class">${car.category} | ${car.transmission === 'automatic' ? 'Automatic' : 'Manual'}</div>
                </div>
            </div>
            
            <div class="summary-details">
                <div class="summary-row">
                    <div class="summary-label">Pickup</div>
                    <div class="summary-value">${formatDate(bookingState.visitDetails.pickupDate)}, ${bookingState.visitDetails.pickupTime}</div>
                </div>
                
                <div class="summary-row">
                    <div class="summary-label">Drop-off</div>
                    <div class="summary-value">${formatDate(bookingState.visitDetails.dropoffDate)}, ${bookingState.visitDetails.dropoffTime}</div>
                </div>
                
                <div class="summary-row">
                    <div class="summary-label">Duration</div>
                    <div class="summary-value">${bookingState.totalDays} days</div>
                </div>
                
                <div class="summary-row">
                    <div class="summary-label">Car Price</div>
                    <div class="summary-value">${carTotal}€</div>
                </div>
                
                ${bookingState.selectedInsurance ? `
                <div class="summary-row">
                    <div class="summary-label">${bookingState.selectedInsurance === 'premium' ? 'Premium' : 'Full'} Insurance</div>
                    <div class="summary-value">${insuranceTotal}€</div>
                </div>
                ` : ''}
                
                ${bookingState.selectedEquipment.map(eq => {
                    const equipmentName = getEquipmentName(eq);
                    const equipmentPrice = additionalServices.equipment[eq].daily * bookingState.totalDays;
                    return `
                    <div class="summary-row">
                        <div class="summary-label">${equipmentName}</div>
                        <div class="summary-value">${equipmentPrice}€</div>
                    </div>
                    `;
                }).join('')}
            </div>
            
            <div class="summary-total">
                <div class="summary-label">Total</div>
                <div class="summary-value">${totalPrice}€</div>
            </div>
        `;
    }
}

// Get location name
function getLocationName(locationCode) {
    const locations = {
        'satu-mare': 'Satu Mare',
        'baia-mare': 'Baia Mare',
        'oradea': 'Oradea',
        'cluj-napoca': 'Cluj-Napoca',
        'cluj-napoca-airport': 'Cluj-Napoca Airport',
        'debrecen': 'Debrecen',
        'debrecen-airport': 'Debrecen Airport',
        'budapest': 'Budapest',
        'budapest-airport': 'Budapest Airport'
    };
    return locations[locationCode] || locationCode;
}

// Get price category based on rental days
function getPriceCategory(days) {
    if (days >= 1 && days <= 3) return 'tier1';   // 1-3 days
    if (days >= 4 && days <= 7) return 'tier2';   // 4-7 days
    if (days >= 8 && days <= 14) return 'tier3';  // 8-14 days
    if (days >= 15 && days <= 30) return 'tier4'; // 15-30 days
    if (days > 30) return 'tier4'; // For rentals longer than 30 days, use tier4
    return 'tier1'; // Default
}

// Get equipment name
function getEquipmentName(equipmentCode) {
    const names = {
        'gps': 'GPS',
        'baby-seat': 'Baby Seat',
        'child-seat': 'Child Seat',
        'additional-driver': 'Additional Driver'
    };
    return names[equipmentCode] || equipmentCode;
}

// Complete booking
function completeBooking() {
    if (validateCurrentStep()) {
        // Collect personal details
        bookingState.personalDetails = {
            firstName: document.getElementById('first-name')?.value,
            lastName: document.getElementById('last-name')?.value,
            email: document.getElementById('email')?.value,
            phone: document.getElementById('phone')?.value,
            countryCode: document.getElementById('country-code')?.value,
            birthDate: document.getElementById('birth-date')?.value,
            licenseNumber: document.getElementById('license-number')?.value,
            privacyPolicy: document.getElementById('privacy-policy')?.checked,
            commercialInfo: document.getElementById('commercial-info')?.checked
        };
        
        // Here you would typically send the booking data to your backend
        
        // Show success message
        alert('Booking completed successfully! You will receive a confirmation email shortly.');
        
        // Redirect to confirmation page or reset form
        // window.location.href = 'booking-confirmation.html';
    }
}

// ===== FOOTER OVERLAP PREVENTION =====

// Function to check if footer is visible and adjust reservation bar position
function adjustReservationBarPosition() {
    const reservationBar = document.getElementById('reservation-bar');
    const footer = document.querySelector('.footer');
    const main = document.querySelector('main');
    
    if (!reservationBar || !footer || !main) return;
    
    // Get viewport and element positions
    const viewportHeight = window.innerHeight;
    const footerRect = footer.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();
    
    // Check if footer is visible in viewport
    const footerVisible = footerRect.top < viewportHeight && footerRect.bottom > 0;
    
    // Check if page content is short (footer is always visible)
    const pageHeight = document.documentElement.scrollHeight;
    const isShortPage = pageHeight <= viewportHeight + 200; // 200px threshold
    
    if (footerVisible || isShortPage) {
        // Footer is visible, move reservation bar above it
        reservationBar.classList.remove('fixed-bottom');
        reservationBar.classList.add('above-footer');
        main.style.paddingBottom = '0';
    } else {
        // Footer is not visible, keep reservation bar fixed at bottom
        reservationBar.classList.remove('above-footer');
        reservationBar.classList.add('fixed-bottom');
        main.style.paddingBottom = '120px';
    }
}

// Function to handle scroll events for dynamic adjustment
function handleScrollForReservationBar() {
    let scrollTimeout;
    
    return function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(adjustReservationBarPosition, 100);
    };
}

// Initialize footer overlap prevention
function initFooterOverlapPrevention() {
    // Initial adjustment
    adjustReservationBarPosition();
    
    // Add scroll listener for dynamic adjustment
    window.addEventListener('scroll', handleScrollForReservationBar());
    
    // Add resize listener for responsive adjustment
    window.addEventListener('resize', adjustReservationBarPosition);
    
    // Add mutation observer for dynamic content changes
    const observer = new MutationObserver(adjustReservationBarPosition);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}