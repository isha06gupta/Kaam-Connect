(function () {
    async function loadProfile() {
        if (!requireAuth('Please login to continue')) return;
        const response = await Api.get('/api/users/me');
        const user = response.data || response;
        document.getElementById('fullname').value = user.fullname || '';
        document.getElementById('mobile').value = user.mobile || '';
        document.getElementById('location').value = user.location || '';

        const existing = document.getElementById('ngoVerifiedBadge');
        if (existing) {
            existing.remove();
        }

        if (user.ngoVerified) {
            const badge = document.createElement('div');
            badge.id = 'ngoVerifiedBadge';
            badge.className = 'job-badge';
            badge.style.marginBottom = '1rem';
            badge.textContent = 'NGO Verified';
            const form = document.getElementById('profilePageForm');
            form?.prepend(badge);
        }
    }

    async function saveProfile(event) {
        event.preventDefault();
        const payload = {
            fullname: document.getElementById('fullname').value.trim(),
            mobile: document.getElementById('mobile').value.trim(),
            location: document.getElementById('location').value.trim()
        };

        await Api.put('/api/users/me', payload);
        showToast('Profile updated successfully', 'success');
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadProfile().catch((e) => showToast(e.message || 'Failed to load profile', 'error'));
        document.getElementById('profilePageForm')?.addEventListener('submit', (e) => {
            saveProfile(e).catch((err) => showToast(err.message || 'Failed to update profile', 'error'));
        });
    });
})();