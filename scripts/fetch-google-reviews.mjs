#!/usr/bin/env node
/**
 * Haalt de Google Maps-reviews van Tersagoesting op via de Google Places API (New)
 * en schrijft ze naar data/google-reviews.json.
 *
 * Vereist Node 18+ (globale fetch).
 *
 * Omgevingsvariabelen:
 *   GOOGLE_PLACES_API_KEY  (verplicht)  API-sleutel met "Places API (New)" aan.
 *   GOOGLE_PLACE_ID        (optioneel)  Place ID (ChIJ...). Als leeg, zoekt het
 *                                       script de zaak op via de naam hieronder.
 *   GOOGLE_PLACE_QUERY     (optioneel)  Zoekterm als er geen Place ID is.
 *   MIN_RATING             (optioneel)  Minimum sterren om te tonen (default 4).
 *
 * Lokaal draaien:  GOOGLE_PLACES_API_KEY=xxx node scripts/fetch-google-reviews.mjs
 */

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = join(__dirname, '..', 'data', 'google-reviews.json');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID || '';
const PLACE_QUERY = process.env.GOOGLE_PLACE_QUERY || 'Tersagoesting Puurs-Sint-Amands';
const MIN_RATING = Number(process.env.MIN_RATING || 4);

if (!API_KEY) {
  console.error('FOUT: GOOGLE_PLACES_API_KEY ontbreekt.');
  process.exit(1);
}

async function resolvePlaceId() {
  if (PLACE_ID) return PLACE_ID;
  console.log(`Geen GOOGLE_PLACE_ID ingesteld, zoeken op: "${PLACE_QUERY}"`);
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
    },
    body: JSON.stringify({ textQuery: PLACE_QUERY, languageCode: 'nl' })
  });
  if (!res.ok) throw new Error(`Text Search faalde: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const place = data.places && data.places[0];
  if (!place) throw new Error('Geen plaats gevonden voor de zoekterm.');
  console.log(`Gevonden: ${place.displayName?.text} (${place.formattedAddress}) -> ${place.id}`);
  return place.id;
}

async function fetchPlaceDetails(placeId) {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews',
      'Accept-Language': 'nl'
    }
  });
  if (!res.ok) throw new Error(`Place Details faalde: ${res.status} ${await res.text()}`);
  return res.json();
}

function mapReviews(reviews) {
  return (reviews || [])
    .map((r) => {
      const text = (r.originalText && r.originalText.text) || (r.text && r.text.text) || '';
      return {
        author: (r.authorAttribution && r.authorAttribution.displayName) || 'Google-gebruiker',
        rating: r.rating || 0,
        text: text.trim(),
        relativeTime: r.relativePublishTimeDescription || '',
        publishTime: r.publishTime || ''
      };
    })
    .filter((r) => r.text.length > 0 && r.rating >= MIN_RATING);
}

async function main() {
  const placeId = await resolvePlaceId();
  const details = await fetchPlaceDetails(placeId);
  const reviews = mapReviews(details.reviews);

  const out = {
    rating: typeof details.rating === 'number' ? details.rating : null,
    total: typeof details.userRatingCount === 'number' ? details.userRatingCount : null,
    fetchedAt: new Date().toISOString(),
    reviews
  };

  await writeFile(OUT_FILE, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`Klaar: ${reviews.length} review(s) weggeschreven naar data/google-reviews.json (score ${out.rating}, ${out.total} beoordelingen).`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
