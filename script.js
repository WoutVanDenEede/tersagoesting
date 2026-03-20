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

    // === Contact form: FormSubmit.co handelt alles af, geen JS nodig ===

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
