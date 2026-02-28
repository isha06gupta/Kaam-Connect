// Jobs page JavaScript (backend-integrated)

let currentJobs = [];
let toastScriptPromise = null;

function createStatusMessage() {
    let box = document.getElementById('jobsStatusMessage');

    if (!box) {
        box = document.createElement('div');
        box.id = 'jobsStatusMessage';
        box.style.marginBottom = '1rem';
        box.style.padding = '0.75rem 1rem';
        box.style.borderRadius = '8px';
        box.style.fontSize = '0.95rem';

        const jobsGrid = document.getElementById('jobsGrid');
        jobsGrid?.parentElement?.insertBefore(box, jobsGrid);
    }

    return box;
}

function showStatus(message, type = 'info') {
    const box = createStatusMessage();
    if (!box) return;

    const styles = {
        success: { bg: '#e8f8ee', color: '#1f7a3e', border: '#b8e6c8' },
        error: { bg: '#fdeaea', color: '#b42318', border: '#f3b3b3' },
        info: { bg: '#eef4ff', color: '#1d4ed8', border: '#c9dcff' }
    };

    const s = styles[type] || styles.info;

    box.style.display = 'block';
    box.style.background = s.bg;
    box.style.color = s.color;
    box.style.border = `1px solid ${s.border}`;
    box.textContent = message;
}

function ensureToast() {
    if (typeof window.showToast === 'function') {
        return Promise.resolve();
    }

    if (toastScriptPromise) {
        return toastScriptPromise;
    }

    toastScriptPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = '../js/toast.js';
        script.onload = () => resolve();
        script.onerror = () => resolve();
        document.head.appendChild(script);
    });

    return toastScriptPromise;
}

async function toastOrStatus(message, type) {
    await ensureToast();

    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
        return;
    }

    showStatus(message, type === 'error' ? 'error' : 'success');
}

function mapJob(job = {}) {
    return {
        id: job.id,
        title: job.title || 'Untitled Job',
        company: job.company || 'Unknown Company',
        location: job.location || 'Location not specified',
        category: job.category || 'general',
        type: job.paymentType || 'Not specified',
        salary: job.paymentAmount || 'Not specified',
        duration: job.duration || 'Not specified',
        badge: job.urgent ? 'URGENT' : null,
        description: job.description || 'No description available.',
        posted: 'Recently'
    };
}

function renderJobs(jobs) {
    const jobsGrid = document.getElementById('jobsGrid');
    if (!jobsGrid) return;

    jobsGrid.innerHTML = '';

    if (!jobs.length) {
        jobsGrid.innerHTML = '<p>No jobs found.</p>';
        return;
    }

    jobs.forEach((job, index) => {
        const jobCard = createJobCard(job, index);
        jobsGrid.appendChild(jobCard);
    });
}

function createJobCard(job, index) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
        <div class="job-header">
            <span class="job-category">${job.category}</span>
            ${job.badge ? `<span class="job-badge">${job.badge}</span>` : ''}
        </div>

        <h3 class="job-title">${job.title}</h3>
        <p class="job-company">${job.company}</p>

        <div class="job-details">
            <div class="job-detail">📍 ${job.location}</div>
            <div class="job-detail">💼 ${job.type}</div>
            <div class="job-detail">🕐 ${job.posted}</div>
        </div>

        <p class="job-description">${job.description}</p>

        <div class="job-footer">
            <div class="job-salary">${job.salary}</div>
            <button class="job-apply" onclick="applyJob(${job.id})">
                Apply Now
            </button>
        </div>
    `;

    return card;
}

async function fetchJobs(params = {}) {
    try {
        const response = await Api.get('/api/jobs', params);
        const jobs = Array.isArray(response)
            ? response
            : (response?.data || []);

        currentJobs = jobs.map(mapJob);
        renderJobs(currentJobs);

    } catch (error) {

        console.error('Fetch Jobs Error:', error);

        const message =
            error?.payload?.message ||
            error?.message ||
            'Unable to load jobs.';

        renderJobs([]);
        showStatus(message, 'error');
    }
}

function searchJobs() {
    const keyword =
        document.getElementById('searchKeyword')?.value?.trim() || '';

    const location =
        document.getElementById('searchLocation')?.value?.trim() || '';

    const category =
        document.getElementById('searchCategory')?.value || '';

    fetchJobs({ keyword, location, category });
}

async function applyJob(jobId) {

    if (typeof requireAuth === 'function' && !requireAuth('Please login to apply')) {
        return;
    }

    try {
        await Api.post(`/api/jobs/${jobId}/apply`, {});
        await toastOrStatus('Application submitted successfully', 'success');

    } catch (error) {

        console.log('Apply Error:', error);

        const message =
            error?.payload?.message ||
            error?.message ||
            'Unable to submit application.';

        await toastOrStatus(message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchJobs();
});

window.searchJobs = searchJobs;
window.applyJob = applyJob;