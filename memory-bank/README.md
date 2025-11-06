# VEIRONAUTO - Workflow Optimizat (2025)

## Flux rapid și automatizat pentru taskuri, progres și onboarding

- Marchează taskurile în `tasks.md` și `todo.md` (batch complete, BLOCKED automat)
- Rulează scripturile `update-progress.ps1` și `auto-update-script.js` pentru progres și log zilnic
- Sincronizează progresul și dependențele între taskuri și fișiere reale
- Folosește README.md și QUICK_START.md pentru onboarding rapid
- Vizualizează și filtrează dependențele direct din taskuri

**Vezi și:**
- `.cursor/rules/auto-update-workflow.mdc`
- `.cursor/rules/auto-update-rules.mdc`
- `update-progress.ps1`, `auto-update-script.js`

---

# memory-bank

Directorul central pentru context, progres și task management în VEIRONAUTO.

## Structură
- **tasks.md** – Taskuri active și checklist
- **progress.md** – Progresul implementării
- **activeContext.md** – Focusul curent și decizii recente
- **projectbrief.md** – Sumar proiect și obiective
- **productContext.md** – Context produs și user stories
- **systemPatterns.md** – Pattern-uri arhitecturale și decizii tehnice
- **techContext.md** – Tehnologii, setup, dependențe
- **archive/** – Arhivă taskuri finalizate
- **reflection/** – Documente de reflecție
- **creative/** – Documentație pentru faza creativă

Toate fișierele de context și management de proiect sunt organizate aici. 

---
## Exemple de Debug & Fix documentate

Toate problemele tehnice și soluțiile aplicate trebuie documentate în `memory-bank/solution-log.md` folosind formatul standard:
- Descriere problemă
- Cod nefuncțional (vechi)
- Cod funcțional (nou)
- Explicație scurtă
- Data/context, fișiere afectate

**Exemplu recent:**

> Problemă: Quick booking nu activa butonul "Next Step" și genera crash JS la inițializare în booking-en.html/booking-en.js.
> 
> - Cod vechi: Apel la `updateStepDisplay()` înainte de inițializarea DOM-ului, validare buton fără quickBookingMode, nextStep nu sărea la pasul 3.
> - Cod nou: Eliminat apelul la `updateStepDisplay()` din init, validare buton ține cont de quickBookingMode, nextStep sare direct la pasul 3.
> - Detalii complete (cod înainte/după, explicații): vezi `memory-bank/solution-log.md`.

**Regulă:** Orice fix important JS/CSS/HTML trebuie documentat cu cod înainte/după și explicație, conform pattern-ului din `systemPatterns.md`. 