# VEIRONAUTO – Workflow & Scripturi Locale

## Onboarding rapid

1. Marchează taskurile în `memory-bank/tasks.md` și `memory-bank/todo.md` ([x])
2. Rulează scripturile PowerShell pentru progres, batch complete, filtrare și verificare fișiere
3. Consultă acest README și `QUICK_START.md` pentru exemple și pași minimali

---

## Scripturi PowerShell disponibile

### 1. Progres și log zilnic
```powershell
.\update-progress.ps1
```

**Ce face:**
- Actualizează progresul general, progresul pe faze și logul zilnic în `progress.md`
- Calculează procentajele automat pe baza taskurilor bifate [x]
- Generează daily progress log cu taskurile finalizate în ziua curentă

**Parametri:**
- Nu are parametri (rulează automat pe fișierele din memory-bank/)

**Exemplu output:**
```
Progress updated:
- Total: 23/349 (6.6%)
- PHASE 1: 20/164 (12.2%)
- PHASE 2: 3/183 (1.6%)
- Daily log updated for 2025-07-21
```

**Edge cases:**
- Dacă nu există taskuri bifate, progresul va fi 0%
- Dacă fișierele tasks.md sau todo.md nu există, scriptul va afișa eroare
- Dacă nu există taskuri cu [x], daily log va afișa "Nicio task finalizată azi"

---

### 2. Batch complete & BLOCKED automat
```powershell
.\update-tasks.ps1 -Batch "Create booking.js,Create home.css"
.\update-tasks.ps1
```

**Ce face:**
- Bifează rapid mai multe taskuri ca finalizate ([x])
- Marchează automat ca BLOCKED taskurile cu dependențe nerezolvate
- Actualizează atât tasks.md cât și todo.md

**Parametri:**
- `-Batch "task1,task2,task3"` – listează taskurile de bifat, separate prin virgulă
- Fără parametri – doar marchează BLOCKED taskurile cu dependențe nerezolvate

**Exemple utilizare:**
```powershell
# Bifează taskuri specifice
.\update-tasks.ps1 -Batch "Create booking.js,Create home.css,Create header.css"

# Bifează toate taskurile dintr-o fază
.\update-tasks.ps1 -Batch "Create public_html directory,Create app directory,Create database directory"

# Doar marchează BLOCKED
.\update-tasks.ps1
```

**Exemplu output:**
```
Batch complete & BLOCKED update done.
- 3 tasks marked as completed
- 2 tasks marked as BLOCKED (dependencies not resolved)
```

**Edge cases:**
- Dacă un task din batch nu există, va fi ignorat (nu va da eroare)
- Dacă un task este deja bifat, va rămâne bifat
- Dacă toate dependențele sunt rezolvate, nu va fi marcat BLOCKED
- Dacă nu există dependențe definite, toate taskurile vor fi independente

---

### 3. Filtrare rapidă taskuri
```powershell
.\filter-tasks.ps1 -Filter "BLOCKED"
.\filter-tasks.ps1 -Filter "independent"
```

**Ce face:**
- Afișează doar taskurile BLOCKED sau independente din tasks.md
- Permite filtrarea rapidă pentru a vedea ce poți lucra acum

**Parametri:**
- `-Filter "BLOCKED"` – afișează taskurile marcate ca BLOCKED
- `-Filter "independent"` – afișează taskurile fără dependențe (🟢)

**Exemple utilizare:**
```powershell
# Vezi ce taskuri sunt blocate
.\filter-tasks.ps1 -Filter "BLOCKED"

# Vezi ce taskuri poți lucra acum (independente)
.\filter-tasks.ps1 -Filter "independent"
```

**Exemplu output pentru BLOCKED:**
```
- [ ] Create booking.js **BLOCKED** (depinde de Create app.js)
- [ ] Create catalog-en.html **BLOCKED** (depinde de catalog-ro.html)
```

**Exemplu output pentru independent:**
```
- [ ] Create public_html directory 🟢
- [ ] Create app directory 🟢
- [ ] Create database directory 🟢
```

**Edge cases:**
- Dacă nu există taskuri BLOCKED, va afișa "No BLOCKED tasks found"
- Dacă nu există taskuri independente, va afișa "No independent tasks found"
- Dacă parametrul -Filter nu este specificat, va afișa toate taskurile

---

### 4. Verificare existență fișiere reale
```powershell
.\check-files.ps1
```

**Ce face:**
- Verifică dacă fișierele menționate în taskuri există fizic în proiect
- Ajută la identificarea taskurilor care pot fi marcate ca finalizate automat

**Parametri:**
- Nu are parametri (verifică automat toate taskurile din tasks.md)

**Exemple utilizare:**
```powershell
# Verifică toate fișierele
.\check-files.ps1

# Poți combina cu alte scripturi
.\check-files.ps1; .\update-tasks.ps1
```

**Exemplu output:**
```
LIPSEȘTE: public_html/assets/css/common/base.css
LIPSEȘTE: public_html/assets/js/core/app.js
EXISTĂ: public_html/index-ro.html
EXISTĂ: public_html/assets/css/pages/home.css
```

**Edge cases:**
- Dacă un task nu menționează un fișier specific, va fi ignorat
- Dacă toate fișierele există, va afișa "All files exist"
- Dacă nu există taskuri cu fișiere menționate, va afișa "No file tasks found"

---

### 5. Onboarding rapid (rezumat pași)
```powershell
.\ONBOARDING.ps1
```

**Ce face:**
- Afișează pașii minimali și comenzile principale pentru workflow local
- Ghid rapid pentru orice colaborator nou

**Parametri:**
- Nu are parametri (afișează informații statice)

**Exemplu output:**
```
=== VEIRONAUTO ONBOARDING ===
1. Marchează taskurile în memory-bank/tasks.md și memory-bank/todo.md ([x])
2. Rulează update-progress.ps1 pentru progres și log zilnic
3. Folosește update-tasks.ps1 pentru batch complete și BLOCKED automat
4. Folosește filter-tasks.ps1 pentru filtrare rapidă (BLOCKED/independent)
5. Rulează check-files.ps1 pentru a verifica dacă fișierele din taskuri există fizic
6. Citește README.md și QUICK_START.md pentru detalii și exemple
7. Toate scripturile funcționează strict local, fără backend
---
Comenzi utile:
.\update-progress.ps1
.\update-tasks.ps1 -Batch 'Create booking.js,Create home.css'
.\update-tasks.ps1
.\filter-tasks.ps1 -Filter 'BLOCKED'
.\filter-tasks.ps1 -Filter 'independent'
.\check-files.ps1
```

**Edge cases:**
- Nu are edge cases (afișează doar informații statice)

---

## Workflow avansat

### Combinarea scripturilor
```powershell
# Workflow complet: verifică fișiere, bifează taskuri, actualizează progres
.\check-files.ps1; .\update-tasks.ps1; .\update-progress.ps1

# Filtrare + batch complete
.\filter-tasks.ps1 -Filter "independent"; .\update-tasks.ps1 -Batch "task1,task2"

# Verificare + filtrare BLOCKED
.\check-files.ps1; .\filter-tasks.ps1 -Filter "BLOCKED"
```

### Automatizare zilnică
```powershell
# Adaugă în task scheduler pentru rulare automată
.\update-progress.ps1
.\check-files.ps1
```

---

**Toate scripturile funcționează strict local, fără backend.**

Vezi și: `QUICK_START.md`, `memory-bank/README.md`, `.cursor/rules/auto-update-workflow.mdc`
