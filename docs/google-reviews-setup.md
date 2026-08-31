# Google-reviews automatisch tonen — setup

De landing page toont Google Maps-reviews in de recensie-carrousel. Een GitHub Action
haalt ze wekelijks op via de Google Places API en schrijft ze naar
`data/google-reviews.json`. De pagina laadt dat bestand en toont de reviews met
Google-branding, náást de bestaande ingezonden reviews.

Zolang er nog geen echte data is opgehaald, toont de site gewoon de ingezonden reviews
(geen zichtbaar verschil). De echte Google-reviews verschijnen zodra de onderstaande
stappen gezet zijn en de Action één keer gedraaid heeft.

## Wat jij eenmalig moet doen

### 1. Google Cloud + API-sleutel
1. Ga naar https://console.cloud.google.com/ en maak een (gratis) project aan.
2. Zet **billing** aan voor het project (verplicht, maar het gebruik valt ruim binnen
   de gratis maandquota).
3. Ga naar **APIs & Services → Library** en schakel **"Places API (New)"** in.
4. Ga naar **APIs & Services → Credentials → Create credentials → API key**.
5. (Aanbevolen) Klik de sleutel open en beperk hem onder **API restrictions** tot
   **Places API (New)**.

### 2. (Optioneel) Place ID opzoeken
Het script vindt jullie zaak automatisch via de naam "Tersagoesting Puurs-Sint-Amands".
Wil je 100% zekerheid, zoek dan het Place ID op via
https://developers.google.com/maps/documentation/places/web-service/place-id
en gebruik dat in stap 3.

### 3. GitHub-secrets toevoegen
In de repo op GitHub: **Settings → Secrets and variables → Actions → New repository secret**.
- `GOOGLE_PLACES_API_KEY` = je API-sleutel  (**verplicht**)
- `GOOGLE_PLACE_ID` = het Place ID  (optioneel, enkel als je stap 2 deed)

### 4. Schrijfrechten voor de Action
**Settings → Actions → General → Workflow permissions** → kies
**"Read and write permissions"** (zodat de Action het bijgewerkte JSON-bestand kan
committen).

### 5. Eén keer handmatig draaien
Tab **Actions → "Google-reviews bijwerken" → Run workflow**. Na afloop staat
`data/google-reviews.json` gevuld en verschijnen de reviews op de site (GitHub Pages
redeployt automatisch bij de commit).

Daarna draait de Action **elke maandag** vanzelf.

## Lokaal testen (optioneel)
```bash
GOOGLE_PLACES_API_KEY=jouw_sleutel npm run fetch-reviews
```
Dit schrijft `data/google-reviews.json`. Commit + push om het live te zetten.

## Instellingen
Via omgevingsvariabelen / secrets:
- `MIN_RATING` (default `4`): minimum sterren om een review te tonen.
- `GOOGLE_PLACE_QUERY`: zoekterm als er geen Place ID is
  (default "Tersagoesting Puurs-Sint-Amands").

## Aandachtspunten
- De Places API geeft **maximaal 5 reviews** terug ("meest relevante"); je kan niet
  kiezen welke.
- Google verbiedt het langdurig bewaren van reviewdata, daarom ververst de Action
  wekelijks.
- Er komen geen externe scripts of cookies op de site: enkel een lokaal JSON-bestand.
