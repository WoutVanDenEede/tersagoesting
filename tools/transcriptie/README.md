# Transcriptie-bewaker

Automatische keten om audio-interviews te transcriberen en op te kuisen:

```
GSM neemt op ──► OneDrive synct naar  C:\Users\woutv\OneDrive\Temporary
                         │
                         ▼
        Deze bewaker (draait op je pc, altijd aan)
                         │
        1. Wacht tot het audiobestand volledig en stabiel is
        2. Transcribeert lokaal met Whisper (Nederlands)
        3. Kuist de tekst op via de 'transcriptie'-opkuisinstructie
                         │
                         ▼
        <naam>_OPGEKUISD.txt  ── terug in dezelfde OneDrive-map
                         │
                         ▼
        Laptop: openen en artikel schrijven
```

## Waarom dit betrouwbaar is

De cloud kan niet in je lokale OneDrive-map kijken — daarom draait alles **op je
eigen pc**. Deze punten dekken elk een klassieke faalreden af:

| Risico | Oplossing in dit script |
|--------|-------------------------|
| Half-geüpload bestand verwerken | Stabiliteitscheck (`stable_seconds`) |
| OneDrive "online-only" placeholder | Detectie + download afdwingen |
| Zelfde bestand oneindig verwerken | Logboek `.verwerkt.json` |
| Eén corrupt bestand blokkeert de rest | Per-bestand foutafscherming |
| Halve output-bestanden | Atomair wegschrijven (`.tmp` → hernoemen) |
| Script draait niet meer na herstart | Autostart via Taakplanner + herstart-bij-fout |
| Geen internet op locatie | Transcriptie is 100% lokaal (enkel opkuis online) |

## Installatie

Zie **[INSTALLATIE.md](INSTALLATIE.md)** voor de stap-voor-stap-setup op Windows.

## Bestanden

| Bestand | Rol |
|---------|-----|
| `transcribeer.py` | Het hoofdscript (bewaker + transcriptie + opkuis) |
| `config.example.ini` | Voorbeeldconfiguratie — kopieer naar `config.ini` |
| `opkuis_prompt.md` | De opkuisinstructie (jouw 'transcriptie'-normen) |
| `requirements.txt` | Python-pakketten |
| `start.bat` | Startscript voor de Taakplanner |
| `INSTALLATIE.md` | Installatiegids |

## Opkuis aanpassen

De manier waarop transcripties opgekuist worden staat in `opkuis_prompt.md`.
Pas die tekst gerust aan (bv. andere sprekerslabels of striktere/lossere
opkuis); de bewaker gebruikt automatisch de nieuwste versie bij het volgende
interview. Dezelfde instructie zit ook als Claude Code-skill in
`.claude/skills/transcriptie/`, zodat je een transcriptie later ook handmatig in
een Claude-sessie kunt laten opkuisen.
