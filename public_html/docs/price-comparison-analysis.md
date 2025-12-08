# Analiză Prețuri - Comparație booking.js vs car-pricing-data.json

## Mașini cu Prețuri GREȘITE (Dublă Conversie EUR → RON)

### 1. Audi Q3 (id: 1)
**În booking.js:**
- tier1: 120 EUR → 608 lei (afișat)
- tier2: 112 EUR → 567 lei
- tier3: 105 EUR → 532 lei
- tier4: 95 EUR → 481 lei
- Deposit: 400 EUR

**În car-pricing-data.json (audi-q3):**
- tier1: 75 EUR → **380 lei** (corect)
- tier2: 70 EUR → **355 lei**
- tier3: 65 EUR → **330 lei**
- tier4: 60 EUR → **304 lei**
- Deposit: 300 EUR

**Problemă:** Prețurile din booking.js sunt de la "audi-q5-nou" din JSON!
**Diferență:** 228 lei/zi (60% mai scump!)

---

### 2. Mazda 6 (id: 2)
**În booking.js:**
- tier1: 203 EUR → **1029 lei** (afișat)
- tier2: 193 EUR → 978 lei
- tier3: 183 EUR → 927 lei
- tier4: 172 EUR → 872 lei

**Comentarii în cod spun:**
- tier1: 40 EUR
- tier2: 38 EUR
- tier3: 36 EUR
- tier4: 34 EUR

**În car-pricing-data.json (mazda-6-manual):**
- tier1: 40 EUR → **203 lei** (corect)
- tier2: 37 EUR → **188 lei**
- tier3: 34 EUR → **172 lei**
- tier4: 32 EUR → **162 lei**

**Problemă:** Cineva a calculat 40 EUR × 5.07 = 203 și a pus 203 ca fiind EUR în loc de LEI!
**Diferență:** 826 lei/zi (506% mai scump - de 5 ori!)

---

### 3. Audi A6 (id: 3)
**În booking.js:**
- tier1: 354 EUR → **1795 lei** (afișat)
- tier2: 340 EUR → 1724 lei
- tier3: 319 EUR → 1617 lei
- tier4: 304 EUR → 1541 lei

**Comentarii în cod spun:**
- tier1: 70 EUR
- tier2: 67 EUR
- tier3: 63 EUR
- tier4: 60 EUR

**În car-pricing-data.json (audi-a6-automat):**
- tier1: 70 EUR → **355 lei** (corect)
- tier2: 67 EUR → **340 lei**
- tier3: 63 EUR → **319 lei**
- tier4: 55 EUR → **279 lei**

**Problemă:** Dublă conversie: 70 EUR × 5.07 = 354.9, apoi 354 × 5.07 = 1795 lei
**Diferență:** 1440 lei/zi (506% mai scump - de 5 ori!)

---

### 4. BMW GT 530 (id: 4)
**În booking.js:**
- tier1: 405 EUR → 2053 lei
- tier2: 385 EUR → 1952 lei
- tier3: 365 EUR → 1851 lei
- tier4: 345 EUR → 1749 lei

**Comentarii în cod spun:**
- tier1: 80 EUR
- tier2: 76 EUR
- tier3: 72 EUR
- tier4: 68 EUR

**În car-pricing-data.json (bmw-seria-5-gt):**
- tier1: 80 EUR → **406 lei** (corect)
- tier2: 72 EUR → **365 lei**
- tier3: 60 EUR → **304 lei**
- tier4: 55 EUR → **279 lei**

**Problemă:** Dublă conversie EUR → RON
**Diferență:** 1647 lei/zi (506% mai scump - de 5 ori!)

---

### 5. Mercedes E-Class (id: 5)
**În booking.js:**
- tier1: 330 EUR → 1673 lei
- tier2: 315 EUR → 1597 lei
- tier3: 304 EUR → 1541 lei
- tier4: 289 EUR → 1465 lei

**Comentarii în cod spun:**
- tier1: 65 EUR
- tier2: 62 EUR
- tier3: 60 EUR
- tier4: 57 EUR

**În car-pricing-data.json (mercedes-e-klasse):**
- tier1: 65 EUR → **330 lei** (corect)
- tier2: 63 EUR → **319 lei**
- tier3: 60 EUR → **304 lei**
- tier4: 57 EUR → **289 lei**

**Problemă:** Dublă conversie EUR → RON
**Diferență:** 1343 lei/zi (506% mai scump - de 5 ori!)

---

## Mașini cu Prețuri CORECTE ✓

- Mercedes GLC (id: 11): 130 EUR ✓
- Toyota RAV4 (id: 7): 100 EUR ✓
- Renault Traffic 8+1 (id: 8): 100 EUR ✓
- VW T-Cross (id: 9): 70 EUR ✓
- Skoda Scala (id: 10): 60 EUR ✓
- Mitsubishi Outlander (id: 12): 68 EUR ✓
- Skoda Kamiq (id: 13): 70 EUR ✓
- Renault Megane (id: 14): 40 EUR ✓
- Seat Alhambra Automat (id: 15): 55 EUR ✓
- Seat Alhambra Manual (id: 16): 50 EUR ✓
- Seat Exeo (id: 17): 37 EUR ✓
- Seat Exeo Combi (id: 18): 37 EUR ✓
- Audi A3 (id: 19): 40 EUR ✓
- Audi A4 (id: 20): 50 EUR ✓
- Audi Q5 (id: 21): 120 EUR ✓
- BMW X1 (id: 22): 100 EUR ✓
- BMW X3 (id: 23): 115 EUR ✓
- BMW Seria 5 Sedan (id: 24): 90 EUR ✓
- BMW Seria 5 Combi Automat (id: 25): 80 EUR ✓
- BMW Seria 5 Combi Manual (id: 26): 60 EUR ✓
- Honda Accord (id: 27): 40 EUR ✓
- Mercedes GLE (id: 28): 110 EUR ✓

---

## Rezumat Problema

**Total mașini cu prețuri greșite: 5**

1. **Audi Q3** - Are prețurile de la Audi Q5 Nou (60% mai scump)
2. **Mazda 6** - Dublă conversie EUR → RON (de 5 ori mai scump!)
3. **Audi A6** - Dublă conversie EUR → RON (de 5 ori mai scump!)
4. **BMW GT 530** - Dublă conversie EUR → RON (de 5 ori mai scump!)
5. **Mercedes E-Class** - Dublă conversie EUR → RON (de 5 ori mai scump!)

**Cauza:**
Cineva a luat prețurile în EUR, le-a convertit în RON (× 5.07), apoi a pus rezultatul ca fiind EUR în codul JavaScript. Când pagina afișează prețurile, face din nou conversie × 5.07, rezultând prețuri de 5 ori mai mari!

**Impact financiar:**
- Clienții văd prețuri umflate artificial
- Pierdere de comenzi din cauza prețurilor nerealiste
- Lipsă de competitivitate pe piață
