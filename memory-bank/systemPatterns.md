# System Patterns

## Architecture
- Modularizare pe componente HTML/CSS/JS
- Fiecare pagină are fișiere dedicate pentru stil și logică

## Key Decisions
- UIkit pentru layout și componente UI
- lightGallery pentru galerii imagini
- Swiper pentru carousels

## Patterns
- DRY pentru CSS (folosește variabile și clase utilitare)
- Desktop-first design

# Regula automată .mdc: Documentare probleme și soluții implementate

**Scop:**
Orice problemă tehnică întâmpinată în proiect și soluțiile încercate (inclusiv codul care nu a funcționat și codul final corect) trebuie documentate automat într-un fișier Markdown dedicat din `@/memory-bank` (ex: `memory-bank/solution-log.md`).

## Formatul fișierului

Fiecare problemă va fi salvată ca un bloc separat, cu următoarea structură:

---
### Problemă
Descriere clară a problemei întâmpinate (ex: "Nu pot alinia cardurile din dreapta cu formularul de contact").

### Soluții încercate (Nefuncționale)
```css
// Cod CSS/HTML/JS care NU a funcționat și de ce
```
Explicație scurtă de ce nu a funcționat.

### Soluția finală (Funcțională)
```css
// Codul care a funcționat
```
Explicație scurtă de ce funcționează.

### Data / Context
- Data: YYYY-MM-DD
- Pagina/fișier afectat: ex: contact.html, contact-en.html
- Alte observații relevante
---

## Pași pentru salvare automată
1. La fiecare sesiune de debugging sau implementare, orice problemă și soluție trebuie adăugată în fișierul `memory-bank/solution-log.md` folosind formatul de mai sus.
2. Se includ atât codul nefuncțional (pentru referință și a nu repeta greșeala), cât și codul funcțional.
3. Se actualizează fișierul la fiecare iterație relevantă.
4. Se folosește acest log ca referință pentru viitoare probleme similare.

## Exemplu

---
### Problemă
Cardurile din dreapta nu se aliniază cu formularul de contact.

### Soluții încercate (Nefuncționale)
```css
.contact-right { margin-top: 100px; }
// sau
.contact-right-outer { margin-top: 100px; }
// sau
.contact-right .contact-info-card:first-child { margin-top: 100px; }
```
Nu funcționează deoarece flexbox/grid aliniază coloanele sus indiferent de margin-top pe coloana dreaptă.

### Soluția finală (Funcțională)
```html
<div class="contact-right">
  <div class="contact-align-spacer"></div>
  <div class="contact-info-card">...</div>
</div>
```
```css
.contact-right .contact-align-spacer {
  height: 170px;
  display: block;
}
@media (max-width: 900px) {
  .contact-right .contact-align-spacer {
    height: 0;
    display: none;
  }
}
```
Spacer-ul invizibil "împinge" cardurile exact cât trebuie pentru aliniere vizuală.

### Data / Context
- Data: 2024-07-02
- Pagina: contact.html, contact-en.html
- Observație: Soluția e robustă pentru layouturi flex responsive.
---

---

# Pattern nou (iulie 2025):
- CSS-ul pentru componente majore (ex: footer) trebuie separat în fișiere dedicate (ex: footer.css) pentru a preveni efecte colaterale asupra altor elemente și pentru mentenanță ușoară.
- Orice modificare de layout majoră trebuie documentată în tasks.md și todo.md.

---

# Pattern nou (iulie 2025):
- Orice pagină de tip legal (ex: Politica de Confidențialitate, Termeni și Condiții) trebuie:
  - Să aibă structură semantică (h1, h2, p, ul, li)
  - Să fie stilizată dedicat pentru lizibilitate
  - Să fie sincronizată ca structură și conținut între limbi
  - Să fie accesibilă din footer pe toate paginile principale
