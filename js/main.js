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
    const revealElements = document.querySelectorAll('.service-card, .uniforms-highlight, .about-content-box, .info-item, .client-name, .timeline-item, .stat-card');
    
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
        
        // 1. Draw Golden Waves
        const waves = [
            { amplitude: 40, frequency: 0.005, speed: 0.01, color: 'rgba(212, 175, 55, 0.08)' },
            { amplitude: 60, frequency: 0.003, speed: 0.007, color: 'rgba(212, 175, 55, 0.05)' },
            { amplitude: 30, frequency: 0.008, speed: 0.015, color: 'rgba(243, 229, 171, 0.03)' }
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
            const intensity = 0.6 + Math.sin(waveOffset * 0.01 + index) * 0.2;
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
        
        // Auto-play every 2 seconds
        const startAutoPlay = () => {
            autoPlayTimer = setInterval(nextSlide, 2000);
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

    animate();
});
 && carouselItems.length > 0) {
        const totalItems = carouselItems.length;
        const angleStep = 360 / totalItems;
        const radius = window.innerWidth < 768 ? 600 : 1000; // Radius for the 3D ring
        
        let currentRotation = 0;
        let isDragging = false;
        let startX = 0;
        let prevRotation = 0;
        let velocity = 0;
        let animationId = null;

        // Positioning items in 3D Space
        carouselItems.forEach((item, index) => {
            const angle = index * angleStep;
            item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });

        // Rotation Function
        const rotateCarousel = (rot) => {
            carouselContainer.style.transform = `rotateY(${rot}deg)`;
            
            // Adjust opacity and scale based on depth for better 3D feel
            carouselItems.forEach((item, index) => {
                const itemAngle = (index * angleStep + rot) % 360;
                // Normalize angle to -180 to 180
                const normalizedAngle = (itemAngle + 540) % 360 - 180;
                const distanceRatio = Math.abs(normalizedAngle) / 180;
                
                // Front items: scale 1, opacity 1. Back items: scale 0.8, opacity 0.3
                const scale = 1 - (distanceRatio * 0.3);
                const opacity = 1 - (distanceRatio * 0.8);
                
                item.style.opacity = opacity;
                // We keep the original transform and append the scale
                const baseTransform = `rotateY(${index * angleStep}deg) translateZ(${radius}px)`;
                item.style.transform = `${baseTransform} scale(${scale})`;
            });
        };

        // Interaction Handling
        const handleStart = (e) => {
            isDragging = true;
            startX = e.pageX || e.touches[0].pageX;
            prevRotation = currentRotation;
            cancelAnimationFrame(animationId);
            carouselContainer.style.transition = 'none';
        };

        const handleMove = (e) => {
            if (!isDragging) return;
            const x = e.pageX || e.touches[0].pageX;
            const walk = (x - startX) * 0.15; // Sensitivity
            velocity = walk;
            currentRotation = prevRotation + walk;
            rotateCarousel(currentRotation);
        };

        const handleEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            carouselContainer.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            applyMomentum();
        };

        const applyMomentum = () => {
            if (Math.abs(velocity) < 0.1) return;
            currentRotation += velocity;
            velocity *= 0.95; // Friction
            rotateCarousel(currentRotation);
            animationId = requestAnimationFrame(applyMomentum);
        };

        // Mouse Events
        const stage = document.querySelector('.carousel-stage');
        stage.addEventListener('mousedown', handleStart);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);

        // Touch Events
        stage.addEventListener('touchstart', handleStart);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', handleEnd);

        // Initial Position
        rotateCarousel(0);

        // Lightbox integration (re-using if desired)
        const lightbox = document.getElementById('collage-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.querySelector('.lightbox-close');

        if (lightbox) {
            carouselItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    // Only open if not dragging significantly
                    if (Math.abs(velocity) > 1) return;
                    
                    const img = item.querySelector('img');
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });

            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            });
            
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    animate();
});
