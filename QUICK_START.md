# QUICK_START.md – VEIRONAUTO

## 1. Marchează taskurile
- Editează `memory-bank/tasks.md` și `memory-bank/todo.md` pentru a bifa taskuri finalizate ([x])
- Poți bifa mai multe taskuri odată (batch complete)

## 2. Rulează scripturile de progres
- `update-progress.ps1` (Windows PowerShell): actualizează progresul, logul zilnic și progresul pe faze
- `node memory-bank/auto-update-script.js [cale_fisier]`: marchează automat taskuri ca finalizate când creezi/modifici fișiere

## 3. Sincronizează progresul și dependențele
- Scripturile marchează automat taskurile BLOCKED dacă dependențele nu sunt rezolvate
- Poți genera rapid lista taskurilor blocate sau cu dependențe nerezolvate

## 4. Onboarding rapid pentru colaboratori
- Citește README.md din fiecare director pentru structură și reguli
- Folosește acest fișier pentru pașii minimali de pornire

## 5. Vizualizare și filtrare dependențe
- Vezi la începutul `tasks.md` și `todo.md` lista dependențelor critice
- Poți filtra rapid taskurile blocate sau independente

---

**Totul funcționează strict local, fără backend!** 