// Enhanced Car Database Mappings - English Version
// This file contains additional metadata and enhanced categorization for the car fleet (English)

// Import the main categorization function
function enhancedMapCarCategory(car) {
    const name = car.name.toLowerCase();
    const tier1Price = car.pricing.tier1;
    
    // Van/MPV category - most specific first
    if (name.includes('trafic') || name.includes('caravelle') || 
        name.includes('alhambra') || name.includes('touran') || 
        car.seats >= 7) {
        return 'van';
    }
    
    // Luxury category - premium brands and high-end models
    if (name.includes('mercedes glc') || name.includes('mercedes gle') || 
        name.includes('mercedes e klasse') || name.includes('bmw x3') || 
        name.includes('bmw seria 5') && tier1Price >= 80 || 
        name.includes('audi q5') || name.includes('volvo xc60') && name.includes('nou') ||
        tier1Price >= 110) {
        return 'luxury';
    }
    
    // SUV category - crossovers and SUVs
    if (name.includes('rav4') || name.includes('x1') || name.includes('xc40') || 
        name.includes('xc60') || name.includes('kodiaq') || name.includes('kamiq') || 
        name.includes('t-cross') || name.includes('touareg') || name.includes('outlander') || 
        name.includes('tiguan') || name.includes('glc') || name.includes('gle') ||
        name.includes('q5') || name.includes('x3')) {
        return 'suv';
    }
    
    // Sedan category - traditional sedans and executive cars
    if (name.includes('octavia sedan') || name.includes('passat') && !name.includes('combi') ||
        name.includes('a4') || name.includes('a6') || name.includes('seria 5') || 
        name.includes('e klasse') || name.includes('accord') || name.includes('exeo') && !name.includes('combi') ||
        name.includes('superb') || name.includes('jetta') || name.includes('mazda 6')) {
        return 'sedan';
    }
    
    // Compact category - smaller cars and hatchbacks
    if (name.includes('scala') || name.includes('a3') || name.includes('golf') ||
        name.includes('polo') || name.includes('megane') || 
        name.includes('combi') || name.includes('octavia combi')) {
        return 'compact';
    }
    
    // Economic category - budget-friendly options
    if (tier1Price <= 45) {
        return 'economic';
    }
    
    // Default fallback based on price
    if (tier1Price >= 80) return 'luxury';
    if (tier1Price >= 60) return 'sedan';
    return 'compact';
}

// Enhanced description generation - English
function getEnhancedDescriptionEN(car) {
    const category = car.category || enhancedMapCarCategory(car);
    const transmission = car.displayTransmission === 'automatic' ? 'Automatic' : 'Manual';
    const name = car.name;
    
    // Special descriptions for specific models
    if (name.includes('NOU')) {
        return `${getCategoryNameEN(category)} ${transmission} NEW - Latest model with cutting-edge technology`;
    }
    
    if (name.includes('GT')) {
        return `Gran Turismo ${transmission} - Top performance and comfort`;
    }
    
    if (name.includes('COMBI')) {
        return `${getCategoryNameEN(category)} ${transmission} - Large space and maximum versatility`;
    }
    
    // Category-based descriptions
    switch (category) {
        case 'van':
            return `${car.displayPassengers || mapPassengers(car)}-Seater Van - Perfect for group travel`;
        case 'luxury':
            return `Premium Sedan ${transmission} - Top elegance and performance`;
        case 'suv':
            return `SUV ${transmission} - Comfort and versatility for any terrain`;
        case 'sedan':
            return `Sedan ${transmission} - Perfect balance of comfort and performance`;
        case 'compact':
            return `Compact ${transmission} - Ideal for city and short trips`;
        case 'economic':
            return `Economy ${transmission} - Efficient solution for urban mobility`;
        default:
            return `${transmission} - Quality vehicle for any destination`;
    }
}

function getCategoryNameEN(category) {
    const names = {
        'van': 'Van',
        'luxury': 'Luxury',
        'suv': 'SUV',
        'sedan': 'Sedan',
        'compact': 'Compact',
        'economic': 'Economy'
    };
    return names[category] || 'Auto';
}

// Enhanced fuel type mapping - English
function mapFuelTypeEN(car) {
    const name = car.name.toLowerCase();
    
    // Explicit diesel models
    if (name.includes('diesel') || name.includes('tdi') || 
        name.includes('dci') || name.includes('d ')) {
        return 'Diesel';
    }
    
    // Hybrid models
    if (name.includes('hybrid') || name.includes('e-power')) {
        return 'Hybrid';
    }
    
    // Electric models
    if (name.includes('electric') || name.includes('ev') || name.includes('e-tron')) {
        return 'Electric';
    }
    
    // Default to petrol for most cars
    return 'Petrol';
}

// Enhanced baggage capacity mapping - English
function mapBaggageCapacityEN(car) {
    const category = car.category || enhancedMapCarCategory(car);
    const passengers = car.displayPassengers || mapPassengers(car);
    
    if (category === 'van' || passengers >= 8) {
        return '6 large bags';
    } else if (category === 'suv' || passengers === 7) {
        return '4 large bags';
    } else if (category === 'luxury' || category === 'sedan') {
        return '3 large bags';
    } else {
        return '2 large bags';
    }
}

// Enhanced features for English - with passengers/baggage translations
function getEnhancedFeaturesEN(car) {
    const features = [];
    const name = car.name.toLowerCase();
    const tier1Price = car.pricing.tier1;
    const category = car.category || enhancedMapCarCategory(car);
    
    // Standard features
    features.push({
        icon: 'fas fa-user',
        text: `${car.displayPassengers || mapPassengers(car)} passengers`
    });
    
    features.push({
        icon: 'fas fa-suitcase',
        text: mapBaggageCapacityEN(car)
    });
    
    features.push({
        icon: 'fas fa-gauge',
        text: car.displayTransmission === 'automatic' ? 'Automatic' : 'Manual'
    });
    
    features.push({
        icon: 'fas fa-gas-pump',
        text: mapFuelTypeEN(car)
    });
    
    // Additional features based on category/price
    if (category === 'luxury' || tier1Price >= 90) {
        features.push({
            icon: 'fas fa-snowflake',
            text: 'Automatic climate control'
        });
        
        features.push({
            icon: 'fas fa-chair',
            text: 'Heated seats'
        });
    }
    
    if (name.includes('nou') || tier1Price >= 100) {
        features.push({
            icon: 'fas fa-shield-alt',
            text: 'Advanced safety'
        });
    }
    
    return features;
}

// Enhanced amenities for premium cars - English
function getEnhancedAmenitiesEN(car) {
    const amenities = [];
    const name = car.name.toLowerCase();
    const tier1Price = car.pricing.tier1;
    const category = car.category || enhancedMapCarCategory(car);
    
    if (category === 'luxury' || tier1Price >= 80) {
        amenities.push({
            icon: 'fas fa-music',
            text: 'Premium audio system'
        });
        
        amenities.push({
            icon: 'fas fa-wifi',
            text: 'Advanced connectivity'
        });
        
        amenities.push({
            icon: 'fas fa-star',
            text: 'Full extra features'
        });
        
        amenities.push({
            icon: 'fas fa-car',
            text: 'Parking assistant'
        });
    } else if (category === 'suv' || tier1Price >= 60) {
        amenities.push({
            icon: 'fas fa-snowflake',
            text: 'Manual air conditioning'
        });
        
        amenities.push({
            icon: 'fas fa-tachometer-alt',
            text: 'Cruise control'
        });
    }
    
    return amenities;
}

// Convert EUR to EUR (no conversion for English page)
function convertEurToEur(eurPrice) {
    return eurPrice;
}

// Export functions for global use
if (typeof window !== 'undefined') {
    window.CarEnhancementsEN = {
        enhancedMapCarCategory,
        getEnhancedDescriptionEN,
        getCategoryNameEN,
        mapFuelTypeEN,
        mapBaggageCapacityEN,
        getEnhancedFeaturesEN,
        getEnhancedAmenitiesEN,
        convertEurToEur
    };
}