# Troubleshooting - Probleme cu Încărcarea Imaginilor Auto

## Problema: Imaginile mașinilor nu se încarcă (apar placeholders)

### Simptome
- Imaginile mașinilor apar ca placeholders în loc de imaginile reale
- În consolă (F12) apar warning-uri: `⚠️ No specific image found for car: [model-id]`
- În Network tab apar erori 404 pentru imagini lipsă

---

## Cauze Identificate

### 1. **Model ID lipsă din `carImageMap`**
**Descriere:** Cea mai frecventă cauză - modelul mașinii există în JSON dar nu are imagine configurată în JavaScript.

**Cum se manifestă:**
```
Console Warning: "No specific image found for car: toyota-rav4-automat (TOYOTA RAV4), using placeholder"
```

**Soluție:**
Adaugă model ID-ul în `carImageMap` din fișierele:
- `assets/js/parc-auto.js` (versiunea RO)
- `assets/js/parc-auto-en.js` (versiunea EN)

```javascript
const carImageMap = {
    // ... alte mașini
    'toyota-rav4': 'toyota-rav4/toyota-rav4-suv-rent-a-car.png',
    'toyota-rav4-automat': 'toyota-rav4/toyota-rav4-suv-rent-a-car.png', // ← ADAUGĂ AICI
    // ... alte mașini
};
```

**Verificare:**
1. Caută modelul în `assets/json/car-pricing-data.json`
2. Copiază `id` exact așa cum apare
3. Adaugă în `carImageMap` cu path-ul corect către imagine

---

### 2. **Path-uri greșite în `CAR_MODELS`**
**Descriere:** Configurația galeriei are path-uri către imagini care nu mai există.

**Cum se manifestă:**
```javascript
// Console Log:
🚗 Toyota RAV4 Image Config: {
    file: "toyota-rav4-suv-inchiriere-4x4-satu-mare.jpg",  // ← Fișier ȘTERs!
    generatedPath: "assets/images/cars/toyota-rav4-suv-inchiriere-4x4-satu-mare.jpg"
}
```

**Soluție:**
Verifică și actualizează configurația în `CAR_MODELS`:

```javascript
'toyota-rav4': {
    title: 'TOYOTA RAV4',
    images: [
        {
            file: 'toyota-rav4/toyota-rav4-suv-rent-a-car.png',  // ← PATH CORECT
            alt: 'Toyota RAV4 SUV închiriere 4x4 Satu Mare',
            isDirectImage: true
        },
        {
            file: 'placeholder.jpg',
            alt: 'Toyota RAV4 vedere laterală',
            isDirectImage: true
        }
    ]
},
```

**Verificare fișiere:**
```bash
# Pe Windows (Git Bash sau WSL):
ls -la "assets/images/cars/toyota-rav4/"

# Pe Linux/Mac:
find assets/images/cars/toyota-rav4/ -type f
```

---

### 3. **Fallback-uri greșite în `booking.js`**
**Descriere:** Sistemul de fallback indică imagini care nu mai există.

**Cum se manifestă:**
- Imaginea se încarcă corect inițial
- După o eroare, fallback-ul încarcă tot un fișier inexistent

**Soluție:**
Actualizează `CAR_IMAGE_FALLBACKS` în:
- `assets/js/booking.js`
- `assets/js/booking-en.js`

```javascript
const CAR_IMAGE_FALLBACKS = {
    'toyota-rav4': '/assets/images/cars/toyota-rav4/toyota-rav4-suv-rent-a-car.png'
};
```

---

### 4. **Imagini șterse din Git**
**Descriere:** Imaginile au fost șterse accidental dar path-urile rămân în cod.

**Cum se identifică:**
```bash
git status --short | grep "^D.*images/cars"
```

**Output exemplu:**
```
D assets/images/cars/toyota-rav4/gallery/toyota-rav4-suv-inchiriere-4x4-satu-mare.jpg
D assets/images/cars/toyota-rav4/toyota-rav4.jpg
```

**Soluții:**

**Opțiunea A - Restaurare:**
```bash
git restore "assets/images/cars/toyota-rav4/toyota-rav4.jpg"
```

**Opțiunea B - Înlocuire cu placeholder în HTML:**
```html
<!-- ÎN parc-auto.html și parc-auto-en.html -->
<img src="assets/images/cars/placeholder.jpg" alt="..." class="thumb-image">
```

---

## Procedură de Debugging

### Pas 1: Activează Logging
Fișierele `parc-auto.js` și `parc-auto-en.js` au deja logging integrat pentru Toyota RAV4.

Pentru alte mașini, adaugă temporary logging:
```javascript
// În funcția loadCarGallery(), la linia ~517
const images = imageConfig.map(img => {
    const imagePath = getImagePath(modelId, img.file, img.isDirectImage);

    // Debug logging - ÎNLOCUIEȘTE 'toyota-rav4' cu modelul problematic
    if (modelId === 'model-problematic') {
        console.log('🚗 Image Config:', {
            modelId,
            file: img.file,
            isDirectImage: img.isDirectImage,
            generatedPath: imagePath
        });
    }

    return { src: imagePath, alt: img.alt, fallback: getFallbackImage() };
});
```

### Pas 2: Deschide Console (F12)
1. Navighează la pagina cu problema
2. Apasă `F12` → tab `Console`
3. Caută mesajele cu 🚗 sau ⚠️
4. Verifică ce `generatedPath` se afișează

### Pas 3: Verifică Network Tab
1. În Developer Tools, mergi la tab-ul `Network`
2. Filtrează după `Img` sau `All`
3. Refresh pagina (`Ctrl+F5`)
4. Caută request-uri cu status **404** (roșu)
5. Verifică ce path-uri eșuează

### Pas 4: Verifică Fișierele
```bash
# Verifică dacă imaginea există
ls -la "assets/images/cars/[model-folder]/"

# Caută toate imaginile pentru un model
find assets/images/cars -name "*rav4*" -type f

# Verifică imagini șterse din git
git status --short | grep "^D.*images"
```

---

## Checklist pentru Adăugarea unei Mașini Noi

Când adaugi o mașină nouă, verifică următoarele:

### ✅ 1. Fișier JSON
```json
// assets/json/car-pricing-data.json
{
    "id": "model-nou-automat",  // ← REȚINE acest ID!
    "name": "MODEL NOU AUTOMAT",
    "category": "suv",
    "image": "model-nou/model-nou-main.png",
    // ...
}
```

### ✅ 2. Imagine fizică
```bash
# Asigură-te că există:
assets/images/cars/model-nou/model-nou-main.png
```

### ✅ 3. carImageMap (parc-auto.js și parc-auto-en.js)
```javascript
const carImageMap = {
    'model-nou-automat': 'model-nou/model-nou-main.png',
};
```

### ✅ 4. CAR_MODELS (opțional - pentru galerie)
```javascript
const CAR_MODELS = {
    'model-nou-automat': {
        title: 'MODEL NOU AUTOMAT',
        images: [
            { file: 'model-nou/model-nou-main.png', alt: 'Vedere principală', isDirectImage: true },
            { file: 'model-nou/gallery/lateral.jpg', alt: 'Vedere laterală', isDirectImage: true }
        ]
    }
};
```

### ✅ 5. Fallback (booking.js și booking-en.js)
```javascript
const CAR_IMAGE_FALLBACKS = {
    'model-nou-automat': '/assets/images/cars/model-nou/model-nou-main.png'
};
```

### ✅ 6. HTML (parc-auto.html și parc-auto-en.html)
```html
<div class="car-card" data-model="model-nou-automat">
    <div class="gallery-main">
        <img src="assets/images/cars/model-nou/model-nou-main.png"
             alt="Model Nou"
             class="main-image">
    </div>
</div>
```

---

## Structura Path-urilor

### Format Corect pentru `isDirectImage: true`
```javascript
// ✅ CORECT - path relativ de la /cars/
file: 'toyota-rav4/toyota-rav4-suv-rent-a-car.png'

// ❌ GREȘIT - nu include /cars/ în path
file: 'assets/images/cars/toyota-rav4/toyota-rav4-suv-rent-a-car.png'
```

### Funcția `getImagePath()` construiește astfel:
```javascript
function getImagePath(modelId, imageFile, isDirectImage = false) {
    if (isDirectImage) {
        // Pentru isDirectImage: true
        return `assets/images/cars/${imageFile}`;
        // Rezultat: assets/images/cars/toyota-rav4/toyota-rav4-suv-rent-a-car.png
    }
    // Pentru isDirectImage: false
    return `assets/images/cars/${modelId}/gallery/${imageFile}`;
    // Rezultat: assets/images/cars/toyota-rav4/gallery/lateral.jpg
}
```

---

## Exemple de Cazuri Rezolvate

### Caz 1: Toyota RAV4 - Multiple Model IDs
**Problemă:** Existau 3 variante în JSON dar doar 2 în config.
```javascript
// JSON avea:
- toyota-rav4
- toyota-rav4-suv
- toyota-rav4-automat  // ← LIPSEA din config

// Soluție:
'toyota-rav4-automat': 'toyota-rav4/toyota-rav4-suv-rent-a-car.png',
```

### Caz 2: Imagini șterse din repository
**Problemă:**
```bash
git status:
D assets/images/cars/toyota-rav4/gallery/toyota-rav4-suv-inchiriere-4x4-satu-mare-2.jpg
```

**Soluție:** Înlocuit cu placeholder în HTML și config:
```html
<img src="assets/images/cars/placeholder.jpg" alt="Vedere laterală">
```

---

## Tools Utile

### Script pentru verificare automată
```bash
#!/bin/bash
# check-car-images.sh

echo "=== Verificare imagini mașini ==="

# 1. Găsește toate ID-urile din JSON
echo "Model IDs din JSON:"
grep -oP '"id":\s*"\K[^"]+' assets/json/car-pricing-data.json | sort

# 2. Verifică imagini șterse
echo -e "\n=== Imagini șterse din Git ==="
git status --short | grep "^D.*images/cars"

# 3. Găsește toate imaginile fizice
echo -e "\n=== Imagini disponibile ==="
find assets/images/cars -type f -name "*.png" -o -name "*.jpg" | sort

# 4. Verifică configurația JavaScript
echo -e "\n=== Model IDs din carImageMap ==="
grep -oP "'[^']+(?=':\s*')" assets/js/parc-auto.js | grep -A1 "carImageMap" | tail -n +2
```

### Rulare:
```bash
chmod +x check-car-images.sh
./check-car-images.sh
```

---

## Contact & Support

Pentru probleme suplimentare, verifică:
1. **Git History:** `git log --all -- "assets/images/cars/[model]/*"`
2. **Console Logs:** Activează debugging (vezi Pas 1)
3. **Network Tab:** Verifică request-uri eșuate

**Data ultimei actualizări:** 2024-12-05
**Versiune document:** 1.0
