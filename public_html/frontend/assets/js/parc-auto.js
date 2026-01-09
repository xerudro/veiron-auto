// Car Fleet Pagination Configuration
const CARS_PER_PAGE = 8;
let currentPage = 1;
let filteredCars = [];
let carPricingData = null;

// Car Models Configuration
const CAR_MODELS = {
            'vw-passat-manual': {
                title: 'VW PASSAT VARIANT 2.0',
                images: [
                    { file: 'vw-passat-variant/vw-passat-variant-2.0-inchirieri-auto-satu-mare.png', alt: 'VW Passat Variant 2.0 - închiriere auto Satu Mare', isDirectImage: true }
                ]
            },
        'vw-touran-automat': {
            title: 'VW TOURAN AUTOMAT',
            images: [
                { file: 'vw-touran/veiron-rent-vw-touran-inchirieri-auto.png', alt: 'VW Touran automat - închiriere auto Satu Mare', isDirectImage: true }
            ]
        },
    'renault-traffic-8plus1': {
        title: 'Renault Traffic 8+1',
        images: [
            { file: 'renault-traffic-8plus1/renault-trafic-pasageri-pret-avantajos.png', alt: 'Renault Traffic 8+1 van închiriere Satu Mare', isDirectImage: true },
            { file: 'renault-traffic-8plus1/gallery/renault-traffic-lateral-van-spatios.jpg', alt: 'Vedere laterală van spațios', isDirectImage: true }
        ]
    },
    'renault-trafic-8-plus-1-automat': {
        title: 'RENAULT TRAFIC (8+1 locuri)',
        images: [
            { file: 'renault-traffic-8plus1/renault-trafic-pasageri-pret-avantajos.png', alt: 'RENAULT TRAFIC (8+1 locuri) - imagine principală', isDirectImage: true },
            { file: 'renault-traffic-8plus1/gallery/renault-traffic-lateral-van-spatios.jpg', alt: 'Vedere laterală van spațios', isDirectImage: true }
        ]
    },
    'audi-a6': {
        title: 'AUDI A6',
        images: [
            { file: 'audi-a6-sedan-inchiriere-lux-satu-mare.jpg', alt: 'Audi A6 sedan închiriere lux Satu Mare' }
        ]
    },
    'bmw-530-gt': {
        title: 'BMW 530 GT',
        images: [
            { file: 'bmw-530-gt-gran-turismo-inchiriere-satu-mare.jpg', alt: 'BMW 530 GT Gran Turismo închiriere Satu Mare' }
        ]
    },
    'mercedes-e-class': {
        title: 'MERCEDES E-CLASS',
        images: [
            { file: 'mercedes-e-class/mercedes-e-class-luxury-satu-mare.png', alt: 'Mercedes E-Class sedan premium - imagine principală', isDirectImage: true },
            { file: 'mercedes-e-class/gallery/mercedes-e-class-interior-luxury-executive.jpg', alt: 'Interior luxury executive Mercedes E-Class', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Vedere laterală', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Portbagaj executive', isDirectImage: true }
        ]
    },
    'mercedes-e-klasse': {
        title: 'MERCEDES E KLASSE',
        images: [
            { file: 'mercedes-e-class/mercedes-e-class-luxury-satu-mare.png', alt: 'Mercedes E-Class sedan premium - imagine principală', isDirectImage: true },
            { file: 'mercedes-e-class/gallery/mercedes-e-class-interior-luxury-executive.jpg', alt: 'Interior luxury executive Mercedes E-Class', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Vedere laterală', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Portbagaj executive', isDirectImage: true }
        ]
    },
    'mercedes-glc': {
        title: 'MERCEDES GLC',
        images: [
            { file: 'mercedes-glc/mercedes-glc-luxury-suv-veiron-auto.png', alt: 'Mercedes GLC SUV luxury - închiriere Satu Mare', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Interior premium Mercedes GLC', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Vedere laterală SUV premium', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Portbagaj Mercedes GLC', isDirectImage: false }
        ]
    },
    'mercedes-gle': {
        title: 'MERCEDES GLE',
        images: [
            { file: 'mercedes-gle/mercedes-gle-suv-satu-mare.png', alt: 'Mercedes GLE SUV premium - închiriere Satu Mare', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Interior premium Mercedes GLE', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Vedere laterală SUV premium', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Portbagaj Mercedes GLE', isDirectImage: false }
        ]
    },
    'toyota-rav4': {
        title: 'TOYOTA RAV4',
        images: [
            { file: 'toyota-rav4/toyota-rav4-suv-rent-a-car.png', alt: 'Toyota RAV4 SUV închiriere 4x4 Satu Mare', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Toyota RAV4 SUV închiriere 4x4 Satu Mare (vedere laterală)', isDirectImage: true }
        ]
    },
    'audi-a3-tfsi': {
        title: 'AUDI A3 TFSI',
        images: [
            { file: 'main.jpg', alt: 'Audi A3 TFSI - vedere principală' },
            { file: 'Audi A3 - TFSI.jpg', alt: 'Audi A3 TFSI' },
            { file: 'inchiriere_masina_de_oras_satu_mare.jpg', alt: 'Închiriere mașină de oraș Satu Mare' },
            { file: 'inchirieri_auto_ieftin_satu_mare.jpg', alt: 'Închirieri auto ieftin Satu Mare' },
            { file: 'inchirieri_auto_non_stop_satu_mare.jpg', alt: 'Închirieri auto non-stop Satu Mare' },
            { file: 'inchirieri_masini_satu_mare.jpg', alt: 'Închirieri mașini Satu Mare' }
        ]
    },
    'bmw-x1-2025': {
        title: 'BMW X1 2025',
        images: [
            { file: 'bmw-x1-2025-suv-compact-inchiriere-satu-mare.jpg', alt: 'BMW X1 2025 SUV compact închiriere Satu Mare' },
            { file: 'bmw-x1-2025-interior-premium-technology.jpg', alt: 'Interior premium technology BMW X1 2025' },
            { file: 'bmw-x1-2025-lateral-suv-modern.jpg', alt: 'Vedere laterală SUV modern 2025' },
            { file: 'bmw-x1-2025-bagaje-portbagaj-suv.jpg', alt: 'Portbagaj SUV BMW X1 2025' }
        ]
    },
    'renault-koleos': {
        title: 'RENAULT KOLEOS',
        images: [
            { file: 'renault-koleos/renault-koleos-satu-mare-ieftin.png', alt: 'Renault Koleos SUV închiriere family Satu Mare', isDirectImage: true }
        ]
    },
    'audi-q3': {
        title: 'AUDI Q3',
        images: [
            { file: 'audi-q3/audi-q3-2011-veiron-auto-rent.png', alt: 'Audi Q3 SUV', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Interior Audi Q3', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Vedere laterală', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Portbagaj', isDirectImage: false }
        ]
    },
    'mitsubishi-outlander-automat': {
        title: 'MITSUBISHI OUTLANDER AUTOMAT',
        images: [
            { file: 'mitsubishi-outlander/mitsubishi_outlander_suv_rent_a_car_satu_mare.png', alt: 'Mitsubishi Outlander SUV - închiriere Satu Mare', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Interior Mitsubishi Outlander', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Vedere laterală SUV', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Portbagaj Mitsubishi Outlander', isDirectImage: false }
        ]
    },
    'seat-alhambra-7-locuri-automat': {
        title: 'SEAT ALHAMBRA AUTOMAT',
        images: [
            { file: 'seat-alhambra/seat_alhambra_7_locuri_inchiriere.png', alt: 'Seat Alhambra 7 locuri - închiriere Satu Mare', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Interior Seat Alhambra', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Vedere laterală van 7 locuri', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Portbagaj Seat Alhambra', isDirectImage: false }
        ]
    },
    'seat-alhambra-manual-7-locuri': {
        title: 'SEAT ALHAMBRA MANUAL',
        images: [
            { file: 'seat-alhambra/seat_alhambra_7_locuri_inchiriere.png', alt: 'Seat Alhambra 7 locuri manual - închiriere Satu Mare', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Interior Seat Alhambra', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Vedere laterală van 7 locuri', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Portbagaj Seat Alhambra', isDirectImage: false }
        ]
    },
    'renault-megane-manual': {
        title: 'RENAULT MEGANE MANUAL',
        images: [
            { file: 'renault-megane/renault_megane_manual_rent_a_car.png', alt: 'Renault Megane manual - închiriere Satu Mare', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Interior Renault Megane', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Vedere laterală', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Portbagaj Renault Megane', isDirectImage: false }
        ]
    },
    'seat-exeo-manual': {
        title: 'SEAT EXEO MANUAL',
        images: [
            { file: 'seat-exeo/seat_exeo_manual_inchiriere_auto.png', alt: 'Seat Exeo manual - închiriere Satu Mare', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Interior Seat Exeo', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Vedere laterală', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Portbagaj Seat Exeo', isDirectImage: false }
        ]
    },
    'seat-exeo-combi-manual': {
        title: 'SEAT EXEO COMBI MANUAL',
        images: [
            { file: 'seat-exeo-combi/seat_exeo_combi_masina_ieftina_veiron_auto.png', alt: 'Seat Exeo Combi manual - închiriere Satu Mare', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Interior Seat Exeo Combi', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Vedere laterală combi', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Portbagaj Seat Exeo Combi', isDirectImage: false }
        ]
    },
    'skoda-kamiq-automat': {
        title: 'SKODA KAMIQ AUTOMAT',
        images: [
            { file: 'skoda-kamiq/skoda_kamiq_suv_4x4_satu_mare.png', alt: 'Skoda Kamiq SUV - închiriere Satu Mare', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Interior Skoda Kamiq', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Vedere laterală SUV', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Portbagaj Skoda Kamiq', isDirectImage: false }
        ]
    },
    'skoda-scala-automat': {
        title: 'SKODA SCALA AUTOMAT',
        images: [
            { file: 'skoda-scala/skoda-scala-automatic-satu-mare.png', alt: 'Skoda Scala compact - închiriere Satu Mare', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Interior Skoda Scala', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Vedere laterală compact', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Portbagaj Skoda Scala', isDirectImage: false }
        ]
    },
    'volvo-xc40-automat': {
        title: 'VOLVO XC40 AUTOMAT',
        images: [
            { file: 'volvo-xc40/volvo-xc40-automat-inchirieri-aeroport-budapesta-satumare.png', alt: 'Volvo XC40 SUV - închiriere Satu Mare', isDirectImage: true },
            { file: 'placeholder.jpg', alt: 'Interior Volvo XC40', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Vedere laterală SUV', isDirectImage: false },
            { file: 'placeholder.jpg', alt: 'Portbagaj Volvo XC40', isDirectImage: false }
        ]
    },
    'skoda-kodiaq-7-locuri-automat': {
        title: 'SKODA KODIAQ - 7 LOCURI',
        images: [
            { file: 'skoda-kodiaq/skoda-kodiak-7-locuri-rent-a-car-airport-satu-mare-veiron.png', alt: 'Skoda Kodiaq 7 locuri SUV - închiriere Satu Mare', isDirectImage: true },
            { file: 'skoda-kodiaq/gallery/skoda-kodiaq-portbagaj-comparatie-diferenta-locuri.png', alt: 'Portbagaj Skoda Kodiaq - comparație spațiu 5 vs 7 locuri', isDirectImage: true }
        ]
    },
    'skoda-kodiaq-automat': {
        title: 'SKODA KODIAQ - 5 LOCURI',
        images: [
            { file: 'skoda-kodiaq/skoda-kodiak-7-locuri-rent-a-car-airport-satu-mare-veiron.png', alt: 'Skoda Kodiaq 5 locuri SUV - închiriere Satu Mare', isDirectImage: true },
            { file: 'skoda-kodiaq/gallery/skoda-kodiaq-portbagaj-comparatie-diferenta-locuri.png', alt: 'Portbagaj Skoda Kodiaq - comparație spațiu 5 vs 7 locuri', isDirectImage: true }
        ]
    },
    'skoda-octavia-sedan-automat': {
        title: 'SKODA OCTAVIA SEDAN AUTOMAT',
        images: [
            { file: 'skoda-octavia-sedan/skoda-octavia-sedan-rent-a-car-cluj-napoca-veiron.png', alt: 'Skoda Octavia Sedan - închiriere Cluj-Napoca', isDirectImage: true }
        ]
    },
    'skoda-octavia-combi-automat': {
        title: 'SKODA OCTAVIA COMBI AUTOMAT',
        images: [
            { file: 'skoda-octavia-combi/inchirieri-skoda-octavia-combi-pret-avantajos.png', alt: 'Skoda Octavia Combi - închiriere preț avantajos', isDirectImage: true }
        ]
    },
    'volvo-xc60-automat': {
        title: 'VOLVO XC60 AUTOMAT',
        images: [
            { file: 'volvo-xc60-facelift/volvo-xc60-automat-suv-luxury-inchirieri-auto-satu-mare.png', alt: 'Volvo XC60 Facelift SUV luxury - închiriere Satu Mare', isDirectImage: true }
        ]
    },
    'volvo-xc60-automat-nou': {
        title: 'VOLVO XC60 AUTOMAT NOU',
        images: [
            { file: 'volvo-xc60-automat/volvo-xc60-suv-debrecen-satumare-veiron-auto.png', alt: 'Volvo XC60 NOU SUV - închiriere Debrecen și Satu Mare', isDirectImage: true }
        ]
    },
    'skoda-superb-automat': {
        title: 'SKODA SUPERB AUTOMAT',
        images: [
            { file: 'skoda-superb/skoda-suberb-inchirieri-satu-mare-ieftin.png', alt: 'Skoda Superb - închirieri Satu Mare preț ieftin', isDirectImage: true }
        ]
    },
    'vw-caravelle-8-plus-1': {
        title: 'VW CARAVELLE (8+1 LOCURI)',
        images: [
            { file: 'vw-caravelle/vw-caravelle-van-inchirieri-family-satu-mare.png', alt: 'VW Caravelle 8+1 locuri van - închirieri family Satu Mare', isDirectImage: true }
        ]
    },
    'vw-t-cross-automat': {
        title: 'VW T-CROSS AUTOMAT',
        images: [
            { file: 'vw-t-cross/vw-t-cross-automat-rent-a-car-satu-mare-veiron-auto.png', alt: 'VW T-Cross automat SUV compact - închiriere Satu Mare', isDirectImage: true }
        ]
    },
    'vw-golf-manual': {
        title: 'VW GOLF MANUAL',
        images: [
            { file: 'vw-golf-4/inchirieri-auto-ieftine-satu-mare-vw-golf-4.png', alt: 'VW Golf 4 manual - închirieri auto ieftine Satu Mare', isDirectImage: true }
        ]
    },
    'vw-jetta-manual': {
        title: 'VW JETTA MANUAL',
        images: [
            { file: 'vw-jetta-2.0/vw-jetta-2-0-diese-satu-mare-ieftin.png', alt: 'VW Jetta 2.0 manual diesel - închiriere auto ieftină Satu Mare', isDirectImage: true }
        ]
    },
    'vw-tiguan-automat': {
        title: 'VW TIGUAN AUTOMAT',
        images: [
            { file: 'vw-tiguan/vw-tiguan-veiron-auto-satu-mare.png', alt: 'VW Tiguan automat SUV - închiriere Satu Mare', isDirectImage: true }
        ]
    },
    'ssangyong-actyon-automat': {
        title: 'SSANGYONG KGM ACTYON',
        images: [
            { file: 'ssangyong-actyon/kgm-actyon-benzina-gold-auriu-inchiriere-satu-mare.png', alt: 'SsangYong KGM Actyon - închiriere SUV automat Satu Mare', isDirectImage: true }
        ]
    },
    'ssangyong-korando': {
        title: 'SSANGYONG KGM KORANDO',
        images: [
            { file: 'ssangyong-korando/ssangyong-kgm-korando-daune-auto-satu-mare.png', alt: 'SsangYong KGM Korando - închiriere SUV Satu Mare', isDirectImage: true }
        ]
    },
    'toyota-avensis-combi': {
        title: 'TOYOTA AVENSIS COMBI',
        images: [
            { file: 'toyota-avensis-combi/toyota-avensis-combi-solutionare-daune-auto-satu-mare.png', alt: 'Toyota Avensis Combi - închiriere break Satu Mare', isDirectImage: true }
        ]
    },
    'vw-touran': {
        title: 'VW TOURAN',
        images: [
            { file: 'vw-touran/veiron-rent-vw-touran-inchirieri-auto.png', alt: 'VW Touran - închiriere auto Satu Mare', isDirectImage: true }
        ]
    }
};

// Car Colors Configuration
const CAR_COLORS = {
        'vw-passat-cc-automat': {
            color: 'black',
            colorRO: 'NEGRU',
            colorEN: 'BLACK'
        },
    'audi-a3-automat': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'audi-a4-manual': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'audi-a6-automat': {
        color: 'grey',
        colorRO: 'GRI',
        colorEN: 'GREY'
    },
    'audi-q5-nou': {
        color: 'black',
        colorRO: 'NEGRU',
        colorEN: 'BLACK'
    },
    'bmw-seria-5-automat-nou': {
        color: 'black',
        colorRO: 'NEGRU',
        colorEN: 'BLACK'
    },
    'bmw-seria-5-combi-automat': {
        color: 'black',
        colorRO: 'NEGRU',
        colorEN: 'BLACK'
    },
    'bmw-seria-5-combi-manual': {
        color: 'black',
        colorRO: 'NEGRU',
        colorEN: 'BLACK'
    },
    'bmw-seria-5-gt': {
        color: 'grey',
        colorRO: 'GRI',
        colorEN: 'GREY'
    },
    'bmw-x1-automat': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'bmw-x3-nou': {
        color: 'black',
        colorRO: 'NEGRU',
        colorEN: 'BLACK'
    },
    'honda-accord-automat': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'mazda-6-manual': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'audi-q3': {
        color: 'black',
        colorRO: 'NEGRU',
        colorEN: 'BLACK'
    },
    'mercedes-e-klasse': {
        color: 'grey',
        colorRO: 'GRI METALIZAT',
        colorEN: 'GREY METALLIC'
    },
    'mercedes-glc': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'mercedes-glc-automat': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'mercedes-gle': {
        color: 'black',
        colorRO: 'NEGRU',
        colorEN: 'BLACK'
    },
    'mercedes-gle-automat': {
        color: 'black',
        colorRO: 'NEGRU',
        colorEN: 'BLACK'
    },
    'mitsubishi-outlander-automat': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'seat-alhambra-7-locuri-automat': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'seat-alhambra-manual-7-locuri': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'renault-megane-manual': {
        color: 'grey',
        colorRO: 'GRI',
        colorEN: 'GREY'
    },
    'renault-trafic-8-plus-1-automat': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'seat-exeo-manual': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'seat-exeo-combi-manual': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'skoda-kamiq-automat': {
        color: 'grey',
        colorRO: 'GRI',
        colorEN: 'GREY'
    },
    'skoda-scala-automat': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'volvo-xc40-automat': {
        color: 'black',
        colorRO: 'NEGRU',
        colorEN: 'BLACK'
    },
    'skoda-kodiaq-automat': {
        color: 'grey',
        colorRO: 'GRI',
        colorEN: 'GREY'
    },
    'skoda-kodiaq-7-locuri-automat': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'skoda-octavia-combi-automat': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'skoda-octavia-sedan-automat': {
        color: 'blue',
        colorRO: 'ALBASTRU',
        colorEN: 'BLUE'
    },
    'skoda-superb-automat': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'toyota-rav4-automat': {
        color: 'black',
        colorRO: 'NEGRU',
        colorEN: 'BLACK'
    },
    'vw-caravelle-8-plus-1': {
        color: 'orange',
        colorRO: 'PORTOCALIU',
        colorEN: 'ORANGE'
    },
    'volvo-xc60-automat': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'volvo-xc60-automat-nou': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'vw-golf-manual': {
        color: 'grey',
        colorRO: 'GRI',
        colorEN: 'GREY'
    },
    'vw-polo-manual': {
        color: 'grey',
        colorRO: 'GRI',
        colorEN: 'GREY'
    },
    'vw-polo-automat': {
        color: 'grey',
        colorRO: 'GRI',
        colorEN: 'GREY'
    },
    'vw-jetta-manual': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'vw-tiguan-automat': {
        color: 'white',
        colorRO: 'ALB',
        colorEN: 'WHITE'
    },
    'vw-t-cross-automat': {
        color: 'black',
        colorRO: 'NEGRU',
        colorEN: 'BLACK'
    },
    'ssangyong-actyon-automat': {
        color: 'gold',
        colorRO: 'AURIU',
        colorEN: 'GOLD'
    },
    'ssangyong-korando': {
        color: 'grey',
        colorRO: 'GRI',
        colorEN: 'GREY'
    },
    'toyota-avensis-combi': {
        color: 'blue',
        colorRO: 'ALBASTRU',
        colorEN: 'BLUE'
    }
};

// Default image configuration for cars not explicitly defined
function getDefaultImages(carId, carName) {
    // Map car IDs to their corresponding individual image files
    // Each car gets a unique image to avoid duplicates
    const carImageMap = {
        'vw-touareg-automat': 'vw-touareg/vw-touareg-4x4-veiron-auto-satu-mare.png', // VW Touareg image
        'audi-a3-automat': 'audi-a3-tfsi/audi-a3-inchirieri-auto-satu-mare.png', // Updated Audi A3 image
        'audi-a4-manual': 'audi-a4/audi-a4-inchrieri-auto-satu-mare.png', // Audi A4 Manual in subfolder
        'audi-a6-automat': 'audi-a6/audi-a6-veiron-auto-satu-mare.png', // Updated Audi A6 VEIRON image
        'audi-q5-nou': 'audi-q5/audi-q5-luxury-automata.png', // Updated Audi Q5 luxury image
        'bmw-seria-5-gt': 'bmw-530-gt/bmw-seria5-gt-satu-mare.png', // Updated BMW Seria 5 GT image
        'bmw-seria-5-automat-nou': 'bmw-seria5-sedan/bmw-seria5-sedan-luxury.png', // BMW Seria 5 Sedan luxury image
        'bmw-seria-5-combi-automat': 'bmw-seria5-touring/bmw-seria5-touring-satu-mare.png', // BMW Seria 5 COMBI AUTOMAT image
        'bmw-seria-5-combi-manual': 'bmw-seria5-touring/bmw-seria5-touring-satu-mare.png', // BMW Seria 5 COMBI MANUAL image
        'bmw-x1-automat': 'bmw-x1-2025/bmw-x1-suv-satu-mare-veiron.png', // BMW X1 SUV image
        'bmw-x3-nou': 'bmw-x3-hybrid/bmw-x3-hybrid-veiron-auto.png', // BMW X3 HYBRID image
        'honda-accord-automat': 'honda-accord-automat/honda-accord-automat-veiron-auto.png', // Honda Accord image
        'mazda-6-manual': 'mazda-6-hatchback/mazda-6-rent-a-car.png', // Mazda 6 image
        'mazda-6': 'Mazda_6.jpg',
        'mercedes-e-class': 'mercedes-e-class/mercedes-e-class-luxury-satu-mare.png',
        'mercedes-e-class-sedan': 'mercedes-e-class.jpg',
        'mercedes-glc': 'mercedes-glc/mercedes-glc-luxury-suv-veiron-auto.png',
        'mercedes-glc-automat': 'mercedes-glc/mercedes-glc-luxury-suv-veiron-auto.png',
        'mercedes-gle': 'mercedes-gle/mercedes-gle-suv-satu-mare.png',
        'mercedes-gle-automat': 'mercedes-gle/mercedes-gle-suv-satu-mare.png',
        'vw-passat-cc-automat': 'vw-passat-cc-r-line/inchiriere-vw-pasat-cc-scaune-incalzite-satu-mare.png', // VW Passat CC image
        'vw-passat-automat': 'vw-passat-combi/vw-passat-combi-2012-inchirieri-auto-ieftine.png', // VW Passat Combi image
        'vw-polo-manual': 'vw-polo/vw-polo-inchirieri-ieftine-masini-satu-mare.png', // VW Polo Manual
        'vw-polo-automat': 'vw-polo/vw-polo-inchirieri-ieftine-masini-satu-mare.png', // VW Polo Automat
        'toyota-rav4': 'toyota-rav4/toyota-rav4-suv-rent-a-car.png',
        'toyota-rav4-suv': 'toyota-rav4/toyota-rav4-suv-rent-a-car.png',
        'toyota-rav4-automat': 'toyota-rav4/toyota-rav4-suv-rent-a-car.png',
        'renault-traffic-van': 'renault-traffic-8plus1/renault-trafic-pasageri-pret-avantajos.png',
        'renault-traffic-8plus1': 'renault-traffic-8plus1/renault-trafic-pasageri-pret-avantajos.png',
        'renault-trafic-8-plus-1-automat': 'renault-traffic-8plus1/renault-trafic-pasageri-pret-avantajos.png',
        'renault-koleos-suv': 'renault-koleos/renault-koleos-satu-mare-ieftin.png',
        'mitsubishi-outlander-automat': 'mitsubishi-outlander/mitsubishi_outlander_suv_rent_a_car_satu_mare.png', // Mitsubishi Outlander SUV image
        'seat-alhambra-7-locuri-automat': 'seat-alhambra/seat_alhambra_7_locuri_inchiriere.png', // Seat Alhambra 7 locuri automat
        'seat-alhambra-manual-7-locuri': 'seat-alhambra/seat_alhambra_7_locuri_inchiriere.png', // Seat Alhambra 7 locuri manual
        'renault-megane-manual': 'renault-megane/renault_megane_manual_rent_a_car.png', // Renault Megane manual
        'seat-exeo-manual': 'seat-exeo/seat_exeo_manual_inchiriere_auto.png', // Seat Exeo manual
        'seat-exeo-combi-manual': 'seat-exeo-combi/seat_exeo_combi_masina_ieftina_veiron_auto.png', // Seat Exeo Combi manual
        'skoda-kamiq-automat': 'skoda-kamiq/skoda_kamiq_suv_4x4_satu_mare.png', // Skoda Kamiq SUV
        'skoda-scala-automat': 'skoda-scala/skoda-scala-automatic-satu-mare.png', // Skoda Scala compact
        'volvo-xc40-automat': 'volvo-xc40/volvo-xc40-automat-inchirieri-aeroport-budapesta-satumare.png', // Volvo XC40 SUV
        'vw-golf-manual': 'vw-golf-4/inchirieri-auto-ieftine-satu-mare-vw-golf-4.png', // VW Golf 4 manual
        'vw-jetta-manual': 'vw-jetta-2.0/vw-jetta-2-0-diese-satu-mare-ieftin.png', // VW Jetta 2.0 manual
        'vw-t-cross-automat': 'vw-t-cross/vw-t-cross-automat-rent-a-car-satu-mare-veiron-auto.png', // VW T-Cross automat
        'vw-tiguan-automat': 'vw-tiguan/vw-tiguan-veiron-auto-satu-mare.png', // VW Tiguan automat
        'vw-touran': 'vw-touran/veiron-rent-vw-touran-inchirieri-auto.png', // VW Touran image
        'ssangyong-actyon-automat': 'ssangyong-actyon/kgm-actyon-benzina-gold-auriu-inchiriere-satu-mare.png', // SsangYong Actyon
        'ssangyong-korando': 'ssangyong-korando/ssangyong-kgm-korando-daune-auto-satu-mare.png', // SsangYong Korando
        'toyota-avensis-combi': 'toyota-avensis-combi/toyota-avensis-combi-solutionare-daune-auto-satu-mare.png' // Toyota Avensis Combi
    };
    
    // Check if we have a specific image for this car
    const imageFile = carImageMap[carId];
    if (imageFile) {
        return [{
            file: imageFile, // Direct filename - will be handled specially in getImagePath
            alt: `${carName} - imagine principală`,
            isDirectImage: true // Flag to indicate this is a direct car image, not in gallery
        }];
    }
    
    // If no specific image found, use placeholder
    console.warn(`No specific image found for car: ${carId} (${carName}), using placeholder`);
    return [{
        file: 'placeholder.jpg',
        alt: `${carName} - imagine principală`,
        isDirectImage: true
    }];
}

// Car Category Mapping based on pricing and vehicle type
function mapCarCategory(car) {
    const name = car.name.toLowerCase();
    const tier1Price = car.pricing.tier1;
    
    // Van category
    if (name.includes('trafic') || name.includes('caravelle') || car.seats >= 7) {
        return 'van';
    }
    
    // Luxury category (premium brands and high prices)
    if (name.includes('mercedes') || name.includes('bmw') || tier1Price >= 90) {
        return 'luxury';
    }
    
    // SUV category
    if (name.includes('suv') || name.includes('rav4') || name.includes('x1') || 
        name.includes('xc40') || name.includes('xc60') || name.includes('kodiaq') || 
        name.includes('kamiq') || name.includes('t-cross') || name.includes('touareg') ||
        name.includes('outlander') || name.includes('tiguan') || name.includes('glc') ||
        name.includes('gle') || name.includes('q5') || name.includes('x3')) {
        return 'suv';
    }
    
    // Sedan category  
    if (name.includes('sedan') || name.includes('octavia') || name.includes('passat') ||
        name.includes('a4') || name.includes('a6') || name.includes('seria 5') || 
        name.includes('e klasse') || name.includes('accord') || name.includes('exeo')) {
        return 'sedan';
    }
    
    // Compact category
    if (name.includes('scala') || name.includes('a3') || name.includes('golf') ||
        name.includes('polo') || name.includes('megane') || name.includes('jetta') ||
        name.includes('combi')) {
        return 'compact';
    }
    
    // Economic category (lowest tier)
    if (tier1Price <= 45) {
        return 'economic';
    }
    
    // Default fallback
    return 'sedan';
}

// Map transmission types
function mapTransmission(car) {
    if (car.transmission === 'automat') return 'automatic';
    if (car.transmission === 'manual') return 'manual';
    return 'automatic'; // Default
}

// Map passenger count
function mapPassengers(car) {
    if (car.seats) return car.seats;
    if (car.name.includes('8+1') || car.name.includes('9')) return 9;
    if (car.name.includes('7 locuri') || car.name.includes('7 LOCURI')) return 7;
    return 5; // Default
}

// Extract brand/manufacturer from car name
function extractBrand(carName) {
    const name = carName.toUpperCase();

    // Map specific brand patterns
    if (name.includes('MERCEDES')) return 'MERCEDES';
    if (name.includes('BMW')) return 'BMW';
    if (name.includes('AUDI')) return 'AUDI';
    if (name.includes('RENAULT')) return 'RENAULT';
    if (name.includes('SKODA')) return 'SKODA';
    if (name.includes('VW') || name.includes('VOLKSWAGEN')) return 'VOLKSWAGEN';
    if (name.includes('TOYOTA')) return 'TOYOTA';
    if (name.includes('SEAT')) return 'SEAT';
    if (name.includes('VOLVO')) return 'VOLVO';
    if (name.includes('MAZDA')) return 'MAZDA';
    if (name.includes('HONDA')) return 'HONDA';
    if (name.includes('MITSUBISHI')) return 'MITSUBISHI';
    if (name.includes('SSANGYONG')) return 'SSANGYONG';

    // Fallback: first word before space
    return name.split(' ')[0];
}

// Convert EUR to RON
function convertEurToRon(eurPrice) {
    return Math.round(eurPrice * 5.07);
}

// Helper function to get image path
function getImagePath(modelId, imageFile, isDirectImage = false) {
    if (isDirectImage) {
        // For direct images, the path already includes the full path from cars/ folder
        return `assets/images/cars/${imageFile}`;
    }
    return `assets/images/cars/${modelId}/gallery/${imageFile}`;
}

// Helper function to get fallback image
function getFallbackImage() {
    return 'assets/images/cars/placeholder.jpg';
}

// Dynamic Gallery System
function initDynamicGalleries() {
    const carCards = document.querySelectorAll('.car-card[data-model]');
    
    carCards.forEach((card, index) => {
        const modelId = card.dataset.model;
        const model = CAR_MODELS[modelId]; // May be undefined for new cars
        
        // Load gallery for both configured and new cars
        loadCarGallery(card, model, modelId, index + 1);
    });
}

function loadCarGallery(card, model, modelId, cardIndex) {
    const mainImage = card.querySelector('.main-image');
    const thumbsContainer = card.querySelector('.gallery-thumbs');
    
    if (!mainImage || !thumbsContainer) return;
    
    // Clear existing content
    thumbsContainer.innerHTML = '';
    

    
    // Get images from model configuration or use defaults
    let imageConfig;
    if (model && model.images) {
        imageConfig = model.images;
    } else {
        // Use default images for cars not in CAR_MODELS
        const carName = card.querySelector('.car-title')?.textContent || 'Mașină';
        imageConfig = getDefaultImages(modelId, carName);

    }
    
    // Load images with fallback
    const images = imageConfig.map(img => {
        const imagePath = getImagePath(modelId, img.file, img.isDirectImage);

        // Debug logging for Toyota RAV4
        if (modelId === 'toyota-rav4') {
            console.log('🚗 Toyota RAV4 Image Config:', {
                modelId,
                file: img.file,
                isDirectImage: img.isDirectImage,
                generatedPath: imagePath
            });
        }

        return {
            src: imagePath,
            alt: img.alt,
            fallback: getFallbackImage()
        };
    });
    
    // Set main image (first image) - check if images exist
    if (images.length > 0) {
        loadImageWithFallback(mainImage, images[0].src, images[0].fallback, images[0].alt);
    } else {
        // No images available, use fallback
        loadImageWithFallback(mainImage, '', getFallbackImage(), `${modelId} - imagine principală`);
    }
    
    // Generate thumbnails
    images.forEach((img, index) => {
        const thumb = document.createElement('img');
        thumb.alt = img.alt;
        thumb.className = `thumb-image ${index === 0 ? 'active' : ''}`;
        thumb.onclick = () => changeMainImageNew(cardIndex, thumb, img.src, img.fallback);
        
        // Load thumbnail with fallback
        loadImageWithFallback(thumb, img.src, img.fallback, img.alt);
        
        thumbsContainer.appendChild(thumb);
    });
}

function loadImageWithFallback(imgElement, primarySrc, fallbackSrc, altText) {
    imgElement.alt = altText;
    
    // Try to load primary image
    const testImage = new Image();
    testImage.onload = function() {
        imgElement.src = primarySrc;
    };
    testImage.onerror = function() {
        imgElement.src = fallbackSrc;
    };
    testImage.src = primarySrc;
}

function changeMainImageNew(cardId, clickedThumb, imageSrc, fallbackSrc) {
    const card = clickedThumb.closest('.car-card');
    const mainImage = card.querySelector('.main-image');
    const allThumbs = card.querySelectorAll('.thumb-image');
    
    // Update active state
    allThumbs.forEach(thumb => thumb.classList.remove('active'));
    clickedThumb.classList.add('active');
    
    // Update main image with fallback
    loadImageWithFallback(mainImage, imageSrc, fallbackSrc, clickedThumb.alt);
}

// Car Fleet Management System with Dynamic Pagination
class CarFleet {
    constructor() {
        this.filters = {
            category: document.getElementById('category-filter'),
            passengers: document.getElementById('passengers-filter'),
            transmission: document.getElementById('transmission-filter'),
            sort: document.getElementById('sort-filter'),
            minPrice: document.getElementById('min-price-filter'),
            maxPrice: document.getElementById('max-price-filter')
        };
        this.clearFiltersBtn = document.getElementById('clear-filters');
        this.noResultsElement = document.getElementById('no-results');
        this.carsGrid = document.getElementById('cars-grid');
        this.allCars = [];

        this.init();
    }

    async init() {
        try {
            // Load car data from JSON
            await this.loadCarData();

            // Populate dynamic filters
            this.populateBrandFilter();
            this.populateColorFilter();

            // Clear existing hardcoded cars
            this.carsGrid.innerHTML = '';

            // Add event listeners
            Object.values(this.filters).forEach(filter => {
                if (filter.id === 'min-price-filter' || filter.id === 'max-price-filter') {
                    // Use 'input' event for real-time filtering on price inputs
                    filter.addEventListener('input', () => this.applyFilters());
                } else {
                    filter.addEventListener('change', () => this.applyFilters());
                }
            });

            this.clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());

            // Search filter with debounce
            let searchTimeout;
            const searchInput = document.getElementById('search-filter');
            if (searchInput) {
                searchInput.addEventListener('input', () => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        this.applyFilters();
                    }, 300); // 300ms delay
                });
            }

            // Brand filter
            const brandFilter = document.getElementById('brand-filter');
            if (brandFilter) {
                brandFilter.addEventListener('change', () => this.applyFilters());
            }

            // Color filter
            const colorFilter = document.getElementById('color-filter');
            if (colorFilter) {
                colorFilter.addEventListener('change', () => this.applyFilters());
            }

            // Check URL parameters on load
            this.handleUrlParameters();
            
            // Create pagination controls
            this.createPaginationControls();
            
            // Initial filter application and render
            this.applyFilters();
            
            // Mobile sidebar collapse functionality
            this.initMobileSidebar();
            
            logger.log('Car Fleet System initialized with', this.allCars.length, 'cars');
        } catch (error) {
            logger.error('Failed to initialize Car Fleet System:', error);
            this.showErrorMessage();
        }
    }
    
    async loadCarData() {
        try {
            const response = await fetch('assets/json/car-pricing-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            carPricingData = await response.json();
            
            // Process cars and add display metadata
            this.allCars = carPricingData.cars.map(car => {
                const enhancedCar = {
                    ...car,
                    category: window.CarEnhancements ? window.CarEnhancements.enhancedMapCarCategory(car) : mapCarCategory(car),
                    displayTransmission: mapTransmission(car),
                    displayPassengers: mapPassengers(car),
                    ronPrice: convertEurToRon(car.pricing.tier1),
                    displayName: this.formatCarName(car.name)
                };
                
                return enhancedCar;
            });
            
            logger.log('Loaded', this.allCars.length, 'cars from JSON');
        } catch (error) {
            logger.error('Error loading car data:', error);
            throw error;
        }
    }

    formatCarName(name) {
        // Clean up car names for display, but keep AUTOMAT/MANUAL for specific models to avoid confusion
        if (name.includes('BMW SERIA 5 COMBI')) {
            return name; // Keep the full name including AUTOMAT/MANUAL for BMW COMBI
        }
        // Keep AUTOMAT/MANUAL for SEAT ALHAMBRA to differentiate between the two models
        if (name.includes('SEAT ALHAMBRA')) {
            return name; // Keep the full name including AUTOMAT/MANUAL
        }
        // Add HYBRID to BMW X3 NOU
        if (name.includes('BMW X3 NOU')) {
            return name.replace('BMW X3 NOU', 'BMW X3 HYBRID').replace(/AUTOMAT|MANUAL/gi, '').trim();
        }
        // Change BMW SERIA 5 AUTOMAT NOU to BMW SERIA 5 SEDAN PREMIUM
        if (name.includes('BMW SERIA 5 AUTOMAT NOU')) {
            return name.replace('BMW SERIA 5 AUTOMAT NOU', 'BMW SERIA 5 SEDAN PREMIUM').trim();
        }
        return name.replace(/AUTOMAT|MANUAL/gi, '').trim();
    }

    createPaginationControls() {
        // Create pagination container after main cars area
        const mainCarsArea = document.querySelector('.main-cars-area');
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container';
        paginationContainer.id = 'pagination-container';
        
        paginationContainer.innerHTML = `
            <div class="pagination-info">
                <span id="results-count">Încărcare...</span>
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn prev-btn" id="prev-page" disabled>
                    <i class="fas fa-chevron-left"></i> Anterior
                </button>
                <div class="pagination-numbers" id="pagination-numbers"></div>
                <button class="pagination-btn next-btn" id="next-page" disabled>
                    Următor <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        
        mainCarsArea.appendChild(paginationContainer);
        
        // Add event listeners
        document.getElementById('prev-page').addEventListener('click', () => this.goToPage(currentPage - 1));
        document.getElementById('next-page').addEventListener('click', () => this.goToPage(currentPage + 1));
    }

    updatePaginationControls() {
        const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE);
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const numbersContainer = document.getElementById('pagination-numbers');
        const resultsCount = document.getElementById('results-count');
        
        // Update buttons state
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
        
        // Update results count
        const startItem = ((currentPage - 1) * CARS_PER_PAGE) + 1;
        const endItem = Math.min(currentPage * CARS_PER_PAGE, filteredCars.length);
        resultsCount.textContent = `${startItem}-${endItem} din ${filteredCars.length} mașini`;
        
        // Generate page numbers
        numbersContainer.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust start if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // First page + ellipsis if needed
        if (startPage > 1) {
            this.createPageButton(1, numbersContainer);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                numbersContainer.appendChild(ellipsis);
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            this.createPageButton(i, numbersContainer);
        }
        
        // Ellipsis + last page if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                numbersContainer.appendChild(ellipsis);
            }
            this.createPageButton(totalPages, numbersContainer);
        }
    }

    createPageButton(pageNum, container) {
        const button = document.createElement('button');
        button.className = `pagination-num ${pageNum === currentPage ? 'active' : ''}`;
        button.textContent = pageNum;
        button.addEventListener('click', () => this.goToPage(pageNum));
        container.appendChild(button);
    }

    goToPage(page) {
        const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE);
        if (page < 1 || page > totalPages) return;
        
        currentPage = page;
        this.renderCurrentPage();
        this.updatePaginationControls();
        
        // Smooth scroll to top of cars grid
        this.carsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    renderCurrentPage() {
        const startIndex = (currentPage - 1) * CARS_PER_PAGE;
        const endIndex = startIndex + CARS_PER_PAGE;
        const pageCars = filteredCars.slice(startIndex, endIndex);
        
        // Clear grid
        this.carsGrid.innerHTML = '';
        
        // Render cars
        pageCars.forEach(car => {
            const carElement = this.createCarCard(car);
            this.carsGrid.appendChild(carElement);
        });
        
        // Initialize galleries for new cars
        initDynamicGalleries();
    }

    showErrorMessage() {
        this.carsGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Eroare la încărcarea mașinilor</h3>
                <p>Ne pare rău, dar nu am putut încărca lista cu mașini. Vă rugăm să reîncărcați pagina.</p>
                <button class="btn-reload" onclick="window.location.reload()">
                    <i class="fas fa-redo"></i> Reîncarcă pagina
                </button>
            </div>
        `;
    }

    /**
     * Inițializează funcționalitatea de collapse pentru sidebar pe mobile
     */
    initMobileSidebar() {
        const sidebarHeader = document.querySelector('.sidebar-header');
        const sidebar = document.querySelector('.sidebar-filters');
        
        if (sidebarHeader && sidebar) {
            sidebarHeader.addEventListener('click', () => {
                // Only toggle on mobile
                if (window.innerWidth <= 768) {
                    sidebar.classList.toggle('collapsed');
                }
            });
            
            // Initialize collapsed state on mobile
            const handleResize = () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.add('collapsed');
                } else {
                    sidebar.classList.remove('collapsed');
                }
            };
            
            // Initial check
            handleResize();
            
            // Listen for window resize
            window.addEventListener('resize', handleResize);
        }
    }

    handleUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Set filters based on URL parameters
        if (urlParams.has('category')) {
            this.filters.category.value = urlParams.get('category');
        }
        if (urlParams.has('passengers')) {
            this.filters.passengers.value = urlParams.get('passengers');
        }
        if (urlParams.has('transmission')) {
            this.filters.transmission.value = urlParams.get('transmission');
        }
        if (urlParams.has('sort')) {
            this.filters.sort.value = urlParams.get('sort');
        }
        
        // Handle booking form parameters
        if (urlParams.has('location')) {
            const location = urlParams.get('location');
            logger.log('Locația de ridicare:', location);
            // Poți adăuga logică pentru afișarea locației
        }
        
        if (urlParams.has('pickupDate') && urlParams.has('dropoffDate')) {
            const pickupDate = urlParams.get('pickupDate');
            const dropoffDate = urlParams.get('dropoffDate');
            logger.log('Perioada închirierii:', pickupDate, '-', dropoffDate);
            
            // Calculează numărul de zile pentru afișare
            const days = this.calculateRentalDays(pickupDate, dropoffDate);
            if (days > 0) {
                // Afișează perioada în interface
                this.displayRentalPeriod(pickupDate, dropoffDate, days);
            }
        }
        
        if (urlParams.has('driverAge')) {
            const driverAge = parseInt(urlParams.get('driverAge'));
            logger.log('Vârsta șoferului:', driverAge);
            
            // Poate fi folosit pentru filtrarea mașinilor disponibile pentru vârsta respectivă
            this.filterByDriverAge(driverAge);
        }

        // Show a message if coming from reservation form
        if (urlParams.has('from') && urlParams.get('from') === 'reservation') {
            this.showFilterMessage();
        }
    }

    showFilterMessage() {
        const message = document.createElement('div');
        message.className = 'filter-message';
        message.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                Mașinile afișate corespund criteriilor selectate în formularul de rezervare.
                <button class="btn-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        const container = document.querySelector('.cars-section .container');
        container.insertBefore(message, this.carsGrid);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 5000);
    }

    // Generate color cassette HTML for cars with color data
    generateColorCassette(carId) {
        const colorData = CAR_COLORS[carId];
        if (!colorData) return '';
        
        return `
            <div class="color-cassette">
                <div class="color-label">Culoare Mașină</div>
                <div class="color-display">
                    <div class="color-swatch ${colorData.color}"></div>
                    <div class="color-text">${colorData.colorRO}</div>
                </div>
            </div>
        `;
    }

    createCarCard(car) {
        const carElement = document.createElement('div');
        carElement.className = 'car-card fade-in';
        carElement.setAttribute('data-category', car.category);
        carElement.setAttribute('data-passengers', car.displayPassengers);
        carElement.setAttribute('data-transmission', car.displayTransmission);
        carElement.setAttribute('data-price', car.ronPrice);
        carElement.setAttribute('data-model', car.id);
        
        // Use enhanced mappings if available
        const fuelType = window.CarEnhancements ? 
            window.CarEnhancements.mapFuelType(car) : 
            (car.name.toLowerCase().includes('diesel') ? 'Diesel' : 'Benzină');
        
        const baggage = window.CarEnhancements ? 
            window.CarEnhancements.mapBaggageCapacity(car) : 
            (car.category === 'van' ? '4 bagaje mari' : '3 bagaje mari');
        
        // Determine main image src - use direct path for Mercedes and Audi Q3
        let mainImageSrc = '';
        if (car.id === 'mercedes-e-klasse' || car.id === 'mercedes-e-class') {
            mainImageSrc = 'assets/images/cars/mercedes-e-class/mercedes-e-class-luxury-satu-mare.png';
        } else if (car.id === 'audi-q3') {
            mainImageSrc = 'assets/images/cars/audi-q3/audi-q3-2011-veiron-auto-rent.png';
        }
        
        carElement.innerHTML = `
            <div class="car-gallery">
                <div class="gallery-main">
                    <img src="${mainImageSrc}" alt="${car.displayName}" class="main-image">
                </div>
                <div class="gallery-thumbs">
                    <!-- Images will be loaded dynamically -->
                </div>
            </div>
            <div class="car-info">
                <h3 class="car-title">${car.displayName}</h3>
                <p class="car-similar-text">sau asemănător</p>
                <p class="car-description">${window.CarEnhancements ? window.CarEnhancements.getEnhancedDescription(car) : this.getCarDescription(car)}</p>
                ${this.generateColorCassette(car.id)}
                <div class="description-spacer"></div>
                <div class="car-features">
                    <div class="feature">
                        <i class="fas fa-user"></i>
                        <span>${car.displayPassengers} pasageri</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-suitcase"></i>
                        <span>${baggage}</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-gauge"></i>
                        <span>${car.displayTransmission === 'automatic' ? 'Automată' : 'Manuală'}</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-gas-pump"></i>
                        <span>${fuelType}</span>
                    </div>
                </div>
                <div class="car-included">
                    <i class="fas fa-check"></i>
                    <span>300 kilometri incluși</span>
                </div>
                <div class="car-price">
                    <span class="price-amount">${car.ronPrice}</span>
                    <span class="price-currency">lei / zi</span>
                </div>
                <button class="btn-reserve" onclick="selectCar('${car.id}')">
                    <i class="fas fa-calendar-alt"></i>
                    Rezervă acum
                </button>
            </div>
        `;
        
        return carElement;
    }

    getCarDescription(car) {
        const category = car.category;
        const transmission = car.displayTransmission === 'automatic' ? 'Automată' : 'Manuală';
        
        switch (category) {
            case 'van':
                return `Van ${car.displayPassengers} locuri - Perfect pentru călătorii în grup`;
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

    applyFilters() {
        const searchFilter = document.getElementById('search-filter');
        const brandFilter = document.getElementById('brand-filter');
        const colorFilter = document.getElementById('color-filter');

        const activeFilters = {
            category: this.filters.category.value,
            passengers: this.filters.passengers.value,
            transmission: this.filters.transmission.value,
            minPrice: this.filters.minPrice.value ? parseFloat(this.filters.minPrice.value) : null,
            maxPrice: this.filters.maxPrice.value ? parseFloat(this.filters.maxPrice.value) : null,
            search: searchFilter ? searchFilter.value.toLowerCase().trim() : '',
            brand: brandFilter ? brandFilter.value : '',
            color: colorFilter ? colorFilter.value : ''
        };

        // Filter cars from all available cars
        filteredCars = this.allCars.filter(car => {
            let shouldShow = true;

            // Category filter
            if (activeFilters.category && car.category !== activeFilters.category) {
                shouldShow = false;
            }

            // Passengers filter
            if (activeFilters.passengers) {
                const carPassengers = car.displayPassengers;
                const requiredPassengers = activeFilters.passengers.includes('+')
                    ? parseInt(activeFilters.passengers)
                    : parseInt(activeFilters.passengers);

                if (activeFilters.passengers.includes('+')) {
                    if (carPassengers < requiredPassengers) {
                        shouldShow = false;
                    }
                } else {
                    if (carPassengers > requiredPassengers) {
                        shouldShow = false;
                    }
                }
            }

            // Transmission filter
            if (activeFilters.transmission && car.displayTransmission !== activeFilters.transmission) {
                shouldShow = false;
            }

            // Price filter
            if (activeFilters.minPrice !== null || activeFilters.maxPrice !== null) {
                const carPrice = car.ronPrice;
                if (activeFilters.minPrice !== null && carPrice < activeFilters.minPrice) {
                    shouldShow = false;
                }
                if (activeFilters.maxPrice !== null && carPrice > activeFilters.maxPrice) {
                    shouldShow = false;
                }
            }

            // Search filter
            if (activeFilters.search && activeFilters.search !== '') {
                const searchText = `${car.name} ${car.displayCategory} ${car.displayTransmission}`.toLowerCase();
                if (!searchText.includes(activeFilters.search)) {
                    shouldShow = false;
                }
            }

            // Brand filter
            if (activeFilters.brand && activeFilters.brand !== '') {
                const carBrand = extractBrand(car.name);
                if (carBrand !== activeFilters.brand) {
                    shouldShow = false;
                }
            }

            // Color filter
            if (activeFilters.color && activeFilters.color !== '') {
                const colorData = CAR_COLORS[car.id];
                if (!colorData || colorData.color !== activeFilters.color) {
                    shouldShow = false;
                }
            }

            return shouldShow;
        });

        // Apply sorting
        this.sortCars();

        // Reset to page 1 when filters change
        currentPage = 1;

        // Show/hide no results message
        if (filteredCars.length === 0) {
            this.noResultsElement.style.display = 'block';
            this.carsGrid.style.display = 'none';
            document.getElementById('pagination-container').style.display = 'none';
        } else {
            this.noResultsElement.style.display = 'none';
            this.carsGrid.style.display = 'grid';
            document.getElementById('pagination-container').style.display = 'block';
            
            // Render current page
            this.renderCurrentPage();
            this.updatePaginationControls();
        }

        // Update filter button states
        this.updateFilterStates();
    }

    sortCars() {
        const sortType = this.filters.sort.value;
        
        if (sortType === 'name' || sortType === 'name-desc') {
            filteredCars.sort((a, b) => {
                const nameA = a.displayName;
                const nameB = b.displayName;
                
                if (sortType === 'name') {
                    return nameA.localeCompare(nameB, 'ro');
                } else {
                    return nameB.localeCompare(nameA, 'ro');
                }
            });
        } else if (sortType === 'price-asc' || sortType === 'price-desc') {
            filteredCars.sort((a, b) => {
                const priceA = a.ronPrice;
                const priceB = b.ronPrice;
                
                if (sortType === 'price-asc') {
                    return priceA - priceB;
                } else {
                    return priceB - priceA;
                }
            });
        }
    }

    updateFilterStates() {
        Object.values(this.filters).forEach(filter => {
            if (filter.value) {
                filter.classList.add('filter-active');
            } else {
                filter.classList.remove('filter-active');
            }
        });
    }

    clearAllFilters() {
        Object.values(this.filters).forEach(filter => {
            filter.value = '';
            filter.classList.remove('filter-active');
        });

        // Reset new filters (search, brand, color)
        const searchFilter = document.getElementById('search-filter');
        const brandFilter = document.getElementById('brand-filter');
        const colorFilter = document.getElementById('color-filter');
        if (searchFilter) searchFilter.value = '';
        if (brandFilter) brandFilter.value = '';
        if (colorFilter) colorFilter.value = '';

        // Reset to page 1
        currentPage = 1;

        this.applyFilters();

        // Update URL to remove parameters
        const url = new URL(window.location);
        url.search = '';
        window.history.replaceState({}, '', url);
    }

    /**
     * Populează dinamic filtrul de brand cu mărcile disponibile
     */
    populateBrandFilter() {
        const brandFilter = document.getElementById('brand-filter');
        if (!brandFilter) return;

        // Extract unique brands from all cars
        const brandsSet = new Set();
        this.allCars.forEach(car => {
            const brand = extractBrand(car.name);
            if (brand) {
                brandsSet.add(brand);
            }
        });

        // Sort brands alphabetically
        const brands = Array.from(brandsSet).sort();

        // Clear existing options except the first one (Toate mărcile)
        while (brandFilter.options.length > 1) {
            brandFilter.remove(1);
        }

        // Add brand options
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            // Capitalize first letter for display
            option.textContent = brand.charAt(0) + brand.slice(1).toLowerCase();
            brandFilter.appendChild(option);
        });
    }

    /**
     * Populează dinamic filtrul de culoare cu culorile disponibile
     */
    populateColorFilter() {
        const colorFilter = document.getElementById('color-filter');
        if (!colorFilter) return;

        // Extract unique colors from CAR_COLORS based on existing cars
        const colorsSet = new Set();
        const colorLabels = {
            'white': 'Alb',
            'grey': 'Gri',
            'black': 'Negru',
            'gold': 'Auriu',
            'blue': 'Albastru',
            'orange': 'Portocaliu'
        };

        this.allCars.forEach(car => {
            const colorData = CAR_COLORS[car.id];
            if (colorData && colorData.color) {
                colorsSet.add(colorData.color);
            }
        });

        // Sort colors in specific order
        const colorOrder = ['white', 'grey', 'black', 'gold', 'blue', 'orange'];
        const colors = Array.from(colorsSet).sort((a, b) => {
            return colorOrder.indexOf(a) - colorOrder.indexOf(b);
        });

        // Clear existing options except the first one (Toate culorile)
        while (colorFilter.options.length > 1) {
            colorFilter.remove(1);
        }

        // Add color options
        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = colorLabels[color] || color;
            colorFilter.appendChild(option);
        });
    }

    /**
     * Calculează numărul de zile între două date
     * @param {string} startDate - Data de început (format YYYY-MM-DD)
     * @param {string} endDate - Data de sfârșit (format YYYY-MM-DD)
     * @returns {number} Numărul de zile
     */
    calculateRentalDays(startDate, endDate) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            if (start > end) return 0;
            
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        } catch (error) {
            console.warn('Eroare la calcularea zilelor:', error);
            return 0;
        }
    }
    
    /**
     * Afișează perioada de închiriere în interface
     * @param {string} pickupDate - Data ridicării
     * @param {string} dropoffDate - Data returnării  
     * @param {number} days - Numărul de zile
     */
    displayRentalPeriod(pickupDate, dropoffDate, days) {
        // Găsește sau creează containerul pentru afișarea perioadei
        let periodContainer = document.getElementById('rental-period-info');
        
        if (!periodContainer) {
            periodContainer = document.createElement('div');
            periodContainer.id = 'rental-period-info';
            periodContainer.className = 'filter-message';
            
            // Inserează înainte de grid-ul cu mașini
            const grid = document.getElementById('cars-grid');
            grid.parentNode.insertBefore(periodContainer, grid);
        }
        
        const startDateFormatted = this.formatRomanianDate(pickupDate);
        const endDateFormatted = this.formatRomanianDate(dropoffDate);
        
        periodContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-calendar-alt"></i>
                <span>Perioada închirierii: <strong>${startDateFormatted}</strong> - <strong>${endDateFormatted}</strong> 
                (${days} ${days === 1 ? 'zi' : 'zile'})</span>
            </div>
        `;
    }
    
    /**
     * Formatează o dată pentru afișare în română
     * @param {string} dateString - Data în format YYYY-MM-DD
     * @returns {string} Data formatată
     */
    formatRomanianDate(dateString) {
        try {
            const date = new Date(dateString);
            const months = [
                'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
                'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'
            ];
            
            return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        } catch (error) {
            return dateString; // Returnează data originală în caz de eroare
        }
    }
    
    /**
     * Filtrează mașinile pe baza vârstei șoferului
     * @param {number} age - Vârsta șoferului
     */
    filterByDriverAge(age) {
        // Această funcție poate fi extinsă pentru a aplica restricții pe vârstă
        if (age < 21) {
            logger.log('Șofer tânăr - se pot aplica restricții pentru anumite categorii de vehicule');
        } else if (age > 70) {
            logger.log('Șofer senior - se pot aplica restricții pentru anumite categorii de vehicule');
        }
        
        // Aici poți adăuga logica specifică pentru restricțiile pe vârstă
        // De exemplu, să ascunzi mașinile sport pentru șoferii tineri
    }
}

// Gallery functionality
function changeMainImage(cardId, thumbElement) {
    const mainImage = document.getElementById(`main-img-${cardId}`);
    const allThumbs = thumbElement.closest('.gallery-thumbs').querySelectorAll('.thumb-image');
    
    // Update main image
    mainImage.src = thumbElement.src;
    mainImage.alt = thumbElement.alt;
    
    // Update active thumb
    allThumbs.forEach(thumb => thumb.classList.remove('active'));
    thumbElement.classList.add('active');
    
    // Add animation
    mainImage.style.opacity = '0.7';
    setTimeout(() => {
        mainImage.style.opacity = '1';
    }, 150);
}

// Car selection functionality
function selectCar(carId) {
    // Get current URL parameters to preserve any filtering context
    const currentParams = new URLSearchParams(window.location.search);
    
    // Add car selection parameter
    currentParams.set('selectedCar', carId);
    currentParams.set('step', '2'); // Go directly to step 2 (car selection)
    
    // Redirect to booking page
    window.location.href = `booking.html?${currentParams.toString()}`;
}

// Clear all filters (global function for no-results button)
function clearAllFilters() {
    if (window.carFleet) {
        window.carFleet.clearAllFilters();
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize car fleet system
    window.carFleet = new CarFleet();
    
    // Initialize mobile menu
    initMobileMenu();

    // Add CSS for filter message if not already present
    if (!document.getElementById('filter-message-styles')) {
        const styles = document.createElement('style');
        styles.id = 'filter-message-styles';
        styles.textContent = `
            .filter-message {
                margin-bottom: 20px;
            }
            
            .alert {
                padding: 15px 20px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 0.95rem;
            }
            
            .alert-info {
                background-color: #e3f2fd;
                color: #1976d2;
                border: 1px solid #bbdefb;
            }
            
            .alert i {
                margin-right: 10px;
            }
            
            .btn-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: background-color 0.2s;
            }
            
            .btn-close:hover {
                background-color: rgba(0,0,0,0.1);
            }
        `;
        document.head.appendChild(styles);
    }

    // Initialize Image Zoom functionality
    initImageZoom();
    
    // Initialize Dynamic Gallery Loading
    initDynamicGalleries();

    logger.log('Parc Auto page loaded successfully');
});

// Image Zoom System
let currentZoomData = {
    carId: null,
    imageIndex: 0,
    images: [],
    carTitle: ''
};

function initImageZoom() {
    // Add click handlers to all gallery images
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('main-image') || e.target.classList.contains('thumb-image')) {
            const carCard = e.target.closest('.car-card');
            if (carCard) {
                openImageZoom(e.target, carCard);
            }
        }
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('image-zoom-modal');
        if (modal && modal.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeImageZoom();
                    break;
                case 'ArrowLeft':
                    previousImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });

    // Add double-click zoom on zoom image
    const zoomImg = document.getElementById('zoom-image');
    if (zoomImg) {
        zoomImg.addEventListener('click', function() {
            this.classList.toggle('zoomed');
        });
    }
}

function openImageZoom(clickedImage, carCard) {
    const modal = document.getElementById('image-zoom-modal');
    const zoomImg = document.getElementById('zoom-image');
    const carTitle = document.getElementById('zoom-car-title');
    const imageAlt = document.getElementById('zoom-image-alt');
    
    if (!modal || !zoomImg) return;

    // Get car data from new structure
    const modelId = carCard.dataset.model;
    const model = CAR_MODELS[modelId];
    const carTitleElement = carCard.querySelector('.car-title');
    const galleryImages = carCard.querySelectorAll('.thumb-image');
    
    if (!model) {
        console.warn(`Model ${modelId} not found for zoom`);
        return;
    }
    
    // Build images array from model configuration
    currentZoomData.images = model.images.map(img => ({
        src: getImagePath(modelId, img.file, img.isDirectImage),
        alt: img.alt,
        fallback: getFallbackImage()
    }));
    
    currentZoomData.carTitle = carTitleElement ? carTitleElement.textContent : model.title;
    
    // Find current image index
    if (clickedImage.classList.contains('main-image')) {
        // If main image clicked, find active thumb
        const activeThumb = carCard.querySelector('.thumb-image.active');
        currentZoomData.imageIndex = activeThumb ? 
            Array.from(galleryImages).indexOf(activeThumb) : 0;
    } else {
        // If thumb clicked
        currentZoomData.imageIndex = Array.from(galleryImages).indexOf(clickedImage);
    }

    // Update modal content
    updateZoomContent();
    
    // Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeImageZoom() {
    const modal = document.getElementById('image-zoom-modal');
    if (!modal) return;

    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);

    // Restore body scroll
    document.body.style.overflow = '';
    
    // Reset zoom
    const zoomImg = document.getElementById('zoom-image');
    if (zoomImg) {
        zoomImg.classList.remove('zoomed');
    }
}

function updateZoomContent() {
    const zoomImg = document.getElementById('zoom-image');
    const carTitle = document.getElementById('zoom-car-title');
    const imageAlt = document.getElementById('zoom-image-alt');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (!zoomImg || !currentZoomData.images.length) return;

    const currentImage = currentZoomData.images[currentZoomData.imageIndex];
    
    // Update image with fallback support
    loadImageWithFallback(zoomImg, currentImage.src, currentImage.fallback, currentImage.alt);
    
    // Update info
    if (carTitle) carTitle.textContent = currentZoomData.carTitle;
    if (imageAlt) imageAlt.textContent = currentImage.alt;
    
    // Update navigation buttons
    if (prevBtn) {
        prevBtn.disabled = currentZoomData.imageIndex === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentZoomData.imageIndex === currentZoomData.images.length - 1;
    }
    
    // Reset zoom state
    zoomImg.classList.remove('zoomed');
}

function previousImage() {
    if (currentZoomData.imageIndex > 0) {
        currentZoomData.imageIndex--;
        updateZoomContent();
    }
}

function nextImage() {
    if (currentZoomData.imageIndex < currentZoomData.images.length - 1) {
        currentZoomData.imageIndex++;
        updateZoomContent();
    }
}

// Global functions for HTML onclick handlers
window.closeImageZoom = closeImageZoom;
window.previousImage = previousImage;
window.nextImage = nextImage;

// Export for potential external use
window.CarFleetManager = {
    changeMainImage,
    selectCar,
    clearAllFilters,
    openImageZoom,
    closeImageZoom
};