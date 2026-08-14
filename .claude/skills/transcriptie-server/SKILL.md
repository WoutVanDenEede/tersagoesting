---
name: transcriptie-server
description: Zet de lokale transcriptie-bewaker aan of uit en controleert of ze gezond draait. Gebruik deze skill wanneer de gebruiker de transcriptie wil starten of stoppen, op locatie gaat en het systeem wil opstarten, of vraagt "zet de transcriptie aan/uit", "start de server", "start de bewaker", "transcriptie aanzetten", "hoe start ik de transcriptie", of /transcriptie-server typt. NIET voor het opkuisen van geplakte tekst (dat is de skill 'transcriptie').
---

# Transcriptie-server aan- en uitzetten

Deze skill helpt de gebruiker (Wout) de lokale transcriptie-bewaker te starten,
te stoppen en te controleren. De bewaker draait **handmatig** — bewust geen
automatische start via de Taakplanner, zodat Wout zelf bepaalt wanneer ze aan
staat.

Draai je (Claude) op deze pc met shell-toegang? Dan mag je de commando's zelf
uitvoeren. Draai je in de cloud/web (geen toegang tot de pc)? Geef Wout dan de
stappen om zelf uit te voeren — hij klikt, jij loodst.

## Vaste gegevens

- **Map met het script:** `C:\Users\woutv\OneDrive\Documents\transcriptie`
- **Bewaakte map (audio in/txt uit):** `C:\Users\woutv\OneDrive\Temporary`
- **Starten:** `start.bat` (dubbelklik) of in PowerShell `.\start.bat`
- **Stoppen:** het zwarte venster sluiten, of erin `Ctrl+C` drukken
- **GPU:** NVIDIA, staat ingesteld (`device=auto` → kiest cuda)
- **Opkuis:** via de Claude API (`mode = claude` in `config.ini`)

## AANZETTEN (bv. voor je op locatie vertrekt)

1. Open de map `C:\Users\woutv\OneDrive\Documents\transcriptie` en dubbelklik op
   **`start.bat`** (of open er een PowerShell en typ `.\start.bat`).
2. Controleer in het venster dat er staat:
   - `Transcriptie-bewaker gestart. Map: C:\Users\woutv\OneDrive\Temporary`
   - géén rode foutmelding.
   Het Whisper-model laadt pas bij het eerste bestand; dán zie je
   `device=cuda` verschijnen.
3. Laat het venster **open** staan. Zorg dat:
   - de pc **wakker blijft** (scherm mag uit; niet in slaapstand),
   - **OneDrive** aangemeld en online is,
   - de pc **internet** heeft (nodig voor de opkuis-stap).

Klaar. Vanaf nu wordt elke nieuwe opname in `Temporary` automatisch
getranscribeerd en opgekuist teruggeschreven als `<naam>_OPGEKUISD.txt`.

## UITZETTEN

Sluit het zwarte venster, of druk er `Ctrl+C` in. Meer niet. De API-sleutel en
alle instellingen blijven bewaard voor de volgende keer.

## API-sleutel — éénmalig, blijft staan

De sleutel staat permanent opgeslagen als omgevingsvariabele
`ANTHROPIC_API_KEY`. Die hoeft **niet** telkens opnieuw ingesteld te worden.

- **Controleren of ze er is** (toont de sleutel NIET):
  ```powershell
  if ($env:ANTHROPIC_API_KEY) { "OK: sleutel is ingesteld" } else { "LEEG" }
  ```
- **(Her)instellen** — enkel nodig als ze is ingetrokken of nog nooit gezet:
  ```powershell
  setx ANTHROPIC_API_KEY "PLAK-HIER-JE-SLEUTEL"
  ```
  Daarna het venster sluiten en een **vers** venster openen (de nieuwe waarde is
  pas zichtbaar in nieuwe vensters). Toon een sleutel nooit in een screenshot of
  in de chat.

## Snelle controle op locatie

- Neem een korte testopname, laat de gsm ze naar OneDrive uploaden.
- Verschijnt na enkele minuten `<naam>_OPGEKUISD.txt` in `Temporary`? Dan werkt
  de hele keten.

## Problemen oplossen

- **`device=cpu` i.p.v. `cuda`** → GPU-bibliotheken niet gevonden; herstart via
  een vers venster; desnoods `gpu-setup.bat` opnieuw draaien.
- **"Opkuis mislukt" / authenticatiefout** → sleutel niet ingesteld of geen
  tegoed. Controleer met het commando hierboven en check het tegoed op
  console.anthropic.com. De ruwe transcriptie wordt dan tóch afgeleverd.
- **Er verschijnt niets** → bestand nog niet volledig gesynct (wacht), of het is
  een OneDrive "online-only" placeholder (map op "Altijd behouden op dit
  apparaat" zetten), of het staat al in `.verwerkt.json` (verwijder dat bestand
  om alles opnieuw te doen).
- **Logboek** → `transcribeer.log` in de scriptmap toont wat er gebeurde.
