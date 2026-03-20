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

    // === Smooth scroll for anchor links ===
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = document.querySelector('.header').offsetHeight;
                var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

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
    var bbqKeuze = document.getElementById('bbq-keuze');

    var formuleTeksten = {
        'Hapjes & Dessertjes': 'Wij laten Tersagoesting een voorstel maken met een selectie hapjes naar keuze.',
        'Buffet (warm of koud)': 'Tersagoesting stelt zelf een buffet samen. Geef gerust je lichte voorkeuren door: liever een klassiek koud of warm buffet, meer pasta, meer vis, \u2026 Wij houden er rekening mee!',
        'Cook@Home (driegangenmenu met hapjes)': 'Tersagoesting stelt een driegangenmenu met hapjes voor. Heb je bepaalde voorkeuren of allergie\u00ebn? Laat het ons weten!',
        'BBQ': 'Tersagoesting maakt een BBQ-voorstel op maat. Geef gerust je lichte voorkeuren door: aantal stukken vlees, soort vlees of vis, \u2026 Wij houden er rekening mee!',
        'Pasta-formule': 'Tersagoesting stuurt een voorstel met drie verschillende sauzen. Moet daar ook een veggie-saus bij?',
        'Burger-formule': 'Tersagoesting stuurt een voorstel met twee soorten burgers. Moet daar een veggie-burger bij, en zo ja, voor hoeveel personen?',
        'Ik wil graag een voorstel op maat': ''
    };

    if (formuleSelect && berichtField) {
        formuleSelect.addEventListener('change', function () {
            var val = this.value;
            // Toon/verberg hapjes radiobuttons
            if (hapjesKeuze) {
                hapjesKeuze.style.display = (val === 'Hapjes & Dessertjes') ? 'block' : 'none';
            }
            // Toon/verberg BBQ radiobuttons
            if (bbqKeuze) {
                bbqKeuze.style.display = (val === 'BBQ') ? 'block' : 'none';
            }
            // Vul tekst in
            if (formuleTeksten[val] !== undefined) {
                berichtField.value = formuleTeksten[val];
                berichtField.style.height = 'auto';
                berichtField.style.height = berichtField.scrollHeight + 'px';
            }
        });

        // Hapjes radiobuttons logica
        if (hapjesKeuze) {
            hapjesKeuze.querySelectorAll('input[name="hapjes_keuze"]').forEach(function (radio) {
                radio.addEventListener('change', function () {
                    if (this.value === 'voorstel') {
                        berichtField.value = 'Wij laten Tersagoesting een voorstel maken met een selectie hapjes naar keuze.';
                    } else {
                        berichtField.value = 'Wij kiezen zelf onze hapjes. Onze selectie volgt via e-mail.';
                    }
                });
            });
        }

        // BBQ radiobuttons logica
        if (bbqKeuze) {
            bbqKeuze.querySelectorAll('input[name="bbq_keuze"]').forEach(function (radio) {
                radio.addEventListener('change', function () {
                    if (this.value === 'groentjes') {
                        berichtField.value = 'Wij willen graag enkel barbecuegroentjes bestellen (10 bijgerechten). Maak ons een voorstel!';
                    } else {
                        berichtField.value = 'Wij willen graag een volledige barbecue ter plaatse. Maak ons een voorstel, Tersagoesting!';
                    }
                    berichtField.style.height = 'auto';
                    berichtField.style.height = berichtField.scrollHeight + 'px';
                });
            });
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
                berichtField.value = 'Wij plannen een ' + occasion + ' en zoeken catering.';
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
    const recensieSlides = document.querySelectorAll('.recensie-slide');
    const dotsContainer = document.querySelector('.recensie-dots');
    if (recensieSlides.length > 0 && dotsContainer) {
        let currentRecensie = 0;

        // Dots aanmaken
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

});
