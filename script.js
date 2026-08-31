/* ===========================
   TERSAGOESTING - JAVASCRIPT
   =========================== */

document.addEventListener('DOMContentLoaded', function () {

    // === Mobile menu toggle ===
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function () {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        nav.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // === Auto-focus naam field when navigating to #contact ===
    function focusContactForm() {
        var naamField = document.getElementById('naam');
        if (naamField) {
            naamField.focus({ preventScroll: true });
        }
    }

    // === Focus on click to #contact links ===
    document.querySelectorAll('a[href="#contact"], a[href="index.html#contact"]').forEach(function (link) {
        link.addEventListener('click', function () {
            setTimeout(focusContactForm, 800);
        });
    });

    // === On page load with hash (cross-page navigation): instant scroll ===
    if (window.location.hash) {
        // Disable smooth scroll temporarily so cross-page hash lands instantly
        document.documentElement.style.scrollBehavior = 'auto';
        window.addEventListener('load', function() {
            var target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView();
            }
            if (window.location.hash === '#contact') {
                setTimeout(focusContactForm, 100);
            }
            // Re-enable smooth scroll for in-page navigation
            setTimeout(function() {
                document.documentElement.style.scrollBehavior = '';
            }, 200);
        });
    }

    // === Header shadow on scroll ===
    var header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        });
    }

    // === Newsletter popup (show after 8 seconds) ===
    var newsletterPopup = document.getElementById('newsletterPopup');
    var newsletterClose = document.getElementById('newsletterClose');

    if (newsletterPopup) {
        // Only show if not already dismissed
        if (!sessionStorage.getItem('newsletterDismissed')) {
            setTimeout(function () {
                newsletterPopup.classList.add('visible');
            }, 8000);
        }

        if (newsletterClose) {
            newsletterClose.addEventListener('click', function () {
                newsletterPopup.classList.remove('visible');
                sessionStorage.setItem('newsletterDismissed', 'true');
            });
        }
    }

    // === Newsletter form submit ===
    var newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = document.getElementById('newsletter-email').value;
            if (email) {
                alert('Bedankt voor je inschrijving! Je ontvangt binnenkort onze nieuwsbrief op ' + email);
                newsletterPopup.classList.remove('visible');
                sessionStorage.setItem('newsletterDismissed', 'true');
            }
        });
    }

    // === Formule dropdown: vul automatisch tekst in ===
    var formuleSelect = document.getElementById('formule');
    var berichtField = document.getElementById('bericht');
    var hapjesKeuze = document.getElementById('hapjes-keuze');
    var buffetKeuze = document.getElementById('buffet-keuze');
    var pastaKeuze = document.getElementById('pasta-keuze');
    var burgerKeuze = document.getElementById('burger-keuze');

    // Alle teksten vanuit het oogpunt van de klant
    var formuleTeksten = {
        'Hapjes & Dessertjes': 'Ik ontvang graag een voorstel met een selectie hapjes.',
        'Buffet (warm of koud)': 'Ik ontvang graag een voorstel voor een buffet.',
        'Cook@Home (driegangenmenu met hapjes)': 'Ik ontvang graag een voorstel voor een Cook@Home driegangenmenu met hapjes.',
        'BBQ': 'Ik ontvang graag een BBQ-voorstel op maat.',
        'Pasta-formule': 'Ik ontvang graag een voorstel voor de pasta-formule met drie sauzen.',
        'Burger-formule': 'Ik ontvang graag een voorstel voor de burger-formule.',
        'Ik wil graag een voorstel op maat': ''
    };

    // Bouw het berichtveld op vanuit alle actieve opties
    function buildBericht() {
        if (!formuleSelect || !berichtField) return;
        var formule = formuleSelect.value;
        var parts = [];

        // Basistekst per formule
        if (formule === 'Hapjes & Dessertjes') {
            var hapjesRadio = document.querySelector('input[name="hapjes_keuze"]:checked');
            if (hapjesRadio && hapjesRadio.value === 'zelf_kiezen') {
                parts.push('Ik kies zelf mijn hapjes en bezorg mijn selectie via e-mail.');
            } else {
                parts.push(formuleTeksten[formule]);
            }
        } else if (formule === 'BBQ') {
            parts.push('Ik wil graag een barbecue ter plaatse (vanaf 20 personen).');
        } else if (formule === 'Buffet (warm of koud)') {
            var buffetRadio = document.querySelector('input[name="buffet_voorkeur"]:checked');
            if (buffetRadio && buffetRadio.value !== 'geen') {
                var labels = { warm: 'een warm buffet', koud: 'een koud buffet', gemengd: 'een gemengd buffet (warm en koud)' };
                parts.push('Ik ontvang graag een voorstel voor ' + labels[buffetRadio.value] + '.');
            } else {
                parts.push(formuleTeksten[formule]);
            }
        } else if (formule === 'Pasta-formule') {
            parts.push(formuleTeksten[formule]);
            var pastaVeggie = document.getElementById('pastaVeggie');
            if (pastaVeggie && pastaVeggie.checked) {
                var aantal = document.getElementById('pastaVeggiePersonen').value;
                if (aantal) {
                    parts.push('Ik wil ook een vegetarische saus voor ' + aantal + ' personen.');
                } else {
                    parts.push('Ik wil ook een vegetarische saus.');
                }
            }
        } else if (formule === 'Burger-formule') {
            parts.push(formuleTeksten[formule]);
            var burgerVeggie = document.getElementById('burgerVeggie');
            if (burgerVeggie && burgerVeggie.checked) {
                var aantal = document.getElementById('burgerVeggiePersonen').value;
                if (aantal) {
                    parts.push('Ik wil ook een veggie-burger voor ' + aantal + ' personen.');
                } else {
                    parts.push('Ik wil ook een veggie-burger.');
                }
            }
        } else if (formuleTeksten[formule] !== undefined) {
            parts.push(formuleTeksten[formule]);
        }

        berichtField.value = parts.join('\n');
        berichtField.style.height = 'auto';
        berichtField.style.height = berichtField.scrollHeight + 'px';
    }

    // Toon/verberg secties + checkboxes resetten bij formule-wissel
    function resetFormuleOpties() {
        // Verberg alle keuze-secties
        var sections = [hapjesKeuze, buffetKeuze, pastaKeuze, burgerKeuze];
        sections.forEach(function (s) { if (s) s.style.display = 'none'; });

        // Reset checkboxes
        ['pastaVeggie', 'burgerVeggie'].forEach(function (id) {
            var cb = document.getElementById(id);
            if (cb) cb.checked = false;
        });

        // Verberg sub-opties
        ['pastaVeggieDetail', 'burgerVeggieDetail'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        // Reset sub-inputs
        ['pastaVeggiePersonen', 'burgerVeggiePersonen'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.value = '';
        });
    }

    if (formuleSelect && berichtField) {
        formuleSelect.addEventListener('change', function () {
            var val = this.value;
            resetFormuleOpties();

            // Toon relevante keuze-sectie
            if (val === 'Hapjes & Dessertjes' && hapjesKeuze) hapjesKeuze.style.display = 'block';
            if (val === 'Buffet (warm of koud)' && buffetKeuze) buffetKeuze.style.display = 'block';
            if (val === 'Pasta-formule' && pastaKeuze) pastaKeuze.style.display = 'block';
            if (val === 'Burger-formule' && burgerKeuze) burgerKeuze.style.display = 'block';

            buildBericht();
        });

        // Hapjes radiobuttons
        if (hapjesKeuze) {
            hapjesKeuze.querySelectorAll('input[name="hapjes_keuze"]').forEach(function (radio) {
                radio.addEventListener('change', buildBericht);
            });
        }

        // Buffet radiobuttons
        if (buffetKeuze) {
            buffetKeuze.querySelectorAll('input[name="buffet_voorkeur"]').forEach(function (radio) {
                radio.addEventListener('change', buildBericht);
            });
        }

        // Pasta veggie checkbox
        var pastaVeggie = document.getElementById('pastaVeggie');
        var pastaVeggieDetail = document.getElementById('pastaVeggieDetail');
        if (pastaVeggie) {
            pastaVeggie.addEventListener('change', function () {
                if (pastaVeggieDetail) pastaVeggieDetail.style.display = this.checked ? 'block' : 'none';
                buildBericht();
            });
            var pastaVeggiePersonen = document.getElementById('pastaVeggiePersonen');
            if (pastaVeggiePersonen) {
                pastaVeggiePersonen.addEventListener('input', buildBericht);
            }
        }

        // Burger veggie checkbox
        var burgerVeggie = document.getElementById('burgerVeggie');
        var burgerVeggieDetail = document.getElementById('burgerVeggieDetail');
        if (burgerVeggie) {
            burgerVeggie.addEventListener('change', function () {
                if (burgerVeggieDetail) burgerVeggieDetail.style.display = this.checked ? 'block' : 'none';
                buildBericht();
            });
            var burgerVeggiePersonen = document.getElementById('burgerVeggiePersonen');
            if (burgerVeggiePersonen) {
                burgerVeggiePersonen.addEventListener('input', buildBericht);
            }
        }
    }

    // === Scroll animations (fade in on scroll) ===
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections, cards, steps, and portfolio items
    document.querySelectorAll('.card, .step, .section-title, .hero-text, .hero-image').forEach(function (el) {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // === Hero Slideshow (15 seconds) ===
    var heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 1) {
        var heroIndex = 0;
        setInterval(function () {
            heroSlides[heroIndex].classList.remove('active');
            heroIndex = (heroIndex + 1) % heroSlides.length;
            heroSlides[heroIndex].classList.add('active');
        }, 15000);
    }

    // === Helper: scroll naar contact en focus ===
    function scrollToContact() {
        var contactSection = document.getElementById('contact');
        if (contactSection) {
            var headerHeight = document.querySelector('.header').offsetHeight;
            var targetPos = contactSection.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
            setTimeout(function () {
                var naamField = document.getElementById('naam');
                if (naamField) naamField.focus();
            }, 800);
        }
    }

    // === Bestel hier: scroll naar contact, selecteer "voorstel op maat" ===
    document.querySelectorAll('.bestel-cta').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var formule = document.getElementById('formule');
            if (formule) formule.value = 'Ik wil graag een voorstel op maat';
            scrollToContact();
        });
    });

    // === BBQ CTA: scroll naar contact, selecteer "BBQ" en toon keuze ===
    document.querySelectorAll('.bbq-cta').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var formule = document.getElementById('formule');
            if (formule) {
                formule.value = 'BBQ';
                formule.dispatchEvent(new Event('change'));
            }
            scrollToContact();
        });
    });

    // === Occasion tags: vul het type event in als opmerking ===
    document.querySelectorAll('.occasion-tag[data-occasion]').forEach(function (tag) {
        tag.addEventListener('click', function (e) {
            e.preventDefault();
            var occasion = this.dataset.occasion;
            var berichtField = document.getElementById('bericht');
            if (berichtField) {
                var message = this.dataset.message || ('Wij plannen een ' + occasion + ' en zoeken catering.');
                berichtField.value = message;
                berichtField.style.height = 'auto';
                berichtField.style.height = berichtField.scrollHeight + 'px';
            }
            scrollToContact();
        });
    });

    // === FAQ Toggle (global function) ===
    window.toggleFaq = function (btn) {
        var answer = btn.nextElementSibling;
        var isOpen = btn.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-question').forEach(function (q) {
            q.classList.remove('open');
            q.nextElementSibling.classList.remove('open');
        });

        // Open clicked (if it was closed)
        if (!isOpen) {
            btn.classList.add('open');
            answer.classList.add('open');
        }
    };

    // === Card Carousels ===
    document.querySelectorAll('.card-carousel').forEach(function (carousel) {
        var slides = carousel.querySelectorAll('.carousel-slide');
        if (slides.length <= 1) return;
        var index = 0;
        var interval = parseInt(carousel.dataset.interval) || 4000;
        setInterval(function () {
            slides[index].classList.remove('active');
            index = (index + 1) % slides.length;
            slides[index].classList.add('active');
        }, interval);
    });

    // === Recensie carrousel (10 seconden) ===
    // Bouwt de dots en de auto-rotatie op basis van de aanwezige slides.
    // Wordt aangeroepen NA het (optioneel) injecteren van Google-reviews.
    function initRecensieCarousel() {
        const recensieSlides = document.querySelectorAll('.recensie-slide');
        const dotsContainer = document.querySelector('.recensie-dots');
        if (!(recensieSlides.length > 0 && dotsContainer)) return;

        let currentRecensie = 0;
        dotsContainer.innerHTML = '';
        recensieSlides.forEach(function(s, i) { s.classList.toggle('active', i === 0); });

        recensieSlides.forEach(function(_, i) {
            const dot = document.createElement('button');
            dot.classList.add('recensie-dot');
            dot.setAttribute('aria-label', 'Recensie ' + (i + 1));
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', function() {
                goToRecensie(i);
                clearInterval(recensieInterval);
                recensieInterval = setInterval(nextRecensie, 10000);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.recensie-dot');

        function goToRecensie(index) {
            recensieSlides[currentRecensie].classList.remove('active');
            dots[currentRecensie].classList.remove('active');
            currentRecensie = index;
            recensieSlides[currentRecensie].classList.add('active');
            dots[currentRecensie].classList.add('active');
        }

        function nextRecensie() {
            goToRecensie((currentRecensie + 1) % recensieSlides.length);
        }

        var recensieInterval = setInterval(nextRecensie, 10000);
    }

    // Google-reviews (uit data/google-reviews.json, bijgewerkt door een GitHub Action)
    // worden vooraan in de carrousel gezet, mét Google-branding. De ingezonden
    // reviews blijven neutraal staan. Reviewtekst wordt via textContent gezet
    // (nooit innerHTML) zodat externe data geen HTML kan injecteren.
    function buildStars(rating, extraClass) {
        const wrap = document.createElement('span');
        wrap.className = 'recensie-stars' + (extraClass ? ' ' + extraClass : '');
        const n = Math.max(0, Math.min(5, Math.round(rating || 0)));
        wrap.setAttribute('aria-label', n + ' op 5 sterren');
        const full = document.createElement('span');
        full.className = 'star-full';
        full.textContent = '★'.repeat(n);
        const empty = document.createElement('span');
        empty.className = 'star-empty';
        empty.textContent = '★'.repeat(5 - n);
        wrap.append(full, empty);
        return wrap;
    }

    async function loadGoogleReviews() {
        const track = document.querySelector('.recensie-carousel-track');
        if (!track) return;

        let data;
        try {
            const res = await fetch('data/google-reviews.json', { cache: 'no-cache' });
            if (!res.ok) return;
            data = await res.json();
        } catch (e) {
            return;
        }
        if (!data || !Array.isArray(data.reviews) || data.reviews.length === 0) return;

        // Totaalscore-badge onder de titel
        const title = document.querySelector('#recensies .section-title');
        if (title && typeof data.rating === 'number' && !document.querySelector('.recensie-google-badge')) {
            const badge = document.createElement('a');
            badge.className = 'recensie-google-badge';
            badge.href = 'https://g.page/r/CX6z-HXMihMHEAE';
            badge.target = '_blank';
            badge.rel = 'noopener';

            const logo = document.createElement('img');
            logo.src = 'images/google-g.svg';
            logo.alt = 'Google';
            logo.width = 22;
            logo.height = 22;

            const score = document.createElement('span');
            score.className = 'recensie-google-score';
            score.textContent = data.rating.toFixed(1).replace('.', ',');

            const label = document.createElement('span');
            label.className = 'recensie-google-label';
            label.textContent = data.total ? ('op Google · ' + data.total + ' beoordelingen') : 'op Google';

            badge.append(logo, score, buildStars(data.rating), label);
            title.insertAdjacentElement('afterend', badge);
        }

        // Google-review slides vooraan invoegen
        const frag = document.createDocumentFragment();
        data.reviews.forEach(function(r) {
            const slide = document.createElement('div');
            slide.className = 'recensie-slide recensie-slide--google';

            const tekst = document.createElement('p');
            tekst.className = 'recensie-home-tekst';
            tekst.textContent = '"' + String(r.text || '').trim() + '"';

            const footer = document.createElement('div');
            footer.className = 'recensie-home-footer';

            const naam = document.createElement('p');
            naam.className = 'recensie-home-naam';
            naam.textContent = r.author || 'Google-gebruiker';

            const bron = document.createElement('span');
            bron.className = 'recensie-home-bron';
            const g = document.createElement('img');
            g.src = 'images/google-g.svg';
            g.alt = '';
            g.width = 14;
            g.height = 14;
            bron.append(g, document.createTextNode(' Google-review'));

            footer.append(naam, bron);
            slide.append(buildStars(r.rating, 'recensie-slide-stars'), tekst, footer);
            frag.appendChild(slide);
        });
        track.insertBefore(frag, track.firstChild);
    }

    loadGoogleReviews().finally(initRecensieCarousel);

    // === Video Reels: autoplay bij scroll, chaining, navigatie, mute ===
    var reelsVideo = document.getElementById('reelsVideo');
    var reelsMuteBtn = document.getElementById('reelsMuteBtn');
    var reelsPrev = document.getElementById('reelsPrev');
    var reelsNext = document.getElementById('reelsNext');
    var reelsCounter = document.getElementById('reelsCounter');
    // Basispad afleiden uit de eerste <source> zodat reels ook werken vanuit /blog/
    var reelsBase = 'images/reels/';
    if (reelsVideo) {
        var reelsSource = reelsVideo.querySelector('source');
        if (reelsSource) {
            var reelsInit = reelsSource.getAttribute('src') || '';
            var reelsIdx = reelsInit.indexOf('images/reels/');
            if (reelsIdx > 0) reelsBase = reelsInit.slice(0, reelsIdx) + 'images/reels/';
        }
    }
    var reelsList = [
        reelsBase + 'reel-1.mp4',
        reelsBase + 'reel-2.mp4',
        reelsBase + 'reel-3.mp4',
        reelsBase + 'reel-4.mp4',
        reelsBase + 'reel-5.mp4',
        reelsBase + 'reel-6.mp4'
    ];
    var currentReel = 0;

    function goToReel(index) {
        currentReel = ((index % reelsList.length) + reelsList.length) % reelsList.length;
        reelsVideo.src = reelsList[currentReel];
        reelsVideo.play();
        if (reelsCounter) reelsCounter.textContent = (currentReel + 1) + ' / ' + reelsList.length;
    }

    if (reelsVideo) {
        // Volgende reel na einde
        reelsVideo.addEventListener('ended', function () {
            goToReel(currentReel + 1);
        });

        // Vorige/volgende knoppen
        if (reelsNext) reelsNext.addEventListener('click', function () { goToReel(currentReel + 1); });
        if (reelsPrev) reelsPrev.addEventListener('click', function () { goToReel(currentReel - 1); });

        // Autoplay wanneer video in beeld scrollt
        var reelsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    reelsVideo.play();
                } else {
                    reelsVideo.pause();
                }
            });
        }, { threshold: 0.4 });
        reelsObserver.observe(reelsVideo);

        // Mute/unmute toggle
        if (reelsMuteBtn) {
            reelsMuteBtn.addEventListener('click', function () {
                reelsVideo.muted = !reelsVideo.muted;
                reelsMuteBtn.innerHTML = reelsVideo.muted ? '&#128263;' : '&#128266;';
            });
        }
    }

    // === Cookie consent banner ===
    var cookieBanner = document.getElementById('cookieBanner');
    var cookieAccept = document.getElementById('cookieAccept');
    var cookieDecline = document.getElementById('cookieDecline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('visible');
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
            // Load Google Analytics now
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://www.googletagmanager.com/gtag/js?id=G-B359G3PM00';
            document.head.appendChild(s);
            gtag('js', new Date());
            gtag('config', 'G-B359G3PM00');
        });
    }

    if (cookieDecline) {
        cookieDecline.addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // === URL parameter pre-fill (vanuit aanbod.html) ===
    var params = new URLSearchParams(window.location.search);
    var paramFormule = params.get('formule');
    if (paramFormule && formuleSelect) {
        formuleSelect.value = paramFormule;
        formuleSelect.dispatchEvent(new Event('change'));
    }

});
