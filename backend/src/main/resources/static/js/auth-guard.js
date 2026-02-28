(function () {
    function isLoggedIn() {
        return !!window.Api?.getToken?.();
    }

    function requireAuth(actionMessage = 'Please login to continue') {
        if (isLoggedIn()) {
            return true;
        }

        const message = actionMessage || 'Please login to continue';
        sessionStorage.setItem('auth_guard_toast', message);

        const pathname = window.location.pathname;
        const loginPath = pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
        window.location.href = loginPath;
        return false;
    }

    function consumePendingAuthToast() {
        const message = sessionStorage.getItem('auth_guard_toast');
        if (!message) return;

        sessionStorage.removeItem('auth_guard_toast');

        if (typeof window.showToast === 'function') {
            window.showToast(message, 'error');
        }
    }

    window.isLoggedIn = isLoggedIn;
    window.requireAuth = requireAuth;
    window.consumePendingAuthToast = consumePendingAuthToast;
})();