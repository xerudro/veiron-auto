# VEIRONAUTO - Sistem de Migrare Prețuri din Excel

## Prezentare Generală

Acest sistem permite actualizarea automată a prețurilor mașinilor din fișierul Excel "Grila tarife .xlsx" în aplicația web VEIRONAUTO.

## Acces Rapid

### Interfața de Administrare
**URL:** [http://localhost:8000/admin/price-migration.html](http://localhost:8000/admin/price-migration.html)

### Fișiere Importante
- **Excel Source:** `assets/docs/Grila tarife .xlsx`
- **JSON Data:** `assets/json/car-pricing-data.json`
- **Booking RON:** `assets/js/booking.js`
- **Booking EUR:** `assets/js/booking-en.js`

## Ghid de Utilizare

### Pasul 1: Încărcarea Datelor
1. Accesați interfața de administrare
2. Apăsați butonul "Încarcă Date Excel"
3. Așteptați confirmarea încărcării cu succes

### Pasul 2: Generarea Raportului
1. Apăsați butonul "Generează Raport"
2. Verificați statisticile afișate:
   - Numărul de mașini de actualizat
   - Mașinile nemapate (dacă există)
   - Mașinile noi din Excel

### Pasul 3: Previzualizarea Modificărilor
1. Apăsați butonul "Previzualizează Modificări"
2. Verificați modificările de prețuri pentru fiecare mașină
3. Observați:
   - Prețurile vechi vs. noi
   - Diferențele calculate
   - Prețurile pe toate tier-urile

### Pasul 4: Aplicarea Modificărilor
1. Apăsați butonul "Aplică Modificări"
2. Descărcați fișierele generate:
   - `booking.js` (prețuri în RON)
   - `booking-en.js` (prețuri în EUR)
3. Înlocuiți fișierele din `assets/js/` cu cele descărcate

## Maparea Mașinilor

| Sistem Actual | Excel |
|---------------|-------|
| audi-q3 | audi-a3-automat |
| mazda-6 | mazda-6-manual |
| audi-a6 | audi-a6-automat |
| bmw-gt-530 | bmw-seria-5-automat-nou |
| mercedes-e-class | mercedes-e-klasse |
| renault-koleos | mitsubishi-outlander-automat |
| toyota-rav4 | toyota-rav4-automat |
| renault-traffic-8-1 | renault-trafic-8-plus-1-automat |
| vw-t-cross | vw-t-cross-automat |
| skoda-scala | skoda-scala-automat |

## Configurări

### Rata de Schimb
- **Valoare implicită:** 1 EUR = 5.07 RON
- **Modificare:** Prin câmpul "Rata de Schimb" din interfață

### Tier-uri de Prețuri
1. **Tier 1:** 1-3 zile (afișat pe site)
2. **Tier 2:** 4-7 zile
3. **Tier 3:** 8-14 zile
4. **Tier 4:** 15-30 zile

## Depanare

### Probleme Comune

**1. Eroare la încărcarea datelor Excel**
- Verificați că fișierul `Grila tarife .xlsx` există în `assets/docs/`
- Asigurați-vă că serverul local rulează

**2. Mașini nemapate**
- Verificați secțiunea "Mașini nemapate" din raport
- Actualizați maparea în `price-migration-script.js` dacă este necesar

**3. Prețuri incorecte**
- Verificați rata de schimb setată
- Controlați datele din Excel pentru erori

### Log-uri
- Utilizați secțiunea "Log Activitate" pentru a urmări operațiunile
- Apăsați "Șterge Log" pentru a curăța istoricul

## Siguranță

### Măsuri de Precauție
1. **Backup:** Creați backup pentru fișierele `booking.js` și `booking-en.js` înainte de modificări
2. **Testare:** Testați fișierele generate într-un mediu de dezvoltare
3. **Verificare:** Controlați prețurile pe site după aplicarea modificărilor

### Recomandări
- Nu aplicați modificări direct în producție fără testare
- Verificați toate prețurile după migrare
- Păstrați o copie de siguranță a fișierului Excel

## Suport Tehnic

### Fișiere de Documentație
- `docs/prd.txt` - Documentația completă a produsului
- `.trae/documents/excel-price-migration-system.md` - Documentația tehnică detaliată

### Structura Fișierelor
```
public_html/
├── admin/
│   ├── price-migration.html    # Interfața de administrare
│   └── README.md              # Acest fișier
├── assets/
│   ├── docs/
│   │   └── Grila tarife .xlsx # Fișierul Excel sursă
│   ├── js/
│   │   ├── booking.js         # Prețuri RON
│   │   ├── booking-en.js      # Prețuri EUR
│   │   ├── pricing-data-loader.js
│   │   └── price-migration-script.js
│   └── json/
│       └── car-pricing-data.json
```

## Actualizări și Mentenanță

### Actualizări Periodice
- Verificați rata de schimb EUR/RON lunar
- Actualizați maparea când se adaugă mașini noi
- Monitorizați log-urile pentru erori

### Extensibilitate
- Sistemul poate fi extins pentru alte surse de date
- Maparea poate fi configurată dinamic
- Pot fi adăugate noi tier-uri de prețuri

---

**Versiune:** 1.0  
**Data:** $(date)  
**Status:** Funcțional și testat  
**Contact:** Echipa de dezvoltare VEIRONAUTO