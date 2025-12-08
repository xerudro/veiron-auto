# Quick Reference - Rezolvare Rapidă Probleme

## 🚨 Imagine nu se încarcă (Placeholder)

### Fix Rapid (30 secunde)

1. **Identifică Model ID** - din Console (F12):
```
⚠️ No specific image found for car: toyota-rav4-automat
```

2. **Adaugă în parc-auto.js** (linia ~364):
```javascript
'toyota-rav4-automat': 'toyota-rav4/toyota-rav4-suv-rent-a-car.png',
```

3. **Adaugă în parc-auto-en.js** (linia ~364):
```javascript
'toyota-rav4-automat': 'toyota-rav4/toyota-rav4-suv-rent-a-car.png',
```

4. **Refresh**: `Ctrl+F5`

---

## 📁 Fișiere de Modificat

Pentru **orice** problemă cu imaginile, verifică aceste fișiere:

| Fișier | Linie | Ce configurează |
|--------|-------|-----------------|
| `assets/js/parc-auto.js` | ~340-380 | `carImageMap` - mapare ID → imagine (RO) |
| `assets/js/parc-auto-en.js` | ~340-380 | `carImageMap` - mapare ID → imagine (EN) |
| `assets/js/parc-auto.js` | ~8-110 | `CAR_MODELS` - galerii imagini (RO) |
| `assets/js/parc-auto-en.js` | ~8-110 | `CAR_MODELS` - galerii imagini (EN) |
| `assets/js/booking.js` | ~558-560 | `CAR_IMAGE_FALLBACKS` - fallback (RO) |
| `assets/js/booking-en.js` | ~558-560 | `CAR_IMAGE_FALLBACKS` - fallback (EN) |

---

## 🔍 Debugging în 3 Pași

### Pas 1: Console (F12)
```javascript
// Caută mesaje cu:
🚗 Toyota RAV4 Image Config
⚠️ No specific image found for car
```

### Pas 2: Network Tab
```
Filtrează după: Img
Status roșu (404) = imagine lipsă
```

### Pas 3: Verifică Fișierul
```bash
ls -la "assets/images/cars/toyota-rav4/"
```

---

## 🔨 Templates de Configurare

### Template: Adăugare Mașină Nouă

**1. JSON** (`assets/json/car-pricing-data.json`):
```json
{
    "id": "audi-q7-automat",
    "name": "AUDI Q7 AUTOMAT",
    "category": "suv",
    "image": "audi-q7/audi-q7-main.png",
    "basePrice": 150
}
```

**2. carImageMap** (`parc-auto.js` + `parc-auto-en.js`):
```javascript
const carImageMap = {
    'audi-q7-automat': 'audi-q7/audi-q7-main.png',
};
```

**3. CAR_MODELS** (opțional - pentru galerie):
```javascript
'audi-q7-automat': {
    title: 'AUDI Q7 AUTOMAT',
    images: [
        { file: 'audi-q7/audi-q7-main.png', alt: 'Audi Q7', isDirectImage: true },
        { file: 'audi-q7/gallery/lateral.jpg', alt: 'Vedere laterală', isDirectImage: true }
    ]
},
```

**4. Fallback** (`booking.js` + `booking-en.js`):
```javascript
const CAR_IMAGE_FALLBACKS = {
    'audi-q7-automat': '/assets/images/cars/audi-q7/audi-q7-main.png'
};
```

**5. HTML** (`parc-auto.html` + `parc-auto-en.html`):
```html
<div class="car-card" data-model="audi-q7-automat">
    <div class="gallery-main">
        <img src="assets/images/cars/audi-q7/audi-q7-main.png"
             alt="Audi Q7"
             class="main-image">
    </div>
</div>
```

---

## 🎯 Cazuri Frecvente

### Caz 1: "No specific image found"
```
⚠️ No specific image found for car: toyota-rav4-automat
```
**Fix:** Adaugă în `carImageMap` (vezi mai sus)

### Caz 2: 404 în Network
```
GET /assets/images/cars/toyota-rav4/deleted-image.jpg → 404
```
**Fix 1:** Restaurează imaginea din Git
```bash
git restore "assets/images/cars/toyota-rav4/deleted-image.jpg"
```
**Fix 2:** Înlocuiește cu placeholder
```javascript
{ file: 'placeholder.jpg', alt: '...', isDirectImage: true }
```

### Caz 3: Imaginea există dar nu se încarcă
**Verificări:**
1. Path-ul este corect? ✅
2. `isDirectImage: true` este setat? ✅
3. Cache browser? → `Ctrl+F5` ✅

---

## 📊 Structura Path-urilor

### Format Path pentru `isDirectImage: true`
```javascript
// ✅ CORECT
file: 'toyota-rav4/toyota-rav4-main.png'
// → Devine: assets/images/cars/toyota-rav4/toyota-rav4-main.png

// ❌ GREȘIT (nu include assets/images/cars/)
file: 'assets/images/cars/toyota-rav4/toyota-rav4-main.png'
```

### Format Path pentru `isDirectImage: false`
```javascript
// ✅ CORECT
file: 'lateral.jpg'
// → Devine: assets/images/cars/[modelId]/gallery/lateral.jpg

// Folosește modelId automat pentru galerie
```

---

## ⚡ Comenzi Rapide

### Git
```bash
# Imagini șterse
git status --short | grep "^D.*images"

# Restaurare
git restore "path/to/image.png"

# Istoric modificări
git log --all -- "assets/images/cars/toyota-rav4/*"
```

### Find
```bash
# Găsește toate imaginile unui model
find assets/images/cars -name "*rav4*"

# Găsește toate PNG-urile
find assets/images/cars -type f -name "*.png"
```

### Verificare
```bash
# Verifică dacă imaginea există
ls -la "assets/images/cars/toyota-rav4/toyota-rav4-main.png"

# Mărimea fișierului
stat -c "%s bytes" "assets/images/cars/toyota-rav4/toyota-rav4-main.png"
```

---

## 🎨 Naming Conventions

### Model IDs (consistență)
```
✅ BINE:
- toyota-rav4
- toyota-rav4-automat
- toyota-rav4-suv

❌ RĂU:
- ToyotaRAV4
- toyota_rav4
- TOYOTA-RAV-4
```

### Nume Fișiere Imagini
```
✅ BINE:
- toyota-rav4-main.png
- toyota-rav4-lateral.jpg
- bmw-x5-interior.png

❌ RĂU:
- Toyota RAV4 Main.png (spații)
- IMG_12345.jpg (non-descriptiv)
- photo.png (generic)
```

### Structură Foldere
```
assets/images/cars/
├── toyota-rav4/
│   ├── toyota-rav4-main.png       (imagine principală)
│   └── gallery/
│       ├── lateral.jpg
│       ├── interior.jpg
│       └── portbagaj.jpg
```

---

## 🔐 Checklist Pre-Commit

Înainte de commit, verifică:

- [ ] Toate imaginile există fizic în folder
- [ ] Toate path-urile sunt corecte
- [ ] `carImageMap` actualizat (RO + EN)
- [ ] Fallbacks actualizate (booking.js + booking-en.js)
- [ ] Testat în browser (imagini se încarcă)
- [ ] Console fără warning-uri
- [ ] Network fără 404

---

## 📚 Vezi și

- [TROUBLESHOOTING-IMAGES.md](./TROUBLESHOOTING-IMAGES.md) - Ghid complet troubleshooting
- [README.md](./README.md) - Documentație generală

**Ultima actualizare:** 2024-12-05
