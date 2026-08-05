document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavbar();
    initHeroSlider();
    initScrollAnimations();
    initStatsCounter();
    initPortfolioFilter();
    initTestimonialsSlider();
    initContactForm();
    initNewsletterForm();
});

/* ==========================================================================
   1. PRELOADER DISMISSAL TIMER
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Force page scroll lock on initial load
    document.body.style.overflow = 'hidden';

    // The user requested showing the loader for 2 to 3 seconds.
    // We will set a timeout of 2500ms (2.5 seconds).
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        
        // Restore page scrolling once preloader fades out
        document.body.style.overflow = '';
    }, 2500);
}

/* ==========================================================================
   2. NAVBAR STICKY ACTION & MOBILE MENU DRAWER
   ========================================================================== */
function initNavbar() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active menu link based on scroll position
        highlightActiveSection();
    });

    // Toggle menu slide-out for mobile
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        
        // Block document scrolling while mobile menu is open
        if (navMenu.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close menu if user clicks outside of the navbar menu
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && 
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // Highlight active link in menu based on view section
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    targetLink.classList.add('active');
                }
            }
        });
    }
}

/* ==========================================================================
   3. HERO IMAGES BACKGROUND SLIDER
   ========================================================================== */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Loop controls boundaries
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }
        
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Set automatic sliding interval (5 seconds)
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    // Controls listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    // Init slider action
    startAutoSlide();
}

/* ==========================================================================
   4. VIEWPORT SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
    const animElements = document.querySelectorAll('.scroll-animate');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px' // triggers slightly before entering
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target); // stop observing once animated
                }
            });
        }, observerOptions);

        animElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        animElements.forEach(el => el.classList.add('animated'));
    }
}

/* ==========================================================================
   5. COUNT-UP STATS ANIMATION
   ========================================================================== */
function initStatsCounter() {
    const statsSection = document.querySelector('.stats-section');
    const counters = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    if (!statsSection || counters.length === 0) return;

    function startCounting() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 1800; // Total count speed (ms)
            const increment = target / (duration / 16); // 60 FPS update speed
            
            let count = 0;
            const updateCount = () => {
                count += increment;
                if (count < target) {
                    counter.innerText = Math.ceil(count);
                    requestAnimationFrame(updateCount);
                } else {
                    // Make sure stats end exactly on target
                    counter.innerText = target + (target === 250 || target === 15 || target === 80 ? '+' : '');
                }
            };
            
            updateCount();
        });
    }

    // Trigger only when user scrolls into the stats section view
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    startCounting();
                    hasCounted = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    } else {
        // Fallback
        startCounting();
    }
}

/* ==========================================================================
   6. PORTFOLIO FILTER SORTING GRID
   ========================================================================== */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length === 0 || portfolioItems.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active style from all filter tags
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                // Add fade out animation first, then toggle display layout
                item.style.opacity = '0';
                item.style.transform = 'scale(0.85)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.classList.remove('hide');
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.classList.add('hide');
                    }
                }, 300);
            });
        });
    });
}

/* ==========================================================================
   7. TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialsSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let autoSlideInterval;

    if (testimonialCards.length === 0) return;

    function goToSlide(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = index;
        
        // Update display items
        testimonialCards[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        // Translate the track element container
        const track = document.querySelector('.testimonial-track');
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function autoSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= testimonialCards.length) {
            nextIndex = 0;
        }
        goToSlide(nextIndex);
    }

    // Set automatic sliding interval
    function startAutoSlide() {
        autoSlideInterval = setInterval(autoSlide, 6000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Dot click triggers
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideIndex = parseInt(e.target.getAttribute('data-slide'));
            goToSlide(slideIndex);
            resetAutoSlide();
        });
    });

    startAutoSlide();
}

/* ==========================================================================
   8. CONTACT FORM SUBMISSION MOCKUP
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show status loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const submitText = submitBtn.querySelector('span');
        const originalText = submitText.innerText;
        
        submitBtn.disabled = true;
        submitText.innerText = 'Sending Inquiry...';

        // Mock ajax submission delay
        setTimeout(() => {
            // Reset button
            submitBtn.disabled = false;
            submitText.innerText = originalText;

            // Display success message
            formStatus.className = 'form-status success';
            formStatus.innerText = 'Thank you! Your message has been sent successfully. One of our specialists will call you soon.';
            
            // Clear inputs
            contactForm.reset();

            // Clear status alert box after 6 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 6000);

        }, 1500);
    });
}

/* ==========================================================================
   9. NEWSLETTER FORM SUBMISSION
   ========================================================================== */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterStatus = document.getElementById('newsletterStatus');

    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input');
        
        // Mock newsletters alert
        newsletterStatus.className = 'newsletter-status success';
        newsletterStatus.innerText = 'Successfully Subscribed!';
        emailInput.value = '';

        setTimeout(() => {
            newsletterStatus.style.display = 'none';
        }, 4000);
    });
}
