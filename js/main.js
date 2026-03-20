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
    
    animate();
});
