(function () {

    function getNavActions() {
        return document.querySelector('.nav-actions');
    }

    function getBasePath() {
        return window.location.pathname.includes('/pages/')
            ? ''
            : 'pages/';
    }

    function inferUserRole(user) {
        const company = (user?.company || '').trim();
        if (company && company.toLowerCase() !== 'n/a') {
            return 'employer';
        }
        return 'worker';
    }

    function renderGuest(nav) {

        const base = getBasePath();

        nav.innerHTML = `
            <button class="language-toggle" onclick="openLanguageModal()">
                🌐 EN
            </button>
            <a href="${base}login.html" class="btn-outline">Login</a>
            <a href="${base}register.html" class="btn-primary nav-cta">Register</a>
        `;
    }

    function renderLoggedIn(nav, user) {

        const base = getBasePath();

        const initials =
            (user.fullname || 'U')
                .split(' ')
                .map(x => x[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

        const role = inferUserRole(user);

        const dashboard =
            role === 'employer'
                ? 'dashboard-employer.html'
                : 'dashboard-worker.html';

        nav.innerHTML = `
            <div class="profile-menu" style="position:relative;">
                <button id="profileBtn" class="btn-outline">
                    ${initials} ▼
                </button>

                <div id="profileDropdown"
                     style="display:none;position:absolute;right:0;top:40px;
                     background:#fff;box-shadow:0 6px 18px rgba(0,0,0,0.15);
                     border-radius:8px;min-width:180px;">

                    <a href="${base}${dashboard}" class="dropdown-item">Dashboard</a>
                    <a href="${base}profile.html" class="dropdown-item">Profile</a>
                    <a href="${base}settings.html" class="dropdown-item">Settings</a>
                    <a href="#" id="logoutBtn" class="dropdown-item" style="color:#b42318;">Logout</a>
                </div>
            </div>
        `;

        const btn = document.getElementById('profileBtn');
        const dropdown = document.getElementById('profileDropdown');

        btn.onclick = () => {
            dropdown.style.display =
                dropdown.style.display === 'block'
                    ? 'none'
                    : 'block';
        };

        document.addEventListener('click', e => {
            if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        document.getElementById('logoutBtn').onclick = e => {
            e.preventDefault();
            window.Api.clearToken();
            window.location.href = '../index.html';
        };
    }

    async function initNavbarAuth() {

        const nav = getNavActions();
        if (!nav) return;

        if (!window.Api?.getToken?.()) {
            renderGuest(nav);
            return;
        }

        try {
            const res = await Api.get('/api/users/me');
            const user = res.data || res;
            renderLoggedIn(nav, user);
        } catch (e) {
            Api.clearToken();
            renderGuest(nav);
        }
    }

    document.addEventListener('DOMContentLoaded', initNavbarAuth);

})();
document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {

            // remove token
            localStorage.removeItem("token");

            // optional: clear everything
            localStorage.clear();

            // redirect to home
            window.location.href = "/index.html";
        });
    }

});