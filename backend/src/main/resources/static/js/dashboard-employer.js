(function () {
    async function init() {
        if (!requireAuth('Please login to continue')) return;

        const jobsRes = await Api.get('/api/employer/jobs');
        const jobs = jobsRes.data || [];
        document.getElementById('employerJobsList').innerHTML = jobs.length
            ? jobs.map(j => `<div data-job="${j.id}">• ${j.title} - ${j.location}</div>`).join('')
            : '<p>No jobs posted yet.</p>';

        const applicants = [];
        for (const job of jobs) {
            const appRes = await Api.get(`/api/jobs/${job.id}/applications`);
            const list = appRes.data || [];
            applicants.push(`<div><strong>${job.title}:</strong> ${list.length} applicant(s)</div>`);
        }
        document.getElementById('jobApplicantsList').innerHTML = applicants.join('') || '<p>No applicants yet.</p>';
    }

    document.addEventListener('DOMContentLoaded', () => {
        init().catch((e) => showToast(e.message || 'Failed loading employer dashboard', 'error'));
    });
})();