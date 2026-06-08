/* ==========================================================================
   Aroma Alchemists - Core Interactive Engine & Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. Setup Lenis Smooth Scroll
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Integrate Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }

    // Smooth Scroll Link Handling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if active
                closeMobileMenu();

                if (lenis) {
                    lenis.scrollTo(targetElement, {
                        offset: -70, // Adjust to navbar height
                        duration: 1.2
                    });
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });


    // 2. Mobile Menu Toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    function openMobileMenu() {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    }

    function closeMobileMenu() {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openMobileMenu);
    }
    if (mobileMenuCloseBtn) {
        mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
    }
    mobileNavItems.forEach(item => {
        item.addEventListener('click', closeMobileMenu);
    });


    // 3. Navbar Shrink & Scroll Progress Indicator
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('scroll-progress-bar');

    window.addEventListener('scroll', () => {
        const scrollDepth = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Update Shrink Navbar Class
        if (scrollDepth > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update Progress Bar Width
        if (totalHeight > 0) {
            const progress = (scrollDepth / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    });


    // 4. Create Floating Aroma Particles in Hero Section
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = 45;

    if (particlesContainer) {
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('aroma-particle');
            
            // Random sizes, positions, opacities, and delays
            const size = Math.random() * 4 + 2;
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const delay = Math.random() * 8;
            const duration = Math.random() * 12 + 8;
            const drift = Math.random() * 100 - 50; // lateral drift in pixels

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${startX}%`;
            particle.style.top = `${startY}%`;
            particle.style.opacity = Math.random() * 0.4 + 0.1;
            
            // Animate using CSS transitions & custom keyframe injection
            particlesContainer.appendChild(particle);

            // Using simple GSAP animations for particle movement
            gsap.to(particle, {
                y: '-=200',
                x: `+=${drift}`,
                opacity: 0,
                duration: duration,
                delay: delay,
                repeat: -1,
                ease: 'power1.out',
                onRepeat: function() {
                    gsap.set(particle, {
                        y: 0,
                        x: 0,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 20 + 80}%`, // Reset to bottom
                        opacity: Math.random() * 0.4 + 0.1
                    });
                }
            });
        }
    }


    // 5. Testimonials Review Slider Carousel
    const track = document.getElementById('testimonials-track');
    const slides = Array.from(document.querySelectorAll('.testimonial-card'));
    const prevBtn = document.getElementById('prev-slide-btn');
    const nextBtn = document.getElementById('next-slide-btn');
    const dotsContainer = document.getElementById('slider-dots');
    const dots = Array.from(dotsContainer.children);
    let activeIndex = 0;

    function updateSlider(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Translate Track
        track.style.transform = `translateX(-${index * 33.333}%)`;
        
        // Toggle Active Classes
        slides.forEach((slide, idx) => {
            if (idx === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update Dots
        dots.forEach((dot, idx) => {
            if (idx === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        activeIndex = index;
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => updateSlider(activeIndex - 1));
        nextBtn.addEventListener('click', () => updateSlider(activeIndex + 1));
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => updateSlider(index));
    });

    // Auto-advance testimonials every 6 seconds
    let autoPlayInterval = setInterval(() => {
        updateSlider(activeIndex + 1);
    }, 6000);

    // Pause autoplay on interaction
    const resetAutoplay = () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            updateSlider(activeIndex + 1);
        }, 6000);
    };

    [prevBtn, nextBtn, dotsContainer].forEach(el => {
        if (el) el.addEventListener('click', resetAutoplay);
    });


    // 6. Navigation Link Syncing (Scrollspy)
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100; // Offset for navbar height

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });


    // 7. Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const successToast = document.getElementById('success-toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Values
            const nameVal = document.getElementById('name').value.trim();
            const emailVal = document.getElementById('email').value.trim();
            const phoneVal = document.getElementById('phone').value.trim();
            const messageVal = document.getElementById('message').value.trim();
            
            if (!nameVal || !emailVal || !messageVal) {
                alert('Please fill in all required fields.');
                return;
            }

            // Mock submission success (since it is a static site demonstration)
            console.log('Form submission:', { nameVal, emailVal, phoneVal, messageVal });

            // Show Toast Notification
            successToast.classList.add('show');
            
            // Clear Form
            contactForm.reset();

            // Auto-hide Toast
            setTimeout(() => {
                successToast.classList.remove('show');
            }, 4000);
        });
    }


    // 8. GSAP ScrollTrigger Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Fade-in animations
        gsap.to('.hero-title', { opacity: 1, y: 0, duration: 1.2, delay: 0.2, ease: 'power3.out' });
        gsap.to('.hero-subtitle', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
        gsap.to('.hero-desc', { opacity: 1, y: 0, duration: 1.2, delay: 0.4, ease: 'power3.out' });
        gsap.to('.hero-buttons', { opacity: 1, y: 0, duration: 1.2, delay: 0.6, ease: 'power3.out' });
        gsap.to('.hero-showcase-container', { opacity: 1, y: 0, duration: 1.4, delay: 0.8, ease: 'power3.out' });

        // Hero Parallax Background scaling on Scroll
        gsap.to('#hero-bg-img', {
            scale: 1.2,
            ease: 'none',
            scrollTrigger: {
                trigger: '#home',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // About section fade-up & text triggers
        gsap.from('.about-text-content', {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        gsap.from('.about-visuals', {
            opacity: 0,
            x: 50,
            duration: 1.2,
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // Category Cards staggered rise-on-scroll
        gsap.from('.category-card', {
            opacity: 0,
            y: 60,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#categories',
                start: 'top 75%'
            }
        });

        // Feature cards slide up staggered
        gsap.from('.feature-card', {
            opacity: 0,
            y: 50,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.why-choose-section',
                start: 'top 75%'
            }
        });

        // Experience parallax background scaling
        gsap.to('#experience-parallax-img', {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
                trigger: '#experience',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // Experience Text fade-in
        gsap.from('.experience-inner', {
            opacity: 0,
            scale: 0.95,
            duration: 1.2,
            scrollTrigger: {
                trigger: '#experience',
                start: 'top 65%'
            }
        });

        // Gift Section stagger fade-in
        gsap.from('.gift-img-box', {
            opacity: 0,
            x: -50,
            duration: 1,
            scrollTrigger: {
                trigger: '#gifts',
                start: 'top 75%'
            }
        });

        gsap.from('.gift-text-content', {
            opacity: 0,
            x: 50,
            duration: 1,
            scrollTrigger: {
                trigger: '#gifts',
                start: 'top 75%'
            }
        });
        
        // Refresh ScrollTrigger on window load to ensure all layouts/heights are final
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });
    }
});
