# Installatie op je Windows-pc

Deze gids zet de transcriptie-bewaker op zodat ze **automatisch bij het
opstarten** van je pc draait en blijft draaien op de achtergrond.

Eenmalig instellen duurt ~15 minuten. Daarna doe je er nooit meer iets aan.

---

## Stap 1 — Python installeren

1. Ga naar <https://www.python.org/downloads/> en installeer **Python 3.11 of
   nieuwer**.
2. Vink tijdens de installatie **"Add python.exe to PATH"** aan. Belangrijk.
3. Controleer in PowerShell:

   ```powershell
   python --version
   ```

## Stap 2 — De bestanden op je pc zetten

Zet de map `tools/transcriptie` uit deze repository ergens vast op je pc, bv.:

```
C:\Users\woutv\transcriptie
```

## Stap 3 — Python-pakketten installeren

Open **PowerShell**, ga naar die map en maak een aparte omgeving:

```powershell
cd C:\Users\woutv\transcriptie
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

> **GPU (optioneel, sneller).** Heb je een NVIDIA-videokaart? Installeer dan ook
> PyTorch met CUDA (zie <https://pytorch.org/get-started/locally/>) en zet in
> `config.ini` het model op `large-v3`. Zonder GPU laat je `medium` staan; dat
> werkt prima op een gewone pc, alleen wat trager.

## Stap 4 — Configuratie

1. Kopieer `config.example.ini` naar `config.ini`.
2. Controleer `watch_dir` (standaard `C:\Users\woutv\OneDrive\Temporary`).
3. Kies de **opkuis-mode**:
   - `claude` (aanbevolen): zet je API-sleutel als omgevingsvariabele — zie stap 5.
   - `ollama`: installeer [Ollama](https://ollama.com) en draai `ollama pull llama3.1`.
   - `none`: enkel ruwe transcriptie, geen opkuis.

## Stap 5 — (Enkel bij mode = claude) API-sleutel instellen

Sla je Claude-API-sleutel op als **gebruikers-omgevingsvariabele** zodat ze niet
in een bestand staat:

```powershell
setx ANTHROPIC_API_KEY "sk-ant-...jouw-sleutel..."
```

Sluit PowerShell daarna en open het opnieuw (setx geldt pas in een nieuw venster).

## Stap 6 — OneDrive-map altijd lokaal houden

Dit voorkomt de meest voorkomende fout ("bestand nog niet gedownload"):

1. Open Verkenner → ga naar `OneDrive\Temporary`.
2. Rechterklik op de map **Temporary** → **"Altijd behouden op dit apparaat"**.

## Stap 7 — Testen

Zet een testopname in de map en start handmatig:

```powershell
.\.venv\Scripts\Activate.ps1
python transcribeer.py
```

Je ziet logregels verschijnen. Na de transcriptie staat er een bestand
`<naam>_OPGEKUISD.txt` in de map. Stop met `Ctrl+C`.

## Stap 8 — Automatisch bij opstarten (Windows Taakplanner)

1. Maak in de map een bestand `start.bat` (zit al mee in deze map) en controleer
   dat het pad erin klopt.
2. Open **Taakplanner** (Task Scheduler) → **Taak maken** (niet "Basistaak").
3. Tabblad **Algemeen**:
   - Naam: `Transcriptie-bewaker`.
   - Kies **"Uitvoeren ongeacht of de gebruiker is aangemeld"** is niet nodig;
     eenvoudiger is **"Alleen uitvoeren als de gebruiker is aangemeld"** (dan
     heeft het venster toegang tot je omgevingsvariabele en OneDrive).
4. Tabblad **Triggers** → **Nieuw** → Begin de taak: **"Bij aanmelden"**.
5. Tabblad **Acties** → **Nieuw** → Programma: blader naar `start.bat`.
6. Tabblad **Instellingen**:
   - Vink **"De taak opnieuw starten als deze mislukt"** aan (bv. elke 1 minuut,
     3 pogingen).
   - Vink **"De taak stoppen als deze langer duurt dan"** UIT (ze moet blijven
     draaien).
7. OK. De bewaker start nu automatisch telkens je aanmeldt.

---

## Werkwijze op locatie

1. Neem op met je gsm.
2. Zorg dat de opname naar `OneDrive\Temporary` synct.
3. Zodra je pc thuis online is, verschijnt na enkele minuten
   `<naam>_OPGEKUISD.txt` in dezelfde map.
4. Open dat bestand op je laptop en schrijf je artikel.

## Problemen oplossen

- **Er gebeurt niets** → kijk in `transcribeer.log` in de scriptmap.
- **"nog niet lokaal beschikbaar (OneDrive)"** → doe stap 6.
- **Opkuis mislukt** → de ruwe transcriptie wordt dan tóch afgeleverd; controleer
  je API-sleutel of internet.
- **Alles opnieuw laten verwerken** → verwijder het bestand `.verwerkt.json`.
