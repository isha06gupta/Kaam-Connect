(function () {
    async function loadOverview() {
        const response = await Api.get('/api/ngo/dashboard-overview');
        const data = response.data || {};
        document.getElementById('totalWorkers').textContent = data.totalWorkers || 0;
        document.getElementById('verifiedWorkers').textContent = data.verifiedWorkers || 0;
        document.getElementById('openDisputes').textContent = data.openDisputes || 0;
        document.getElementById('pendingPaymentsCount').textContent = data.pendingPayments || 0;
    }

    async function loadWorkers() {
        const response = await Api.get('/api/ngo/workers');
        const workers = response.data || [];
        const rows = workers.map((w) => `
            <tr>
                <td>${w.fullname || ''}</td>
                <td>${w.mobile || ''}</td>
                <td>${w.skill || ''}</td>
                <td>${w.ngoVerified ? 'NGO Verified' : 'Not Verified'}</td>
                <td>
                    <button class="btn-primary" onclick="verifyWorker(${w.id})">Approve</button>
                    <button class="btn-outline" onclick="rejectWorker(${w.id})">Reject</button>
                </td>
            </tr>
        `).join('');

        document.getElementById('workersTable').innerHTML = `
            <table style="width:100%;border-collapse:collapse;">
                <tr><th>Name</th><th>Mobile</th><th>Skill</th><th>Status</th><th>Actions</th></tr>
                ${rows || '<tr><td colspan="5">No workers found.</td></tr>'}
            </table>
        `;
    }

    async function loadPendingPayments() {
        const response = await Api.get('/api/ngo/pending-payments');
        const jobs = response.data || [];
        const rows = jobs.map((j) => `
            <tr>
                <td>${j.title || ''}</td>
                <td>${j.location || ''}</td>
                <td>${j.employerMarkedComplete ? 'Yes' : 'No'}</td>
                <td>${j.workerConfirmedPayment ? 'Yes' : 'No'}</td>
            </tr>
        `).join('');

        document.getElementById('paymentsTable').innerHTML = `
            <table style="width:100%;border-collapse:collapse;">
                <tr><th>Job</th><th>Location</th><th>Employer Marked Complete</th><th>Worker Confirmed Payment</th></tr>
                ${rows || '<tr><td colspan="4">No pending payment cases.</td></tr>'}
            </table>
        `;
    }

    async function loadDisputes() {
        const response = await Api.get('/api/ngo/disputes');
        const disputes = response.data || [];
        const rows = disputes.map((d) => `
            <tr>
                <td>${d.jobId}</td>
                <td>${d.raisedBy}</td>
                <td>${d.description || ''}</td>
                <td>${d.status}</td>
                <td>${d.status === 'OPEN' ? `<button class="btn-primary" onclick="resolveDispute(${d.id})">Resolve</button>` : ''}</td>
            </tr>
        `).join('');

        document.getElementById('disputesTable').innerHTML = `
            <table style="width:100%;border-collapse:collapse;">
                <tr><th>Job ID</th><th>Raised By</th><th>Description</th><th>Status</th><th>Action</th></tr>
                ${rows || '<tr><td colspan="5">No disputes found.</td></tr>'}
            </table>
        `;
    }

    async function loadTrainings() {
        const response = await Api.get('/api/trainings');
        const trainings = response.data || [];
        document.getElementById('trainingList').innerHTML = trainings.length
            ? trainings.map((t) => `<div class="job-card" style="margin-top:0.5rem;"><h4>${t.title}</h4><p>${t.description}</p></div>`).join('')
            : '<p>No training programs yet.</p>';
    }

    async function verifyWorker(id) {
        await Api.put(`/api/ngo/verify/${id}`, {});
        showToast('Worker approved', 'success');
        await refreshAll();
    }

    async function rejectWorker(id) {
        await Api.put(`/api/ngo/reject/${id}`, {});
        showToast('Worker rejected', 'success');
        await refreshAll();
    }

    async function resolveDispute(id) {
        await Api.put(`/api/ngo/disputes/resolve/${id}`, {});
        showToast('Dispute resolved', 'success');
        await refreshAll();
    }

    async function createTraining(event) {
        event.preventDefault();
        const payload = {
            title: document.getElementById('trainingTitle').value.trim(),
            description: document.getElementById('trainingDescription').value.trim()
        };

        await Api.post('/api/ngo/trainings', payload);
        showToast('Training created', 'success');
        event.target.reset();
        await loadTrainings();
    }

    async function refreshAll() {
        await Promise.all([loadOverview(), loadWorkers(), loadPendingPayments(), loadDisputes(), loadTrainings()]);
    }

    window.verifyWorker = (id) => verifyWorker(id).catch((e) => showToast(e.message || 'Failed', 'error'));
    window.rejectWorker = (id) => rejectWorker(id).catch((e) => showToast(e.message || 'Failed', 'error'));
    window.resolveDispute = (id) => resolveDispute(id).catch((e) => showToast(e.message || 'Failed', 'error'));

    document.addEventListener('DOMContentLoaded', () => {
        if (!requireAuth('Please login to continue')) return;
        refreshAll().catch((e) => showToast(e.message || 'Failed loading NGO dashboard', 'error'));
        document.getElementById('trainingForm')?.addEventListener('submit', (e) => {
            createTraining(e).catch((err) => showToast(err.message || 'Failed creating training', 'error'));
        });
    });
})();