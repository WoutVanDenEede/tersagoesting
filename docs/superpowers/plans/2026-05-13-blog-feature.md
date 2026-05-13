# Blog Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a blog system with overview page, individual post pages, and homepage integration to the Tersagoesting static website.

**Architecture:** Losse HTML-bestanden per blogpost in een `/blog/` map, met een `blog.html` overzichtspagina in de root. Alle styling wordt toegevoegd aan het bestaande `style.css`. De homepage krijgt een blog-preview sectie en navigatielink.

**Tech Stack:** Plain HTML, CSS, vanilla JavaScript (consistent with existing site)

---

### Task 1: Add blog CSS to style.css

**Files:**
- Modify: `style.css` (append after line 3023)

- [ ] **Step 1: Add blog overview page styles**

Append to end of `style.css`:

```css
/* ===== BLOG ===== */
.blog-hero {
    background-color: var(--color-bg);
    padding: 60px 0 50px;
    position: relative;
    overflow: hidden;
}

.blog-hero .container {
    position: relative;
    z-index: 1;
}

.blog-hero-title {
    text-align: center;
    margin-bottom: 12px;
}

.blog-hero-subtitle {
    text-align: center;
    color: var(--color-text-light);
    font-size: 1.1rem;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.7;
}

.blog-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
}

.blog-card {
    background: var(--color-bg-white);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: var(--transition);
    text-decoration: none;
    color: inherit;
    display: block;
}

.blog-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-hover);
}

.blog-card-image {
    aspect-ratio: 16 / 9;
    overflow: hidden;
}

.blog-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition);
}

.blog-card:hover .blog-card-image img {
    transform: scale(1.05);
}

.blog-card-body {
    padding: 24px;
}

.blog-card-body h3 {
    font-family: var(--font-heading);
    font-size: 1.3rem;
    color: var(--color-primary);
    margin-bottom: 8px;
}

.blog-card-date {
    font-size: 0.85rem;
    color: var(--color-text-light);
    margin-bottom: 12px;
}

.blog-card-body p {
    color: var(--color-text-light);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 16px;
}

.blog-card-link {
    font-family: var(--font-heading);
    color: var(--color-primary);
    font-size: 1rem;
    text-decoration: none;
}

.blog-card-link:hover {
    color: var(--color-primary-dark);
}

@media (max-width: 768px) {
    .blog-grid {
        grid-template-columns: 1fr;
        gap: 24px;
    }
}
```

- [ ] **Step 2: Add blog post page styles**

Continue appending to `style.css`:

```css
/* ===== BLOG POST ===== */
.blog-breadcrumb {
    padding: 16px 0;
    font-size: 0.9rem;
    color: var(--color-text-light);
}

.blog-breadcrumb a {
    color: var(--color-primary);
    text-decoration: none;
}

.blog-breadcrumb a:hover {
    text-decoration: underline;
}

.blog-breadcrumb span {
    margin: 0 8px;
}

.blog-post-hero {
    width: 100%;
    height: 400px;
    position: relative;
    overflow: hidden;
}

.blog-post-hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.blog-post-hero::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: linear-gradient(to top, var(--color-bg), transparent);
}

.blog-post-header {
    text-align: center;
    max-width: 720px;
    margin: -40px auto 0;
    position: relative;
    z-index: 2;
    padding: 0 24px;
}

.blog-post-header h1 {
    font-family: var(--font-heading);
    font-size: 2.5rem;
    color: var(--color-primary);
    margin-bottom: 12px;
    line-height: 1.2;
}

.blog-post-meta {
    color: var(--color-text-light);
    font-size: 0.95rem;
    margin-bottom: 40px;
}

.blog-post-meta span {
    margin: 0 8px;
}

.blog-post-body {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 24px 60px;
    font-size: 1.125rem;
    line-height: 1.8;
    color: var(--color-text);
}

.blog-post-body h2 {
    font-family: var(--font-heading);
    font-size: 1.6rem;
    color: var(--color-primary);
    margin: 48px 0 16px;
}

.blog-post-body h3 {
    font-family: var(--font-heading);
    font-size: 1.3rem;
    color: var(--color-primary);
    margin: 32px 0 12px;
}

.blog-post-body p {
    margin-bottom: 1.5em;
}

.blog-post-body ul,
.blog-post-body ol {
    margin-bottom: 1.5em;
    padding-left: 1.5em;
}

.blog-post-body li {
    margin-bottom: 0.5em;
}

.blog-post-body li::marker {
    color: var(--color-primary);
}

.blog-post-body strong {
    color: var(--color-text);
    font-weight: 600;
}

.blog-pullquote {
    border-left: 4px solid var(--color-primary);
    padding: 16px 24px;
    margin: 32px 0;
    font-style: italic;
    font-size: 1.25rem;
    color: var(--color-primary);
    line-height: 1.6;
    background: var(--color-cream-light);
    border-radius: 0 var(--radius) var(--radius) 0;
}

.blog-cta {
    background: var(--color-primary);
    color: white;
    border-radius: var(--radius);
    padding: 40px;
    text-align: center;
    margin: 48px 0;
}

.blog-cta h3 {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    color: white;
    margin-bottom: 12px;
}

.blog-cta p {
    margin-bottom: 24px;
    opacity: 0.9;
}

.blog-cta .btn {
    background: white;
    color: var(--color-primary);
    border-color: white;
}

.blog-cta .btn:hover {
    background: var(--color-cream-light);
    border-color: var(--color-cream-light);
    transform: translateY(-2px);
}

.blog-back-link {
    display: inline-block;
    color: var(--color-primary);
    text-decoration: none;
    font-family: var(--font-heading);
    font-size: 1rem;
    margin-bottom: 40px;
}

.blog-back-link:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .blog-post-hero {
        height: 250px;
    }

    .blog-post-header h1 {
        font-size: 1.8rem;
    }

    .blog-post-body {
        font-size: 1rem;
    }

    .blog-pullquote {
        font-size: 1.1rem;
    }

    .blog-cta {
        padding: 28px 20px;
    }
}
```

- [ ] **Step 3: Add homepage blog-preview section styles**

Continue appending to `style.css`:

```css
/* ===== BLOG PREVIEW (HOMEPAGE) ===== */
.blog-preview {
    background-color: var(--color-bg);
}

.blog-preview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    margin-bottom: 32px;
}

.blog-preview-card {
    background: var(--color-bg-white);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: var(--transition);
    text-decoration: none;
    color: inherit;
    display: block;
}

.blog-preview-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-hover);
}

.blog-preview-card-image {
    aspect-ratio: 16 / 9;
    overflow: hidden;
}

.blog-preview-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition);
}

.blog-preview-card:hover .blog-preview-card-image img {
    transform: scale(1.05);
}

.blog-preview-card-body {
    padding: 20px;
}

.blog-preview-card-body h3 {
    font-family: var(--font-heading);
    font-size: 1.15rem;
    color: var(--color-primary);
    margin-bottom: 8px;
}

.blog-preview-card-body p {
    color: var(--color-text-light);
    font-size: 0.95rem;
    line-height: 1.5;
}

.blog-preview-cta {
    text-align: center;
}

@media (max-width: 992px) {
    .blog-preview-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .blog-preview-grid {
        grid-template-columns: 1fr;
    }
}
```

- [ ] **Step 4: Commit CSS changes**

```bash
git add style.css
git commit -m "feat(blog): add all blog CSS — overview, post, homepage preview"
```

---

### Task 2: Create blog overview page (blog.html)

**Files:**
- Create: `blog.html`

- [ ] **Step 1: Create blog.html**

Create `blog.html` in the project root. This uses the same header/nav/footer template as all other pages (matching `cook-at-home.html` pattern), but with "Blog" nav-link marked active. Use placeholder blog cards — these will be replaced with real content when posts are written.

```html
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <!-- Google Analytics (loaded after cookie consent) -->
    <script>
    window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
    if(localStorage.getItem('cookieConsent')==='accepted'){
        var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-B359G3PM00';document.head.appendChild(s);
        gtag('js',new Date());gtag('config','G-B359G3PM00');
    }
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog | Tersagoesting — Tips &amp; inspiratie voor jouw feest</title>
    <meta name="description" content="Elke maand beantwoorden wij de meest gestelde vragen over catering. Tips, inspiratie en praktische info voor jouw feest.">
    <meta name="keywords" content="catering blog, catering tips, feest organiseren, hapjes tips, catering Puurs, traiteur blog, hoeveel hapjes per persoon, catering kosten">
    <meta name="author" content="Tersagoesting">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://tersagoesting.be/blog.html">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Blog | Tersagoesting — Tips &amp; inspiratie voor jouw feest">
    <meta property="og:description" content="Elke maand beantwoorden wij de meest gestelde vragen over catering. Tips, inspiratie en praktische info voor jouw feest.">
    <meta property="og:url" content="https://tersagoesting.be/blog.html">
    <meta property="og:image" content="https://tersagoesting.be/images/foto-hero2.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="nl_BE">
    <meta property="og:site_name" content="Tersagoesting">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Blog | Tersagoesting — Tips &amp; inspiratie voor jouw feest">
    <meta name="twitter:description" content="Elke maand beantwoorden wij de meest gestelde vragen over catering. Tips, inspiratie en praktische info voor jouw feest.">
    <meta name="twitter:image" content="https://tersagoesting.be/images/foto-hero2.jpg">

    <!-- Favicon -->
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="icon" href="images/favicon-32.png" type="image/png" sizes="32x32">
    <link rel="icon" href="images/favicon-512.png" type="image/png" sizes="512x512">
    <link rel="apple-touch-icon" href="images/apple-touch-icon.png">

    <!-- Preconnect third-party origins -->
    <link rel="preconnect" href="https://www.googletagmanager.com">

    <!-- Font preload -->
    <link rel="preload" href="fonts/Cheboyga.ttf" as="font" type="font/ttf" crossorigin>

    <!-- Fonts worden lokaal geladen via CSS @font-face -->
    <link rel="stylesheet" href="style.css?v=23">
</head>
<body>

    <!-- Top banner -->
    <div class="top-bar">
        <p>Catering en traiteur in en rond Puurs-Sint-Amands <a href="index.html#contact">Vraag een offerte!</a></p>
    </div>

    <!-- Navigation -->
    <header class="header" id="header">
        <div class="container header-inner">
            <a href="index.html" class="logo">
                <picture><source srcset="images/logo-tersagoesting.webp" type="image/webp"><img src="images/logo-tersagoesting.png" alt="Tersagoesting - Catering en traiteur in Puurs" class="logo-img" width="1088" height="710"></picture>
            </a>
            <nav class="nav" id="nav">
                <div class="nav-dropdown">
                    <a href="aanbod.html" class="nav-link">Ons aanbod ▾</a>
                    <div class="nav-dropdown-menu">
                        <a href="hapjes-bestellen.html">Hapjes &amp; Dessertjes</a>
                        <a href="aanbod.html#formules">Buffetten</a>
                        <a href="cook-at-home.html">Cook@Home</a>
                        <a href="aanbod.html#bbq-aanbod">BBQ</a>
                        <a href="aanbod.html#formules">Pasta &amp; Burger</a>
                    </div>
                </div>
                <a href="index.html#hoe-bestellen" class="nav-link">Hoe bestel ik?</a>
                <a href="blog.html" class="nav-link">Blog</a>
                <a href="index.html#contact" class="nav-link">Contact</a>
                <a href="index.html#contact" class="nav-link nav-cta">Vraag een offerte</a>
            </nav>
            <button class="menu-toggle" id="menuToggle" aria-label="Menu openen">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>

    <main id="main-content">

    <!-- Blog Hero -->
    <section class="blog-hero grain-texture">
        <svg class="svg-deco svg-deco--recensies-right" viewBox="0 0 458.61 765.64" aria-hidden="true"><path d="M51.63,254.13c115.6,61.34,246.09,76.57,364.42,132.1,2.39,1.12,3.59,4.06,2.51,6.47-5.22,11.6-13.29,21.8-21.29,31.76-31.77,39.54-68.25,80.92-117.98,90.88-30.45,6.1-62.01-.64-91.61-10.03-36-11.42-71.26-27.14-100.02-51.63-28.76-24.48-50.63-58.56-54.82-96.1-3.93-35.13,7.51-69.95,18.8-103.45" fill="#e0a24a"/></svg>
        <div class="container">
            <h1 class="section-title blog-hero-title">Onze Blog</h1>
            <p class="section-subtitle blog-hero-subtitle">Elke maand beantwoorden wij de meest gestelde vragen over catering</p>
        </div>
    </section>

    <!-- Blog Grid -->
    <section class="section">
        <div class="container">
            <div class="blog-grid">

                <!-- Placeholder: wordt vervangen door echte posts -->
                <p style="grid-column:1/-1;text-align:center;color:var(--color-text-light);font-size:1.1rem;">Binnenkort verschijnen hier onze eerste blogartikels. Houd ons in de gaten!</p>

                <!-- TEMPLATE voor een blogkaart (kopieer voor elke nieuwe post):
                <a href="blog/slug-hier.html" class="blog-card">
                    <div class="blog-card-image">
                        <picture>
                            <source srcset="images/blog/slug-hier.webp" type="image/webp">
                            <img src="images/blog/slug-hier.jpg" alt="Beschrijving" width="600" height="338" loading="lazy">
                        </picture>
                    </div>
                    <div class="blog-card-body">
                        <h3>Titel van het artikel</h3>
                        <p class="blog-card-date">mei 2026</p>
                        <p>Korte intro van max ~150 tekens die de lezer nieuwsgierig maakt naar het volledige artikel.</p>
                        <span class="blog-card-link">Lees meer &rarr;</span>
                    </div>
                </a>
                -->

            </div>
        </div>
    </section>

    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container footer-inner">
            <div class="footer-brand">
                <p>Goesting gekregen?</p>
            </div>
            <div class="footer-links">
                <h4>Navigatie</h4>
                <a href="aanbod.html">Ons aanbod</a>
                <a href="hapjes-bestellen.html">Hapjes &amp; Dessertjes</a>
                <a href="cook-at-home.html">Cook@Home</a>
                <a href="blog.html">Blog</a>
                <a href="index.html#hoe-bestellen">Hoe bestel ik?</a>
                <a href="index.html#contact">Contact</a>
            </div>
            <div class="footer-links">
                <h4>Catering in de regio</h4>
                <a href="catering-temse.html">Catering Temse</a>
                <a href="catering-bornem.html">Catering Bornem</a>
                <a href="catering-mechelen.html">Catering Mechelen</a>
                <a href="catering-sint-niklaas.html">Catering Sint-Niklaas</a>
                <a href="catering-willebroek.html">Catering Willebroek</a>
                <a href="catering-duffel.html">Catering Duffel</a>
                <a href="catering-londerzeel.html">Catering Londerzeel</a>
            </div>
            <div class="footer-contact">
                <h4>Contact</h4>
                <p>tersagoesting@gmail.com</p>
                <p>0476 62 40 11</p>
                <p>Vijverstraat 67, 2870 Puurs-Sint-Amands</p>
                <div class="footer-social">
                    <a href="https://www.instagram.com/tersagoesting/" target="_blank" rel="noopener">Instagram</a>
                    <a href="https://www.facebook.com/profile.php?id=61558171506722" target="_blank" rel="noopener">Facebook</a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <p>&copy; 2026 Tersagoesting. Alle rechten voorbehouden. | <a href="privacybeleid.html">Privacybeleid</a></p>
            </div>
        </div>
    </footer>

    <!-- Cookie consent banner -->
    <div class="cookie-banner" id="cookieBanner" role="dialog" aria-label="Cookie-instellingen">
        <p>Deze website gebruikt cookies voor analyse (Google Analytics). Door verder te surfen ga je akkoord met ons <a href="privacybeleid.html">privacybeleid</a>.</p>
        <div class="cookie-buttons">
            <button class="btn btn-primary cookie-accept" id="cookieAccept">Akkoord</button>
            <button class="btn btn-outline cookie-decline" id="cookieDecline">Weigeren</button>
        </div>
    </div>

    <!-- Floating CTA button -->
    <a href="index.html#contact" class="floating-cta bestel-cta" id="floatingCta">Vraag een offerte!</a>

    <script src="script.js?v=22"></script>

</body>
</html>
```

- [ ] **Step 2: Commit blog.html**

```bash
git add blog.html
git commit -m "feat(blog): add blog overview page with card grid template"
```

---

### Task 3: Create blog post template page

**Files:**
- Create: `blog/` directory
- Create: `blog/_template.html` (reference template for future posts)

- [ ] **Step 1: Create blog directory and template**

Create `blog/_template.html` — this is a reference file that gets copied and filled in for each new blog post. Placeholders are marked with `{{...}}`.

```html
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <!-- Google Analytics (loaded after cookie consent) -->
    <script>
    window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
    if(localStorage.getItem('cookieConsent')==='accepted'){
        var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-B359G3PM00';document.head.appendChild(s);
        gtag('js',new Date());gtag('config','G-B359G3PM00');
    }
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITEL}} | Blog | Tersagoesting</title>
    <meta name="description" content="{{META_DESCRIPTION}}">
    <meta name="keywords" content="{{KEYWORDS}}">
    <meta name="author" content="Tersagoesting">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://tersagoesting.be/blog/{{SLUG}}.html">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="{{TITEL}} | Blog | Tersagoesting">
    <meta property="og:description" content="{{META_DESCRIPTION}}">
    <meta property="og:url" content="https://tersagoesting.be/blog/{{SLUG}}.html">
    <meta property="og:image" content="https://tersagoesting.be/images/blog/{{SLUG}}.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="nl_BE">
    <meta property="og:site_name" content="Tersagoesting">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{TITEL}} | Blog | Tersagoesting">
    <meta name="twitter:description" content="{{META_DESCRIPTION}}">
    <meta name="twitter:image" content="https://tersagoesting.be/images/blog/{{SLUG}}.jpg">

    <!-- Favicon -->
    <link rel="icon" href="../favicon.ico" type="image/x-icon">
    <link rel="icon" href="../images/favicon-32.png" type="image/png" sizes="32x32">
    <link rel="icon" href="../images/favicon-512.png" type="image/png" sizes="512x512">
    <link rel="apple-touch-icon" href="../images/apple-touch-icon.png">

    <!-- Preconnect third-party origins -->
    <link rel="preconnect" href="https://www.googletagmanager.com">

    <!-- Font preload -->
    <link rel="preload" href="../fonts/Cheboyga.ttf" as="font" type="font/ttf" crossorigin>

    <!-- Fonts worden lokaal geladen via CSS @font-face -->
    <link rel="stylesheet" href="../style.css?v=23">

    <!-- SEO: Structured Data - BlogPosting -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "{{TITEL}}",
        "description": "{{META_DESCRIPTION}}",
        "image": "https://tersagoesting.be/images/blog/{{SLUG}}.jpg",
        "datePublished": "{{YYYY-MM-DD}}",
        "dateModified": "{{YYYY-MM-DD}}",
        "author": {
            "@type": "Organization",
            "name": "Tersagoesting",
            "url": "https://tersagoesting.be"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Tersagoesting",
            "logo": {
                "@type": "ImageObject",
                "url": "https://tersagoesting.be/images/logo-tersagoesting.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://tersagoesting.be/blog/{{SLUG}}.html"
        }
    }
    </script>
</head>
<body>

    <!-- Top banner -->
    <div class="top-bar">
        <p>Catering en traiteur in en rond Puurs-Sint-Amands <a href="../index.html#contact">Vraag een offerte!</a></p>
    </div>

    <!-- Navigation -->
    <header class="header" id="header">
        <div class="container header-inner">
            <a href="../index.html" class="logo">
                <picture><source srcset="../images/logo-tersagoesting.webp" type="image/webp"><img src="../images/logo-tersagoesting.png" alt="Tersagoesting - Catering en traiteur in Puurs" class="logo-img" width="1088" height="710"></picture>
            </a>
            <nav class="nav" id="nav">
                <div class="nav-dropdown">
                    <a href="../aanbod.html" class="nav-link">Ons aanbod ▾</a>
                    <div class="nav-dropdown-menu">
                        <a href="../hapjes-bestellen.html">Hapjes &amp; Dessertjes</a>
                        <a href="../aanbod.html#formules">Buffetten</a>
                        <a href="../cook-at-home.html">Cook@Home</a>
                        <a href="../aanbod.html#bbq-aanbod">BBQ</a>
                        <a href="../aanbod.html#formules">Pasta &amp; Burger</a>
                    </div>
                </div>
                <a href="../index.html#hoe-bestellen" class="nav-link">Hoe bestel ik?</a>
                <a href="../blog.html" class="nav-link">Blog</a>
                <a href="../index.html#contact" class="nav-link">Contact</a>
                <a href="../index.html#contact" class="nav-link nav-cta">Vraag een offerte</a>
            </nav>
            <button class="menu-toggle" id="menuToggle" aria-label="Menu openen">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>

    <main id="main-content">

    <!-- Breadcrumb -->
    <div class="container">
        <nav class="blog-breadcrumb" aria-label="Breadcrumb">
            <a href="../index.html">Home</a><span>›</span>
            <a href="../blog.html">Blog</a><span>›</span>
            {{TITEL}}
        </nav>
    </div>

    <!-- Hero Image -->
    <div class="blog-post-hero">
        <picture>
            <source srcset="../images/blog/{{SLUG}}.webp" type="image/webp">
            <img src="../images/blog/{{SLUG}}.jpg" alt="{{TITEL}}" width="1200" height="675">
        </picture>
    </div>

    <!-- Article Header -->
    <div class="blog-post-header">
        <h1>{{TITEL}}</h1>
        <p class="blog-post-meta">{{MAAND JAAR}}<span>·</span>{{X}} min leestijd</p>
    </div>

    <!-- Article Body -->
    <article class="blog-post-body grain-texture">

        {{ARTIKEL_INHOUD}}

        <!-- Voorbeeld structuur:
        <p>Introductie paragraaf...</p>

        <h2>Tussenkop</h2>
        <p>Paragraaf tekst...</p>

        <blockquote class="blog-pullquote">
            Een opvallende quote of kernzin uit het artikel.
        </blockquote>

        <h2>Nog een tussenkop</h2>
        <p>Meer tekst...</p>

        <ul>
            <li>Lijstitem 1</li>
            <li>Lijstitem 2</li>
        </ul>
        -->

        <!-- CTA blok -->
        <div class="blog-cta">
            <h3>Heb je een vraag voor volgende maand?</h3>
            <p>Laat het ons weten en misschien beantwoorden wij jouw vraag in ons volgende artikel!</p>
            <a href="../index.html#contact" class="btn">Stel je vraag &rarr;</a>
        </div>

        <a href="../blog.html" class="blog-back-link">&larr; Terug naar alle artikels</a>

    </article>

    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container footer-inner">
            <div class="footer-brand">
                <p>Goesting gekregen?</p>
            </div>
            <div class="footer-links">
                <h4>Navigatie</h4>
                <a href="../aanbod.html">Ons aanbod</a>
                <a href="../hapjes-bestellen.html">Hapjes &amp; Dessertjes</a>
                <a href="../cook-at-home.html">Cook@Home</a>
                <a href="../blog.html">Blog</a>
                <a href="../index.html#hoe-bestellen">Hoe bestel ik?</a>
                <a href="../index.html#contact">Contact</a>
            </div>
            <div class="footer-links">
                <h4>Catering in de regio</h4>
                <a href="../catering-temse.html">Catering Temse</a>
                <a href="../catering-bornem.html">Catering Bornem</a>
                <a href="../catering-mechelen.html">Catering Mechelen</a>
                <a href="../catering-sint-niklaas.html">Catering Sint-Niklaas</a>
                <a href="../catering-willebroek.html">Catering Willebroek</a>
                <a href="../catering-duffel.html">Catering Duffel</a>
                <a href="../catering-londerzeel.html">Catering Londerzeel</a>
            </div>
            <div class="footer-contact">
                <h4>Contact</h4>
                <p>tersagoesting@gmail.com</p>
                <p>0476 62 40 11</p>
                <p>Vijverstraat 67, 2870 Puurs-Sint-Amands</p>
                <div class="footer-social">
                    <a href="https://www.instagram.com/tersagoesting/" target="_blank" rel="noopener">Instagram</a>
                    <a href="https://www.facebook.com/profile.php?id=61558171506722" target="_blank" rel="noopener">Facebook</a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <p>&copy; 2026 Tersagoesting. Alle rechten voorbehouden. | <a href="../privacybeleid.html">Privacybeleid</a></p>
            </div>
        </div>
    </footer>

    <!-- Cookie consent banner -->
    <div class="cookie-banner" id="cookieBanner" role="dialog" aria-label="Cookie-instellingen">
        <p>Deze website gebruikt cookies voor analyse (Google Analytics). Door verder te surfen ga je akkoord met ons <a href="../privacybeleid.html">privacybeleid</a>.</p>
        <div class="cookie-buttons">
            <button class="btn btn-primary cookie-accept" id="cookieAccept">Akkoord</button>
            <button class="btn btn-outline cookie-decline" id="cookieDecline">Weigeren</button>
        </div>
    </div>

    <!-- Floating CTA button -->
    <a href="../index.html#contact" class="floating-cta bestel-cta" id="floatingCta">Vraag een offerte!</a>

    <script src="../script.js?v=22"></script>

</body>
</html>
```

- [ ] **Step 2: Commit blog post template**

```bash
git add blog/_template.html
git commit -m "feat(blog): add blog post template with SEO and structured data"
```

---

### Task 4: Add Blog link to index.html navigation and footer

**Files:**
- Modify: `index.html:219` (nav — add Blog link between Contact and CTA)
- Modify: `index.html:801` (footer — add Blog link after Cook@Home)

- [ ] **Step 1: Add Blog to header navigation**

In `index.html`, find line 219:
```html
                <a href="#contact" class="nav-link">Contact</a>
```

Insert BEFORE this line:
```html
                <a href="blog.html" class="nav-link">Blog</a>
```

- [ ] **Step 2: Add Blog to footer navigation**

In `index.html`, find the footer-links section (line ~800). After the Cook@Home link:
```html
                <a href="cook-at-home.html">Cook@Home</a>
```

Insert after it:
```html
                <a href="blog.html">Blog</a>
```

- [ ] **Step 3: Commit navigation changes**

```bash
git add index.html
git commit -m "feat(blog): add Blog link to header nav and footer"
```

---

### Task 5: Add blog preview section to homepage

**Files:**
- Modify: `index.html:437-438` (insert new section between recensies and Instagram)

- [ ] **Step 1: Add blog preview section**

In `index.html`, after line 437 (closing `</section>` of recensies) and before line 439 (Instagram Feed comment), insert:

```html

    <!-- Blog Preview -->
    <section class="section blog-preview grain-texture" id="blog" style="position:relative;overflow:hidden;">
        <svg class="svg-deco svg-deco--social-left" viewBox="0 0 458.61 765.64" aria-hidden="true"><path d="M442.35,93.83c4.53-.82,9.9-1.38,13.05,1.97,2.1,2.24,2.48,5.55,2.7,8.61,6.53,93.41-50.32,188.49-136.46,225.2-29.22,12.45-61.7,18.55-93.06,13.51-39.87-6.41-75.65-30.7-100.34-62.66-24.69-31.96-38.92-68.41-45.6-108.24l359.71-78.4Z" fill="#b3b062"/></svg>
        <div class="container">
            <h2 class="section-title">Tips &amp; inspiratie voor jouw feest</h2>
            <p class="section-subtitle">Elke maand beantwoorden wij de meest gestelde catering-vragen</p>
            <div class="blog-preview-grid">

                <!-- Placeholder: wordt vervangen zodra eerste posts live zijn -->
                <p style="grid-column:1/-1;text-align:center;color:var(--color-text-light);">Binnenkort verschijnen hier onze eerste blogartikels!</p>

                <!-- TEMPLATE voor homepage preview-kaart:
                <a href="blog/slug-hier.html" class="blog-preview-card">
                    <div class="blog-preview-card-image">
                        <picture>
                            <source srcset="images/blog/slug-hier.webp" type="image/webp">
                            <img src="images/blog/slug-hier.jpg" alt="Beschrijving" width="600" height="338" loading="lazy">
                        </picture>
                    </div>
                    <div class="blog-preview-card-body">
                        <h3>Titel van het artikel</h3>
                        <p>Korte intro tekst...</p>
                    </div>
                </a>
                -->

            </div>
            <div class="blog-preview-cta">
                <a href="blog.html" class="btn btn-primary">Bekijk alle artikels &rarr;</a>
            </div>
        </div>
    </section>
```

- [ ] **Step 2: Commit homepage blog section**

```bash
git add index.html
git commit -m "feat(blog): add blog preview section to homepage after recensies"
```

---

### Task 6: Update all existing subpages with Blog nav link

**Files:**
- Modify: `aanbod.html` (nav + footer)
- Modify: `hapjes-bestellen.html` (nav + footer)
- Modify: `cook-at-home.html` (nav + footer)
- Modify: `catering-temse.html` (nav + footer)
- Modify: `catering-bornem.html` (nav + footer)
- Modify: `catering-mechelen.html` (nav + footer)
- Modify: `catering-sint-niklaas.html` (nav + footer)
- Modify: `catering-willebroek.html` (nav + footer)
- Modify: `catering-duffel.html` (nav + footer)
- Modify: `catering-londerzeel.html` (nav + footer)
- Modify: `privacybeleid.html` (nav + footer)
- Modify: `bedankt.html` (nav + footer)

- [ ] **Step 1: Add Blog link to nav on each subpage**

For each file listed above, find the nav Contact link:
```html
                <a href="index.html#contact" class="nav-link">Contact</a>
```

Insert BEFORE it:
```html
                <a href="blog.html" class="nav-link">Blog</a>
```

For pages that use `#contact` (without `index.html` prefix) instead, find:
```html
                <a href="#contact" class="nav-link">Contact</a>
```

And insert before it:
```html
                <a href="blog.html" class="nav-link">Blog</a>
```

- [ ] **Step 2: Add Blog link to footer on each subpage**

For each file, find the footer Cook@Home link and insert `<a href="blog.html">Blog</a>` after it. The Cook@Home link may appear as:
```html
                <a href="cook-at-home.html">Cook@Home</a>
```

Insert after:
```html
                <a href="blog.html">Blog</a>
```

- [ ] **Step 3: Commit subpage updates**

```bash
git add aanbod.html hapjes-bestellen.html cook-at-home.html catering-*.html privacybeleid.html bedankt.html
git commit -m "feat(blog): add Blog link to nav and footer on all subpages"
```

---

### Task 7: Bump CSS version across all pages

**Files:**
- Modify: all HTML files that reference `style.css?v=22`

- [ ] **Step 1: Update style.css version query string**

In every HTML file, change:
```html
<link rel="stylesheet" href="style.css?v=22">
```
to:
```html
<link rel="stylesheet" href="style.css?v=23">
```

And for blog subpages (already created with v=23):
```html
<link rel="stylesheet" href="../style.css?v=23">
```
(already correct in template)

- [ ] **Step 2: Commit version bump**

```bash
git add *.html
git commit -m "chore: bump style.css cache version to v=23"
```

---

### Task 8: Create images/blog directory

**Files:**
- Create: `images/blog/` directory (with .gitkeep)

- [ ] **Step 1: Create directory**

```bash
mkdir -p images/blog
touch images/blog/.gitkeep
```

- [ ] **Step 2: Commit**

```bash
git add images/blog/.gitkeep
git commit -m "chore: add images/blog directory for blog post photos"
```

---

### Task 9: Visual verification

- [ ] **Step 1: Start dev server and verify blog.html**

Open `blog.html` in browser. Verify:
- Header with Blog link in nav (highlighted/accessible)
- Hero section with title and subtitle
- Grain texture background
- SVG decorative blob
- Placeholder message centered
- Footer with Blog link
- Floating CTA button
- Mobile: burger menu shows Blog link

- [ ] **Step 2: Verify index.html changes**

Open `index.html` in browser. Verify:
- Blog link appears in header nav between Contact and CTA
- Blog preview section appears after recensies, before Instagram
- Placeholder text visible
- "Bekijk alle artikels" button links to blog.html
- Blog link in footer
- Mobile layout responsive

- [ ] **Step 3: Verify blog post template**

Open `blog/_template.html` in browser. Verify:
- Breadcrumb navigation works (links back to home and blog)
- Header area renders (title placeholder visible)
- Article body area has correct max-width
- CTA block has terracotta background
- "Terug naar alle artikels" link works
- All relative paths (../images, ../style.css) resolve correctly
