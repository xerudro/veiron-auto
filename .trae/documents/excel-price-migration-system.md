# Sistem de Migrare Prețuri din Excel - VEIRONAUTO

## Prezentare Generală

Acest document descrie sistemul complet de migrare a prețurilor din fișierul Excel "Grila tarife .xlsx" în aplicația web VEIRONAUTO. Sistemul permite actualizarea automată a prețurilor mașinilor din datele Excel în fișierele JavaScript ale aplicației.

## Fișiere Create

### 1. car-pricing-data.json
**Locație:** `h:\VEIRONAUTO\public_html\assets\json\car-pricing-data.json`

**Descriere:** Fișier JSON cu datele extrase din Excel, structurat pentru dezvoltare.

**Structură:**
- `metadata`: Informații despre extragere (dată, rata de schimb, numărul de mașini)
- `cars`: Array cu datele fiecărei mașini
  - `name`: Numele mașinii din Excel
  - `pricing`: Prețuri pe tier-uri (tier1-tier4)
  - `guarantee`: Valoarea garanției
  - `insurance`: Valoarea asigurării

**Mașini incluse:**
- SKODA SCALA
- VW T-CROSS
- TOYOTA RAV4
- AUDI A6
- BMW SERIA 5 GT
- MERCEDES E KLASSE
- RENAULT KOLEOS
- AUDI A3
- RENAULT TRAFIC 8+1
- MAZDA 6

### 2. pricing-data-loader.js
**Locație:** `h:\VEIRONAUTO\public_html\assets\js\pricing-data-loader.js`

**Descriere:** Utilitar JavaScript pentru încărcarea și procesarea datelor de prețuri.

**Funcționalități:**
- `loadPricingData()`: Încarcă datele din JSON
- `getPricingForCar(carName)`: Obține prețurile pentru o mașină specifică
- `convertEURtoRON(eurAmount, exchangeRate)`: Conversie valutară
- `convertRONtoEUR(ronAmount, exchangeRate)`: Conversie valutară inversă
- `searchCarByName(searchTerm)`: Căutare mașini după nume
- `getAllCarNames()`: Lista tuturor numelor de mașini

### 3. price-migration-script.js
**Locație:** `h:\VEIRONAUTO\public_html\assets\js\price-migration-script.js`

**Descriere:** Script principal de migrare pentru actualizarea prețurilor.

**Clasa PriceMigrationScript:**
- `loadExcelData()`: Încarcă datele din Excel
- `loadCurrentBookingData()`: Încarcă datele curente din booking.js
- `loadCurrentBookingDataEN()`: Încarcă datele curente din booking-en.js
- `generateMigrationReport()`: Generează raport de migrare
- `generateUpdatedBookingJS()`: Generează fișierul booking.js actualizat
- `generateUpdatedBookingENJS()`: Generează fișierul booking-en.js actualizat

**Mapare Mașini:**
```javascript
const carMapping = {
    'audi-q3': 'audi-a3-automat',
    'mazda-6': 'mazda-6-manual',
    'audi-a6': 'audi-a6-automat',
    'bmw-gt-530': 'bmw-seria-5-automat-nou',
    'mercedes-e-class': 'mercedes-e-klasse',
    'renault-koleos': 'mitsubishi-outlander-automat',
    'toyota-rav4': 'toyota-rav4-automat',
    'renault-traffic-8-1': 'renault-trafic-8-plus-1-automat',
    'vw-t-cross': 'vw-t-cross-automat',
    'skoda-scala': 'skoda-scala-automat'
};
```

### 4. price-migration.html
**Locație:** `h:\VEIRONAUTO\public_html\admin\price-migration.html`

**Descriere:** Interfață web de administrare pentru gestionarea migrării prețurilor.

**Funcționalități:**
- Panou de control pentru încărcarea datelor Excel
- Generarea rapoartelor de migrare
- Previzualizarea modificărilor înainte de aplicare
- Maparea vizuală a mașinilor
- Log-uri de activitate
- Descărcarea fișierelor actualizate

**Clasa PriceMigrationAdmin:**
- `loadData()`: Încarcă datele Excel
- `generateReport()`: Generează raportul de migrare
- `previewChanges()`: Afișează previzualizarea modificărilor
- `applyChanges()`: Aplică modificările (generează fișierele actualizate)
- `displayCarMappings()`: Afișează maparea mașinilor
- `log(message, type)`: Sistem de logging

## Configurare și Utilizare

### Rata de Schimb
**Valoare implicită:** 1 EUR = 5.07 RON
**Configurabilă:** Da, prin interfața de administrare

### Tier-uri de Prețuri
1. **Tier 1:** 1-3 zile (prețul afișat pe site)
2. **Tier 2:** 4-7 zile
3. **Tier 3:** 8-14 zile
4. **Tier 4:** 15-30 zile

### Workflow de Migrare
1. **Încărcare Date:** Se încarcă datele din Excel și fișierele curente
2. **Generare Raport:** Se analizează diferențele și se mapează mașinile
3. **Previzualizare:** Se afișează modificările propuse
4. **Aplicare:** Se generează fișierele actualizate pentru descărcare

## Fișiere Sursă

### Excel Source
**Fișier:** `h:\VEIRONAUTO\public_html\assets\docs\Grila tarife .xlsx`
**Foaie:** "Foaie1"
**Interval:** A2:H49

### Fișiere Target
- `h:\VEIRONAUTO\public_html\assets\js\booking.js` (prețuri în RON)
- `h:\VEIRONAUTO\public_html\assets\js\booking-en.js` (prețuri în EUR)

## Caracteristici Tehnice

### Validare și Verificare
- Verificarea existenței mașinilor în ambele sisteme
- Validarea formatelor de prețuri
- Raportarea mașinilor nemapate
- Identificarea mașinilor noi din Excel

### Gestionarea Erorilor
- Try-catch pentru toate operațiunile asincrone
- Logging detaliat pentru debugging
- Validare input pentru rata de schimb
- Verificarea disponibilității fișierelor

### Performanță
- Încărcare asincronă a datelor
- Procesare batch pentru multiple mașini
- Optimizare pentru fișiere mari
- Cache pentru datele încărcate

## Securitate și Backup

### Măsuri de Siguranță
- Previzualizarea modificărilor înainte de aplicare
- Generarea fișierelor pentru descărcare (nu suprascriere directă)
- Validarea datelor de intrare
- Logging pentru audit trail

### Recomandări
1. **Backup:** Creați backup pentru fișierele booking.js și booking-en.js înainte de aplicarea modificărilor
2. **Testare:** Testați fișierele generate într-un mediu de dezvoltare înainte de producție
3. **Verificare:** Verificați prețurile afișate pe site după aplicarea modificărilor

## Acces și Utilizare

### URL Interfață Admin
`http://localhost:8000/admin/price-migration.html`

### Permisiuni
- Accesul la interfața de administrare necesită acces la directorul `/admin/`
- Fișierele generate pot fi descărcate direct din browser

## Mentenanță și Actualizări

### Actualizări Periodice
- Verificați periodic rata de schimb EUR/RON
- Actualizați maparea mașinilor când se adaugă modele noi
- Monitorizați log-urile pentru erori

### Extensibilitate
- Sistemul poate fi extins pentru alte surse de date
- Maparea mașinilor poate fi configurată dinamic
- Pot fi adăugate noi tier-uri de prețuri

## Suport și Documentație

### Fișiere de Referință
- `h:\VEIRONAUTO\docs\prd.txt` - Documentația produsului
- `h:\VEIRONAUTO\README.md` - Documentația proiectului

### Contact și Suport
Pentru întrebări tehnice sau probleme, consultați documentația proiectului sau contactați echipa de dezvoltare.

---

**Data creării:** $(date)
**Versiune:** 1.0
**Status:** Implementat și funcțional
**Autor:** Solo Requirement Agent
