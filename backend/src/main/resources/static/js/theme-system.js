// Theme System - Light/Dark Mode Toggle
// Persists across all pages

class ThemeSystem {
    constructor() {
        this.theme = this.getSavedTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        // Apply theme immediately
        this.applyTheme(this.theme);
        
        // Setup toggle button
        this.setupToggle();
        
        // Listen to system theme changes
        this.listenToSystemTheme();
    }

    getSavedTheme() {
        return localStorage.getItem('kaamconnect_theme');
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('kaamconnect_theme', theme);
        
        // Update meta theme-color for mobile
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        metaTheme.content = theme === 'dark' ? '#1A1A1A' : '#FFFFFF';
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        
        // Add transition class
        document.documentElement.classList.add('theme-transitioning');
        
        this.applyTheme(newTheme);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 300);
    }

    setupToggle() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    listenToSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't set a preference
            if (!this.getSavedTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Initialize theme system
let themeSystem;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        themeSystem = new ThemeSystem();
    });
} else {
    themeSystem = new ThemeSystem();
}

// Export for global access
window.themeSystem = themeSystem;