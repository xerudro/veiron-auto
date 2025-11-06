# VEIRONAUTO - Project Rules & Solution Log

## Scop
Acest fișier documentează toate deciziile tehnice, soluțiile încercate și ce a funcționat/nu a funcționat, pentru a evita repetarea problemelor și a accelera dezvoltarea.

---

### 2025-07-02 - Integrare Google Maps modernă pe pagina de contact
- **Problemă:** Integrarea Google Maps cu pinuri custom și performanță maximă, fără erori de callback sau module incompatibile.
- **Ce s-a încercat:**
  - Includere script Google Maps cu type="module" și inițializare asincronă din modul JS (nu funcționează cu callback global).
  - Folosire store-locator și extended-component-library (prea complex pentru nevoile simple de pinuri custom).
  - Încărcare script Google Maps fără callback global (inițializare manuală după load).
- **Ce a funcționat:**
  - Includere script Google Maps cu loading=async&callback=initMap și fără type="module" pe scriptul custom.
  - Definirea funcției window.initMap global în contact-harta.js.
  - Mutarea scriptului maps-code în assets/libs/maps/ și actualizarea referinței în HTML.
  - Pinuri custom cu AdvancedMarkerElement și SVG/emoji, fără dependențe suplimentare.
  - CSS curat și minimal pentru layout aerisit.

---

### 2025-07-02 - Sincronizare Quick Booking/Rezervare rapidă (RO/EN)
- **Problemă:** Layout-ul și responsive-ul secțiunii quick booking nu erau identice între RO și EN, iar prețurile trebuiau convertite și rotunjite manual.
- **Ce s-a încercat:**
  - Copiere 1:1 structură HTML din index-ro.html în index-en.html.
  - Extragere CSS în fișiere dedicate (rezervare-rapida.css, quick-booking.css).
  - Sincronizare media queries și layout între cele două fișiere.
  - S-a încercat line-clamp pentru titluri, dar nu a funcționat corect cross-browser.
- **Ce a funcționat:**
  - Folosirea min-height pe .car-title pentru aliniere imagini și titluri.
  - Media queries dedicate pentru 700px, 1200px, 1500px pentru grid și imagini.
  - Extragerea completă a CSS-ului pentru quick booking în fișiere externe, cu layout identic pe RO/EN.
  - Rotunjirea manuală a prețurilor EUR pentru EN.

---

### 2025-07-02 - Pagina de contact
- **Problemă:** Layout-ul era prea îngust și spațiul dintre header și titlu era insuficient.
- **Ce s-a încercat:**
  - Padding-top pe titlu și pe secțiune, background subtil, min-width mare pe card/hartă.
  - Stiluri moștenite din alte pagini (box-shadow, min-width, background) care nu erau necesare.
- **Ce a funcționat:**
  - Eliminarea padding-ului și background-ului inutil de pe secțiune.
  - Folosirea margin-top pe .contact-main-title-section pentru spațiu între header și titlu.
  - Layout aerisit, cu container lărgit și gap generos între card și hartă.
  - CSS extern curat, doar cu stiluri esențiale pentru contact.

---

### 2025-07-02 - Header și responsive
- **Problemă:** Pe mobil, limbile nu erau vizibile, slider-ul nu era ascuns pe ecrane mici.
- **Ce s-a încercat:**
  - Afișare iconițe și text pe butoane limbă, ascundere slider cu display:none pe max-width:1279px.
- **Ce a funcționat:**
  - Media queries pentru afișare text RO/EN pe mobil și ascundere slider sub 1280px.

---

### 2025-07-02 - Aliniere carduri și imagini
- **Problemă:** Imaginile nu erau aliniate pe toate breakpoints, titlurile cu mai multe linii strică layout-ul.
- **Ce s-a încercat:**
  - line-clamp pe titlu, min-height variabil, aspect-ratio pe imagini.
- **Ce a funcționat:**
  - min-height pe .car-title, aspect-ratio: 16/9 și object-fit: contain pe imagini, media queries dedicate pentru fiecare breakpoint.

---

**Notă:** De fiecare dată când se găsește o soluție la o problemă de layout, responsive, CSS, sau orice alt aspect tehnic, se va adăuga aici ce s-a încercat și ce a funcționat/nu a funcționat, cu dată și context. 