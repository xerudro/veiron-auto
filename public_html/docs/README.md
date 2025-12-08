# Documentație Tehnică - VEIRONAUTO

Această documentație conține ghiduri tehnice pentru dezvoltatori și mentenanță a website-ului VEIRONAUTO.

## 📚 Documente Disponibile

### [TROUBLESHOOTING-IMAGES.md](./TROUBLESHOOTING-IMAGES.md)
**Probleme cu încărcarea imaginilor auto**
- Debugging imagini lipsă (placeholders în loc de imagini reale)
- Proceduri de verificare și remediere
- Checklist pentru adăugarea mașinilor noi
- Exemple de cazuri rezolvate

---

## 🏗️ Structura Proiectului

```
public_html/
├── assets/
│   ├── css/                  # Stiluri CSS
│   ├── images/
│   │   └── cars/            # Imagini mașini
│   ├── js/                  # JavaScript
│   │   ├── booking.js       # Sistem rezervări (RO)
│   │   ├── booking-en.js    # Sistem rezervări (EN)
│   │   ├── parc-auto.js     # Parc auto (RO)
│   │   └── parc-auto-en.js  # Parc auto (EN)
│   └── json/
│       └── car-pricing-data.json  # Date prețuri mașini
├── docs/                    # Documentație (acest folder)
├── booking.html             # Pagina rezervări (RO)
├── booking-en.html          # Pagina rezervări (EN)
├── parc-auto.html          # Pagina parc auto (RO)
└── parc-auto-en.html       # Pagina parc auto (EN)
```

---

## 🚗 Sistemul de Gestionare Imagini

### Componente Principale

1. **car-pricing-data.json** - Baza de date cu mașini
2. **carImageMap** - Mapare ID → Path imagine
3. **CAR_MODELS** - Configurație galerii imagini
4. **CAR_IMAGE_FALLBACKS** - Imagini de rezervă

### Flow de Încărcare Imagini

```
HTML (data-model="toyota-rav4-automat")
    ↓
JavaScript loadCarGallery()
    ↓
CAR_MODELS[modelId] ? model.images : getDefaultImages(modelId)
    ↓
carImageMap[modelId] → imagine găsită
    ↓
getImagePath(modelId, file, isDirectImage)
    ↓
loadImageWithFallback() → încarcă cu fallback
```

---

## 🔧 Comenzi Utile

### Dezvoltare Locală

```bash
# Start server local
python -m http.server 8000

# Sau cu Node.js
npx http-server -p 8000

# Acces: http://localhost:8000
```

### Git

```bash
# Verifică imagini șterse
git status --short | grep "^D.*images"

# Restaurează imagine ștearsă
git restore "assets/images/cars/model/imagine.png"

# Vezi istoric modificări pentru o imagine
git log --all -- "assets/images/cars/toyota-rav4/*"
```

### Debugging Browser

```javascript
// În Console (F12), verifică configurația unei mașini:
console.log(CAR_MODELS['toyota-rav4-automat']);

// Verifică path generat:
console.log(getImagePath('toyota-rav4', 'toyota-rav4/main.png', true));
```

---

## 📋 Checklist Modificări

### Adăugare Mașină Nouă
- [ ] Adaugă în `car-pricing-data.json`
- [ ] Încarcă imaginile în `assets/images/cars/[model]/`
- [ ] Configurează `carImageMap` (parc-auto.js + parc-auto-en.js)
- [ ] Opțional: Adaugă în `CAR_MODELS` pentru galerie
- [ ] Adaugă fallback în `CAR_IMAGE_FALLBACKS` (booking.js + booking-en.js)
- [ ] Actualizează HTML (parc-auto.html + parc-auto-en.html)
- [ ] Testează în browser (imagini, galerie, rezervare)

### Ștergere Mașină
- [ ] Șterge din `car-pricing-data.json`
- [ ] Șterge configurația din toate fișierele JS
- [ ] Șterge cardul din HTML
- [ ] Opțional: Arhivează imaginile (nu șterge direct)

### Update Imagine Existentă
- [ ] Înlocuiește fișierul fizic
- [ ] Verifică că numele este identic SAU
- [ ] Actualizează path-ul în configurație
- [ ] Clear cache browser (`Ctrl+F5`)

---

## 🐛 Probleme Comune

| Problemă | Cauză | Soluție |
|----------|-------|---------|
| Placeholder în loc de imagine | Model ID lipsă din `carImageMap` | Adaugă în config |
| 404 în Network | Path greșit sau imagine ștearsă | Verifică fișierul există |
| Warning în Console | Configurație incompletă | Vezi `TROUBLESHOOTING-IMAGES.md` |
| Imaginea nu se actualizează | Cache browser | Hard refresh: `Ctrl+F5` |

---

## 📞 Support & Contact

Pentru probleme tehnice sau întrebări, consultă:
- [TROUBLESHOOTING-IMAGES.md](./TROUBLESHOOTING-IMAGES.md) pentru probleme cu imagini
- Git history pentru modificări recente
- Browser DevTools (F12) pentru debugging live

**Ultima actualizare:** 2024-12-05
