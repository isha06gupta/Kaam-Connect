// Main Integrated JavaScript - KaamConnect
// Animations, counter, scroll effects

// Counter Animation for Stats
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile menu toggle (if needed)
function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

// Intersection Observer for animations
function setupScrollAnimations() {
    const animateElements = document.querySelectorAll('.feature-card, .stat-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Navbar scroll effect
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Update placeholder translation
function updatePlaceholderTranslations() {
    const elements = document.querySelectorAll('[data-translate-placeholder]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (window.translations && window.translations[window.currentLanguage] && window.translations[window.currentLanguage][key]) {
            element.placeholder = window.translations[window.currentLanguage][key];
        }
    });
}

// Auto-resize textareas
function setupAutoResizeTextareas() {
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });
    });
}

// Initialize all functions
document.addEventListener('DOMContentLoaded', () => {
    // Run animations
    animateCounter();
    setupSmoothScroll();
    setupMobileMenu();
    setupScrollAnimations();
    setupNavbarScroll();
    setupAutoResizeTextareas();
    
    // Update translations on language change
    window.addEventListener('languagechange', () => {
        updatePlaceholderTranslations();
    });
    
    // Initial translation update
    updatePlaceholderTranslations();
    
    console.log('✅ KaamConnect initialized successfully');
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    // Close modals on Escape
    if (e.key === 'Escape') {
        if (window.closeLanguageModal) {
            window.closeLanguageModal();
        }
        if (window.chatbot && window.chatbot.isOpen) {
            window.chatbot.closePanel();
        }
    }
});

// Export for global access
window.kaamConnect = {
    animateCounter,
    setupSmoothScroll,
    setupScrollAnimations
};