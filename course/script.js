/* ===================================
   Alpha Production - Interactive JavaScript
   Advanced Animations & Interactions
   =================================== */

// === Wait for DOM to be ready ===
document.addEventListener('DOMContentLoaded', function () {

    // === Initialize all features ===
    initAnimatedBackground();
    initNavbar();
    initSmoothScrolling();
    initFAQ();
    initScrollToTop();
    initMobileMenu();
    initAOS();
    initCoinexxLinks();

});

// === Animated Background Canvas ===
function initAnimatedBackground() {
    const canvas = document.getElementById('backgroundCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles = [];
    const particleCount = 80;
    const connectionDistance = 150;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 212, 255, 0.6)';
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = (1 - distance / connectionDistance) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// === Navbar Scroll Effect ===
function initNavbar() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// === Smooth Scrolling for Navigation Links ===
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .cta-button[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const mobileMenu = document.querySelector('.nav-links');
                    if (mobileMenu) {
                        mobileMenu.classList.remove('active');
                    }
                }
            }
        });
    });
}

// === FAQ Accordion ===
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// === Scroll to Top Button ===
function initScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');

    if (!scrollButton) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// === Mobile Menu Toggle ===
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate hamburger icon
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// === Animate on Scroll (AOS) - Simple Implementation ===
function initAOS() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        // Add delay if specified
        const delay = el.getAttribute('data-aos-delay');
        if (delay) {
            el.style.transitionDelay = `${delay}ms`;
        }

        observer.observe(el);
    });
}

// === Coinexx Registration Links ===
function initCoinexxLinks() {
    // IMPORTANT: Replace this URL with your actual Coinexx IB referral link
    const coinexxReferralLink = 'https://my.coinexx.com/register?refLink=NTAxODM5&refRm=11';

    // Get all Coinexx registration buttons
    const coinexxButtons = document.querySelectorAll('#coinexx-register-1, #coinexx-register-main, .step-button');

    coinexxButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Track click (you can integrate analytics here)
            console.log('Coinexx registration button clicked');

            // Open link in new tab
            window.open(coinexxReferralLink, '_blank');

            // Optional: Show a confirmation message
            showNotification('جاري فتح صفحة التسجيل في Coinexx...', 'success');
        });
    });
}

// === Notification System ===
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} glass-effect`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;

    notification.textContent = message;

    // Add to body
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification {
        box-shadow: 0 10px 40px rgba(0, 212, 255, 0.3);
    }
    
    .notification-success {
        background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 212, 255, 0.2));
        border: 1px solid rgba(0, 255, 136, 0.3);
    }
    
    .notification-info {
        background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(178, 75, 243, 0.2));
        border: 1px solid rgba(0, 212, 255, 0.3);
    }
`;
document.head.appendChild(style);

// === Mouse Move Parallax Effect (Subtle) ===
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.feature-card, .step-card');

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;

        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        } else {
            card.style.transform = '';
        }
    });
});

// === Form Validation (if you add a contact form later) ===
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// === Stats Counter Animation ===
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Observe stat numbers and animate when visible
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));
            if (!isNaN(number)) {
                animateCounter(entry.target, 0, number, 2000);
                entry.target.dataset.animated = 'true';
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statObserver.observe(stat);
});

// === Preloader (Optional) ===
window.addEventListener('load', () => {
    // Add any loading animations or transitions here
    document.body.classList.add('loaded');
});

// === Console Message for Developers ===
console.log('%c🚀 Alpha Production', 'color: #00d4ff; font-size: 24px; font-weight: bold;');
console.log('%c💎 Premium Trading Education Platform', 'color: #b24bf3; font-size: 14px;');
console.log('%c📈 Learn Smart Money Concepts for FREE!', 'color: #00ff88; font-size: 12px;');

// === Export functions for external use ===
window.AlphaProduction = {
    showNotification,
    validateEmail
};
