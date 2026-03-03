(function () {
    function getLoginPath() {
        return window.location.pathname.includes('/pages/')
            ? 'login.html'
            : 'pages/login.html';
    }

    function redirectByRole(role) {
        if (role === 'EMPLOYER') {
            window.location.href = 'dashboard-employer.html';
            return;
        }

        if (role === 'NGO') {
            window.location.href = 'ngo-dashboard.html';
            return;
        }

        window.location.href = 'dashboard-worker.html';
    }

    async function guardPage(requiredRole) {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = getLoginPath();
            return null;
        }

        try {
            const meRes = await Api.get('/api/users/me');
            const user = meRes?.data || meRes || {};
            const role = (user.role || '').toString().toUpperCase();

            if (requiredRole && role !== requiredRole) {
                redirectByRole(role);
                return null;
            }

            return user;
        } catch (e) {
            localStorage.removeItem('token');
            window.location.href = getLoginPath();
            return null;
        }
    }

    function requireAuth(message) {
        const token = localStorage.getItem('token');

        if (token) return true;

        if (typeof showToast === 'function' && message) {
            showToast(message, 'error');
        }

        window.location.href = getLoginPath();
        return false;
    }

    window.guardPage = guardPage;
    window.requireAuth = requireAuth;
})();