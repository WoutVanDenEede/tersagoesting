# Blog Feature Design — Tersagoesting

## Doel

Maandelijkse blogpagina waar veelgestelde vragen over catering beantwoord worden. Elke post bevat een foto en aantrekkelijk opgemaakte tekst. De blog is goed bereikbaar vanaf de landingspagina via navigatie en een opvallende sectie.

## Aanpak

Losse HTML-bestanden per blogpost, consistent met de bestaande statische sitestructuur. Geen build-tools of JavaScript-rendering nodig.

## Bestandsstructuur

```
blog.html                              ← overzichtspagina (root, naast index.html)
blog/
  hoeveel-hapjes-per-persoon.html      ← individuele blogpost
  wat-kost-catering-feest.html         ← volgende post, etc.
images/blog/
  hoeveel-hapjes-per-persoon.jpg       ← hero-foto per post
```

## 1. Blog-overzichtspagina (`blog.html`)

### Template

Zelfde header, navigatie, footer, cookie-banner en floating CTA als alle andere pagina's (index.html, aanbod.html, cook-at-home.html).

### Inhoud

- **Hero-sectie:** Titel "Onze Blog" + subtekst "Elke maand beantwoorden wij de meest gestelde vragen over catering". Grain-textuur achtergrond, decoratieve SVG-blobs.
- **Bloggrid:** 2 kolommen op desktop, 1 kolom op mobiel. Nieuwste post bovenaan.
- **Blogkaart per post:**
  - Grote foto bovenaan (aspect-ratio consistent, bijv. 16:9)
  - Titel in Cheboyga (var(--font-heading))
  - Publicatiedatum (maand + jaar)
  - Korte intro (2-3 regels, max ~150 tekens)
  - "Lees meer →" link
  - Styling: zachte schaduw, border-radius, hover-effect (lichte lift), terracotta accent op de link. Vergelijkbaar met de "Ons Aanbod"-kaarten op de homepage.

## 2. Individuele blogpost-pagina

### Template

Zelfde header/nav/footer als overzichtspagina.

### Layout

- **Breadcrumb:** Home > Blog > [posttitel] — boven de hero
- **Hero-afbeelding:** Paginabreed, met gradient-overlay onderaan voor overgang naar content
- **Artikel-header:** Titel (Cheboyga, groot, bijv. 2.5rem desktop / 1.8rem mobiel), publicatiedatum, geschatte leestijd
- **Artikel-body:** Gecentreerd, max-width 720px
  - Bodytekst: Source Sans 3, 18px, line-height 1.8
  - Tussenkoppen: Cheboyga, terracotta kleur
  - Paragrafen: ruime margin-bottom (1.5em)
  - Pull quotes: grotere tekst, terracotta linkerborder, italic, inspringen
  - Lijsten: gestylde bullets met terracotta kleur
  - Grain-textuur achtergrond (consistent met site)
- **CTA-blok onderaan artikel:** "Heb je een vraag voor volgende maand? Laat het ons weten!" met link naar contactformulier (index.html#contact). Gestyled als opvallend blok met terracotta achtergrond en witte tekst.
- **Navigatie-links:** "← Terug naar alle artikels" link onderaan

### SEO per post

- Eigen `<title>`: "[Posttitel] | Blog | Tersagoesting"
- Eigen `<meta name="description">` per post
- Canonical URL: `https://tersagoesting.be/blog/[slug].html`
- Open Graph + Twitter Card tags
- Structured data: BlogPosting schema (headline, datePublished, author, image, articleBody-samenvatting)

## 3. Landingspagina-aanpassingen (`index.html`)

### Navigatie (header)

"Blog" link toevoegen in `<nav>`, tussen "Contact" en de CTA-knop "Vraag een offerte":

```html
<a href="blog.html" class="nav-link">Blog</a>
```

### Nieuwe blog-sectie op homepage

Positie: na de recensies-sectie (na lijn ~437), vóór het Instagram-blok (lijn ~439).

Inhoud:
- Sectietitel: "Tips & inspiratie voor jouw feest" (Cheboyga)
- Subtekst: "Elke maand beantwoorden wij de meest gestelde catering-vragen"
- 2-3 meest recente blogposts als horizontale preview-kaarten (foto links, tekst rechts op desktop; gestapeld op mobiel)
- "Bekijk alle artikels →" knop (btn btn-primary)
- Decoratieve SVG-blob + grain-textuur, consistent met andere secties

### Footer

"Blog" link toevoegen in de navigatiekolom (footer-links), na "Cook@Home":

```html
<a href="blog.html">Blog</a>
```

## 4. Styling (`style.css`)

Alle nieuwe CSS wordt toegevoegd aan het bestaande `style.css` bestand. Belangrijkste klassen:

- `.blog-hero` — hero-sectie op overzichtspagina
- `.blog-grid` — CSS grid container (2 kolommen desktop)
- `.blog-card` — individuele kaart met foto, titel, datum, intro
- `.blog-card:hover` — subtiel lift-effect
- `.blog-post-hero` — paginabrede hero-afbeelding op postpagina
- `.blog-post-body` — artikel-container, max-width 720px, gecentreerd
- `.blog-post-body h2, h3` — tussenkoppen in Cheboyga + terracotta
- `.blog-pullquote` — pull quote styling
- `.blog-cta` — CTA-blok onderaan artikel
- `.blog-breadcrumb` — breadcrumb-navigatie
- `.blog-preview` — homepage blog-preview sectie
- `.blog-preview-card` — horizontale kaart op homepage

Responsive breakpoints: volgen bestaande patronen in style.css (768px, 600px).

## 5. Maandelijkse workflow

1. Gebruiker levert tekst + foto aan
2. Tekst wordt gereviewd en geanalyseerd op basis van het blog-prompt-template (docs/blog-prompt-template.md): 5 invalshoeken brainstormen, titel kiezen, structuur opzetten, content schrijven. Resultaat wordt voorgelegd aan de gebruiker voor feedback en eventuele aanpassingen. Pas na expliciete 'go' wordt de post gebouwd.
3. Nieuw HTML-bestand aanmaken in `/blog/` op basis van het post-template
4. Foto optimaliseren (WebP + JPG fallback) en plaatsen in `images/blog/`
5. Kaart toevoegen aan `blog.html` (bovenaan het grid)
6. Homepage blog-preview updaten met de nieuwste posts

## 6. Buiten scope

- Zoekfunctionaliteit op de blog
- Categorieën of tags
- Commentaarsysteem
- RSS-feed
- Paginering (pas relevant bij 10+ posts)
