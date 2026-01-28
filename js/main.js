// Main JavaScript for KaamConnect

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeAnimations();
    animateStats();
    initializeMobileMenu();
    initializeScrollEffects();
});

// Navigation
function initializeNavigation() {
    // Smooth scroll for anchor links
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
    
    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'var(--white)';
                navbar.style.backdropFilter = 'none';
            }
        }
    });
}

// Mobile menu
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

// Scroll animations
function initializeScrollEffects() {
    const sections = document.querySelectorAll('section');
    
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
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
}

// Animate statistics
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, stepTime);
}

// Initialize animations
function initializeAnimations() {
    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.category-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.category-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Feature cards
    const featureCards = document.querySelectorAll('.feature-card-main');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateX(10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateX(0)';
        });
    });
    
    // Workflow cards
    const workflowCards = document.querySelectorAll('.workflow-card');
    workflowCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow-sm)';
        });
    });
}

// Voice profile starter
function startVoiceProfile() {
    // In a real implementation, this would start voice recognition
    alert('Voice Profile Feature\n\nThis feature would use speech-to-text technology to help you create your profile using voice commands. You would be prompted to speak your:\n- Name\n- Skills\n- Location\n- Experience\n- Availability\n\nThe system would convert your speech to text and create your profile automatically.');
    window.location.href = 'pages/voice-profile.html';
}

// Add mobile menu styles dynamically
const style = document.createElement('style');
style.textContent = `
    @media (min-width: 969px) {
        .nav-links.active {
            display: flex;
        }
    }
    
    @media (max-width: 968px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--white);
            padding: 2rem;
            box-shadow: var(--shadow-lg);
            gap: 1.5rem;
            z-index: 999;
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);
