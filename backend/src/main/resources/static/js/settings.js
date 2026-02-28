(function () {
    function init() {
        if (!requireAuth('Please login to continue')) return;

        const notifToggle = document.getElementById('notifToggle');
        notifToggle.checked = localStorage.getItem('notifications_enabled') !== 'false';
        notifToggle.addEventListener('change', () => {
            localStorage.setItem('notifications_enabled', String(notifToggle.checked));
            showToast('Notification preference saved', 'success');
        });

        document.getElementById('savePassword')?.addEventListener('click', () => {
            showToast('Password updated (demo)', 'success');
        });

        document.getElementById('logoutEverywhere')?.addEventListener('click', () => {
            Api.clearToken();
            showToast('Logged out from this device', 'success');
            setTimeout(() => { window.location.href = '../index.html'; }, 500);
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();