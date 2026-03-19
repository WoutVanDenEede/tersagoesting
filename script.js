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

    // === Contact form submit ===
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var naam = document.getElementById('naam').value;
            var email = document.getElementById('email').value;
            var bericht = document.getElementById('bericht').value;

            if (naam && email && bericht) {
                // Build mailto link as fallback
                var subject = encodeURIComponent('Aanvraag via website - ' + naam);
                var body = encodeURIComponent(
                    'Naam: ' + naam + '\n' +
                    'Email: ' + email + '\n' +
                    'Telefoon: ' + (document.getElementById('telefoon').value || 'Niet opgegeven') + '\n' +
                    'Datum event: ' + (document.getElementById('datum').value || 'Niet opgegeven') + '\n' +
                    'Aantal gasten: ' + (document.getElementById('gasten').value || 'Niet opgegeven') + '\n\n' +
                    'Bericht:\n' + bericht
                );
                window.location.href = 'mailto:info@tersagoesting.be?subject=' + subject + '&body=' + body;

                alert('Bedankt voor je aanvraag, ' + naam + '! We nemen zo snel mogelijk contact met je op.');
                contactForm.reset();
            }
        });
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
    document.querySelectorAll('.card, .step, .portfolio-item, .section-title, .hero-text, .hero-image').forEach(function (el) {
        el.classList.add('fade-in');
        observer.observe(el);
    });

});
