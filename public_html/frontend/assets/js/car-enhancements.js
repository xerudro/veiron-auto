// Enhanced Car Database Mappings
// This file contains additional metadata and enhanced categorization for the car fleet

// Enhanced car category mapping with more specific rules
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

// Enhanced fuel type mapping
function mapFuelType(car) {
    const name = car.name.toLowerCase();
    
    // Explicit diesel models
    if (name.includes('diesel') || name.includes('tdi') || 
        name.includes('dci') || name.includes('d ')) {
        return 'Diesel';
    }
    
    // Hybrid models
    if (name.includes('hybrid') || name.includes('e-power')) {
        return 'Hibrid';
    }
    
    // Electric models
    if (name.includes('electric') || name.includes('ev') || name.includes('e-tron')) {
        return 'Electric';
    }
    
    // Default to petrol for most cars
    return 'Benzină';
}

// Enhanced baggage capacity mapping
function mapBaggageCapacity(car) {
    const category = car.category || enhancedMapCarCategory(car);
    const passengers = car.displayPassengers || mapPassengers(car);
    
    if (category === 'van' || passengers >= 8) {
        return '6 bagaje mari';
    } else if (category === 'suv' || passengers === 7) {
        return '4 bagaje mari';
    } else if (category === 'luxury' || category === 'sedan') {
        return '3 bagaje mari';
    } else {
        return '2 bagaje mari';
    }
}

// Enhanced car features based on category and price
function getEnhancedFeatures(car) {
    const features = [];
    const name = car.name.toLowerCase();
    const tier1Price = car.pricing.tier1;
    const category = car.category || enhancedMapCarCategory(car);
    
    // Standard features
    features.push({
        icon: 'fas fa-user',
        text: `${car.displayPassengers || mapPassengers(car)} pasageri`
    });
    
    features.push({
        icon: 'fas fa-suitcase',
        text: mapBaggageCapacity(car)
    });
    
    features.push({
        icon: 'fas fa-gauge',
        text: car.displayTransmission === 'automatic' ? 'Automată' : 'Manuală'
    });
    
    features.push({
        icon: 'fas fa-gas-pump',
        text: mapFuelType(car)
    });
    
    // Additional features based on category/price
    if (category === 'luxury' || tier1Price >= 90) {
        features.push({
            icon: 'fas fa-snowflake',
            text: 'Climatizare automată'
        });
        
        features.push({
            icon: 'fas fa-chair',
            text: 'Scaune încălzite'
        });
    }
    
    if (name.includes('nou') || tier1Price >= 100) {
        features.push({
            icon: 'fas fa-shield-alt',
            text: 'Siguranță avansată'
        });
    }
    
    return features;
}

// Enhanced amenities for premium cars
function getEnhancedAmenities(car) {
    const amenities = [];
    const name = car.name.toLowerCase();
    const tier1Price = car.pricing.tier1;
    const category = car.category || enhancedMapCarCategory(car);
    
    if (category === 'luxury' || tier1Price >= 80) {
        amenities.push({
            icon: 'fas fa-music',
            text: 'Sistem audio premium'
        });
        
        amenities.push({
            icon: 'fas fa-wifi',
            text: 'Conectivitate avansată'
        });
        
        amenities.push({
            icon: 'fas fa-star',
            text: 'Dotări full extra'
        });
        
        amenities.push({
            icon: 'fas fa-car',
            text: 'Asistent parcare'
        });
    } else if (category === 'suv' || tier1Price >= 60) {
        amenities.push({
            icon: 'fas fa-snowflake',
            text: 'Climatizare manuală'
        });
        
        amenities.push({
            icon: 'fas fa-tachometer-alt',
            text: 'Pilot automat'
        });
    }
    
    return amenities;
}

// Enhanced description generation
function getEnhancedDescription(car) {
    const category = car.category || enhancedMapCarCategory(car);
    const transmission = car.displayTransmission === 'automatic' ? 'Automată' : 'Manuală';
    const name = car.name;
    
    // Special descriptions for specific models
    if (name.includes('NOU')) {
        return `${getCategoryName(category)} ${transmission} NOU - Ultimul model cu tehnologie de vârf`;
    }
    
    if (name.includes('GT')) {
        return `Gran Turismo ${transmission} - Performanță și confort de top`;
    }
    
    if (name.includes('COMBI')) {
        return `${getCategoryName(category)} ${transmission} - Spațiu mare și versatilitate maximă`;
    }
    
    // Category-based descriptions
    switch (category) {
        case 'van':
            return `Van ${car.displayPassengers || mapPassengers(car)} locuri - Perfect pentru călătorii în grup`;
        case 'luxury':
            return `Sedan Premium ${transmission} - Eleganță și performanță de top`;
        case 'suv':
            return `SUV ${transmission} - Confort și versatilitate pentru orice teren`;
        case 'sedan':
            return `Sedan ${transmission} - Echilibru perfect între confort și performanță`;
        case 'compact':
            return `Compact ${transmission} - Ideal pentru oraș și călătorii scurte`;
        case 'economic':
            return `Economic ${transmission} - Soluția eficientă pentru deplasări urbane`;
        default:
            return `${transmission} - Vehicul de calitate pentru orice destinație`;
    }
}

function getCategoryName(category) {
    const names = {
        'van': 'Van',
        'luxury': 'Luxury',
        'suv': 'SUV',
        'sedan': 'Sedan',
        'compact': 'Compact',
        'economic': 'Economic'
    };
    return names[category] || 'Auto';
}

// Export functions for global use
if (typeof window !== 'undefined') {
    window.CarEnhancements = {
        enhancedMapCarCategory,
        mapFuelType,
        mapBaggageCapacity,
        getEnhancedFeatures,
        getEnhancedAmenities,
        getEnhancedDescription,
        getCategoryName
    };
}