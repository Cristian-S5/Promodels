document.addEventListener('DOMContentLoaded', () => {
    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    
    // ---- Parallax & Background Effects ----
    const abstractShapes = document.querySelectorAll('.abstract-shape');
    
    window.addEventListener('scroll', () => {
        // Sticky Navbar Effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ---- Mobile Menu Toggle ----
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    const toggleMenu = () => {
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // ---- Smooth Scroll & Active Links ----
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link:not(.button-outline)');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    // ---- Form Submission Prevent Default (Demo) ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<span>Enviando...</span> <i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.7';
            
            // Simulate sending
            setTimeout(() => {
                btn.innerHTML = '<span>Mensaje Enviado</span> <i class="fas fa-check"></i>';
                btn.style.backgroundColor = '#10b981';
                btn.style.color = '#fff';
                btn.style.opacity = '1';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 3000);
            }, 1500);
        });
    }

    // ---- Intersection Observer for Reveal Animations ----
    const revealElements = document.querySelectorAll('.service-card, .uniforms-highlight, .about-content-box, .info-item, .client-logo-item, .timeline-item, .stat-card');
    
    // Initial style setup for reveal
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ---- Abstract Background: Golden Waves & Shadows ----
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    let waveOffset = 0;
    
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 1. Draw Blue Waves
        const waves = [
            { amplitude: 40, frequency: 0.005, speed: 0.01, color: 'rgba(14, 50, 163, 0.15)' },
            { amplitude: 60, frequency: 0.003, speed: 0.007, color: 'rgba(14, 50, 163, 0.1)' },
            { amplitude: 30, frequency: 0.008, speed: 0.015, color: 'rgba(48, 117, 130, 0.08)' }
        ];
        
        waves.forEach((wave, index) => {
            ctx.beginPath();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = wave.color;
            const baseY = canvas.height * (0.3 + index * 0.2);
            ctx.moveTo(0, baseY);
            for (let x = 0; x < canvas.width; x += 2) {
                const y = baseY + Math.sin(x * wave.frequency + waveOffset * wave.speed) * wave.amplitude;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        // 2. Animate Background Shadows (Idle Movement & Pulsating)
        const scrolled = window.scrollY;
        abstractShapes.forEach((shape, index) => {
            const idleSpeed = 0.001 * (index + 1);
            const floatX = Math.cos(waveOffset * idleSpeed) * 30;
            const floatY = Math.sin(waveOffset * idleSpeed) * 30;
            const parallaxSpeed = (index + 1) * 0.05;
            const parallaxY = scrolled * -parallaxSpeed;
            
            // Apply both parallax and idle float
            shape.style.transform = `translate(${floatX}px, ${parallaxY + floatY}px)`;
            
            // Breathing / Pulsating intensity
            const intensity = 0.8 + Math.sin(waveOffset * 0.01 + index) * 0.2;
            shape.style.opacity = intensity;
        });
        
        waveOffset += 1;
        requestAnimationFrame(animate);
    };
    
    // ---- Service Carousels ----
    const serviceCarousels = document.querySelectorAll('.service-carousel[data-count]');
    
    serviceCarousels.forEach(carousel => {
        const count = parseInt(carousel.getAttribute('data-count'));
        if (count <= 0) return; // Skip placeholders
        
        const folder = carousel.getAttribute('data-folder');
        const track = carousel.querySelector('.carousel-track');
        const counter = carousel.querySelector('.carousel-counter');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        
        let currentIndex = 0;
        let autoPlayTimer = null;
        
        // Preload all images into the track
        for (let i = 2; i <= count; i++) {
            const img = document.createElement('img');
            img.src = `img/${folder}/${i}.webp`;
            img.alt = `${folder} ${i}`;
            img.className = 'carousel-slide';
            img.loading = 'lazy';
            track.appendChild(img);
        }
        
        const slides = track.querySelectorAll('.carousel-slide');
        
        const goToSlide = (index) => {
            slides[currentIndex].classList.remove('active-slide');
            currentIndex = (index + count) % count;
            slides[currentIndex].classList.add('active-slide');
            if (counter) counter.textContent = `${currentIndex + 1} / ${count}`;
        };
        
        const nextSlide = () => goToSlide(currentIndex + 1);
        const prevSlide = () => goToSlide(currentIndex - 1);
        
        // Button controls
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
        
        // Auto-play every 5 seconds
        const startAutoPlay = () => {
            autoPlayTimer = setInterval(nextSlide, 5000);
        };
        
        const resetAutoPlay = () => {
            clearInterval(autoPlayTimer);
            startAutoPlay();
        };
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
        carousel.addEventListener('mouseleave', () => startAutoPlay());
        
        startAutoPlay();
    });

    // ---- Lightbox Logic ----
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Cerrar"><i class="fas fa-times"></i></button>
            <img class="lightbox-img" src="" alt="Lightbox Image">
        </div>
    `;
    document.body.appendChild(lightboxOverlay);

    const lightboxImg = lightboxOverlay.querySelector('.lightbox-img');
    const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');

    const openLightbox = (src) => {
        lightboxImg.src = src;
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) closeLightbox();
    });

    // Add click listeners to lightbox triggers
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('carousel-slide') || e.target.closest('.lightbox-trigger')) {
            const target = e.target.tagName === 'IMG' ? e.target : e.target.querySelector('img');
            if (target) openLightbox(target.src);
        }
    });

    // ---- Custom Cursor Initialization ----
    const initCustomCursor = () => {
        const cursorContainer = document.createElement('div');
        cursorContainer.className = 'cursor-container';
        
        // Dot of light structure
        cursorContainer.innerHTML = `
            <div class="custom-cursor-dot">
                <div class="cursor-glint"></div>
            </div>
        `;
        
        const cursorTrail = document.createElement('div');
        cursorTrail.className = 'cursor-trail';
        
        document.body.appendChild(cursorContainer);
        document.body.appendChild(cursorTrail);
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let trailX = 0, trailY = 0;
        
        // Show cursor when mouse moves
        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!cursorContainer.classList.contains('active')) {
                cursorContainer.classList.add('active');
            }
        };
        
        window.addEventListener('mousemove', onMouseMove);
        
        // Smooth animation loop for cursor and trail
        const updateCursor = () => {
            // Increased factors for better responsiveness
            cursorX += (mouseX - cursorX) * 0.8;
            cursorY += (mouseY - cursorY) * 0.8;
            
            trailX += (mouseX - trailX) * 0.15;
            trailY += (mouseY - trailY) * 0.15;
            
            cursorContainer.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px)`;
            
            requestAnimationFrame(updateCursor);
        };
        
        updateCursor();
        
        // Handle Hover States
        const clickables = 'a, button, .btn, .nav-link, .carousel-btn, .carousel-item-3d, input, select, textarea, [role="button"]';
        
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(clickables)) {
                cursorContainer.classList.add('hover');
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(clickables)) {
                cursorContainer.classList.remove('hover');
            }
        });

        // Click Reaction
        window.addEventListener('mousedown', () => cursorContainer.classList.add('clicked'));
        window.addEventListener('mouseup', () => cursorContainer.classList.remove('clicked'));

        // Hide cursor when it leaves the window
        document.addEventListener('mouseleave', () => {
            cursorContainer.classList.remove('active');
            cursorTrail.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursorContainer.classList.add('active');
            cursorTrail.style.opacity = '0.6';
        });
    };

    // Only initialize on desktop/pointer devices
    if (window.matchMedia('(pointer: fine)').matches) {
        initCustomCursor();
    }

    animate();
});
