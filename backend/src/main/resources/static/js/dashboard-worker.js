(function () {
    async function init() {
        if (!requireAuth('Please login to continue')) return;

        const meRes = await Api.get('/api/users/me');
        const me = meRes.data || meRes;
        document.getElementById('workerProfileSummary').textContent = `${me.fullname} • ${me.mobile} • ${me.location || 'N/A'}`;

        const appliedRes = await Api.get('/api/jobs/applied');
        const jobs = appliedRes.data || [];
        const html = jobs.length ? jobs.map(j => `<div>• ${j.title} (${j.location})</div>`).join('') : '<p>No applied jobs yet.</p>';
        document.getElementById('appliedJobsList').innerHTML = html;
        document.getElementById('workHistoryList').innerHTML = html;
    }

    document.addEventListener('DOMContentLoaded', () => {
        init().catch((e) => showToast(e.message || 'Failed loading dashboard', 'error'));
    });
})();